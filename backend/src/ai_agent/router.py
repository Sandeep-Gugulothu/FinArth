import json
import os
from openai import OpenAI
from typing import List, Dict, Any
from ai_agent.types import AgentIntent, RouterResult
from utils.opik_client import OpikConfig, trace

MODEL_NAME = 'liquid/lfm-2.5-1.2b-instruct:free'

class IntentRouter:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        # Wrap with Opik if available
        self.client = OpikConfig.track_openai_client(self.client)

    @trace(name="router_classify")
    async def classify(self, query: str, history: List[Dict[str, Any]] = []) -> RouterResult:
        """
        Classifies the user query into a specific financial intent.
        """
        
        system_prompt = """You are an expert financial intent classifier. 
        Analyze the user's query and conversation history to determine the most appropriate specific intent.
        
        Available Intents:
        1. PORTFOLIO_ANALYSIS: Questions about current holdings, performance, asset allocation, or "how am I doing?".
        2. RISK_ASSESSMENT: Questions about volatility, safety, risk profile, market downturns.
        3. INVESTMENT_PLANNING: Questions about new goals, retirement, saving for a car, or "what should I buy?".
        4. GENERAL_ADVICE: General financial concepts, market news, definitions, or casual chat.
        5. MARKET_ANALYSIS: Specific requests for stock market trends, crypto analysis, current news, bitcon price, or "what's happening in the market?".

        Output MUST be valid JSON in the following format:
        {
            "intent": "INTENT_NAME",
            "confidence": 0.0-1.0,
            "reasoning": "Brief explanation of why"
        }
        """

        # Format history for context
        history_text = ""
        if history:
            history_text = "Recent Conversation History:\n" + "\n".join(
                [f"{msg.get('role', 'user')}: {msg.get('content', '')}" for msg in history[-3:]]
            )

        user_prompt = f"""{history_text}
        
        Current User Query: "{query}"
        
        Classify this query."""

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
            intent_str = data.get("intent", "GENERAL_ADVICE").upper()
            # Fallback for safety
            if intent_str not in AgentIntent.__members__:
                intent_str = "GENERAL_ADVICE"
                
            return RouterResult(
                intent=AgentIntent(intent_str),
                confidence=float(data.get("confidence", 0.5)),
                reasoning=data.get("reasoning", "Parsed from LLM")
            )

        except Exception as e:
            print(f"Router Error: {e}")
            # Instead of fallback, propagate the error or return a better result
            # but for classification we need a fallback to proceed.
            # We'll log it and fallback to GENERAL_ADVICE but with the error context.
            return RouterResult(
                intent=AgentIntent.GENERAL_ADVICE,
                confidence=0.0,
                reasoning=f"System Error: {str(e)}"
            )
