import os
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from ai_agent.types import AgentResponse, AgentIntent
from ai_agent.handlers.base import BaseHandler
from ai_agent.tools import MarketDataService
from utils.opik_client import OpikConfig, trace

# Using DeepSeek R1 for specialized reasoning and analysis
MODEL_NAME = 'liquid/lfm-2.5-1.2b-instruct:free'

from ai_agent.engine.user_service import UserService

class MarketAnalystHandler(BaseHandler):
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        self.client = OpikConfig.track_openai_client(self.client)

    @trace(name="handler_market_analyst_process")
    async def process(self, query: str, user_id: Optional[int], context: Dict[str, Any] = {}) -> AgentResponse:
        """
        Provides deep analysis of market trends and real-time sentiment.
        """
        user_profile = UserService.get_user_profile(user_id) if user_id else {}
        user_name = user_profile.get('name', 'User')
        user_country = user_profile.get('country', 'International')
        
        market_data = await MarketDataService.get_market_context()

        prompt = f"""You are a Senior Market Strategist named FinArth.
        Your goal is to provide a deep, data-driven analysis of the current market conditions.
        
        User Information:
        - Name: {user_name}
        - Location: {user_country}
        
        User Query: "{query}"

        Real-Time Market Context (Simulated):
        {market_data}
        
        Task:
        1. Analyze the user's specific query against the market context.
        2. Identify key trends, support/resistance levels, or sentiment shifts.
        3. Provide actionable insights (avoid generic advice).
        4. Use a professional, analytical tone.
        
        CRITICAL PERSONALIZATION:
        If the user is from India (Location: India):
        - Focus suggestions on Indian Stocks (NSE/BSE) and Crypto assets that are legally accessible in India.
        - Mention relevant Indian regulations or taxes (like the 30% crypto tax) if applicable to the query.
        - Use local terminology if appropriate.
        
        If the query is about a specific coin or stock, focus the analysis there, but still consider the user's location for regulatory context.
        """

        # Require reasoning step for better transparency
        prompt += "\n\nProvide your response in two parts: <thought>Your analytical reasoning</thought> followed by your <answer>Final Market Insight</answer>."

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}],
                extra_body={
                    "metadata": {
                        "handler": "MarketAnalystHandler",
                        "user_id": user_id,
                        "location": user_country
                    }
                }
            )
            content = response.choices[0].message.content
            
            return AgentResponse(
                content=content,
                intent=AgentIntent.MARKET_ANALYSIS,
                metadata={
                    "handler": "MarketAnalystHandler",
                    "model": MODEL_NAME,
                    "location": user_country
                }
            )
            
        except Exception as e:
            return AgentResponse(
                content=f"API Error ({MODEL_NAME}): {str(e)}",
                intent=AgentIntent.MARKET_ANALYSIS,
                metadata={"error": str(e)}
            )
