import os
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from ai_agent.types import AgentResponse, AgentIntent
from ai_agent.handlers.base import BaseHandler
from ai_agent.tools import MarketDataService
from utils.opik_client import OpikConfig, trace

MODEL_NAME = 'meta-llama/llama-3.1-8b-instruct:free'

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

        system_message = f"""You are a Senior Market Strategist named FinArth with expertise in technical and fundamental analysis.

User Profile:
- Name: {user_name}
- Location: {user_country}

Guidelines:
1. Provide data-driven analysis with specific trends and levels
2. Consider {user_country} regulations and market access
3. For India: Focus on NSE/BSE stocks and compliant crypto assets
4. Use professional, analytical tone with actionable insights
5. Always mention risk factors and market volatility

Market Context:
{market_data}"""

        messages = [{"role": "system", "content": system_message}]
        
        if context.get('conversation_history'):
            messages.extend(context['conversation_history'][-6:])
        
        messages.append({"role": "user", "content": query})

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                temperature=0.7,
                max_tokens=800,
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
