import os
import sqlite3 
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from ai_agent.types import AgentResponse, AgentIntent
from ai_agent.handlers.base import BaseHandler
from ai_agent.tools import MarketDataService
from utils.opik_client import OpikConfig, trace
from database import db_path

MODEL_NAME = 'meta-llama/llama-3.1-8b-instruct:free'

from ai_agent.engine.user_service import UserService

class PlanHandler(BaseHandler):
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        self.client = OpikConfig.track_openai_client(self.client)

    @trace(name="handler_planning_process")
    async def process(self, query: str, user_id: Optional[int], context: Dict[str, Any] = {}) -> AgentResponse:
        """
        Helps user with investment planning and goal setting.
        """
        if not user_id:
             return AgentResponse(
                 content="I need you to be logged in to help with your investment plans.",
                 intent=AgentIntent.INVESTMENT_PLANNING,
                 metadata={"error": "User not logged in"}
             )

        user_profile = UserService.get_user_profile(user_id)
        user_name = user_profile.get('name', 'User')
        user_country = user_profile.get('country', 'International')
        objectives = user_profile.get('selected_options', [])
        
        market_context = await MarketDataService.get_market_context()

        system_message = f"""You are FinArth, a Strategic Financial Planner specializing in goal-based investing.

User Profile:
- Name: {user_name}
- Location: {user_country}
- Age: {user_profile.get('age', 'Unknown')}
- Target Returns: {user_profile.get('return_estimate', 'Unknown')}
- Current Goals: {', '.join(objectives) if objectives else "None set"}

Guidelines:
1. Provide concrete, actionable investment plans
2. For India: Suggest PPF, NPS, ELSS, Indian Mutual Funds, 80C tax benefits
3. Recommend diversified asset allocation (equity/debt/gold splits)
4. Validate if goals are realistic given market conditions
5. Address user by name and personalize advice

Market Context:
{market_context}"""

        messages = [{"role": "system", "content": system_message}]
        
        if context.get('conversation_history'):
            messages.extend(context['conversation_history'][-6:])
        
        messages.append({"role": "user", "content": query})

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages,
                temperature=0.7,
                max_tokens=800
            )
            content = response.choices[0].message.content
            
            return AgentResponse(
                content=content,
                intent=AgentIntent.INVESTMENT_PLANNING,
                metadata={
                    "handler": "PlanHandler",
                    "goals_count": len(objectives)
                }
            )
            
        except Exception as e:
            return AgentResponse(
                content=f"API Error ({MODEL_NAME}): {str(e)}",
                intent=AgentIntent.INVESTMENT_PLANNING,
                metadata={"error": str(e)}
            )
