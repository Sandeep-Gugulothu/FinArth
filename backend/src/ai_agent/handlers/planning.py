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

MODEL_NAME = 'liquid/lfm-2.5-1.2b-instruct:free'

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

        prompt = f"""You are a Strategic Financial Planner named FinArth.
        
        User Information:
        - Name: {user_name}
        - Location: {user_country}
        - Age: {user_profile.get('age', 'Unknown')}
        - Target Returns: {user_profile.get('return_estimate', 'Unknown')}
        - Current Goals: {', '.join(objectives) if objectives else "None set"}
        
        Market Context:
        {market_context}
        
        Task:
        Provide concrete planning advice for {user_name}. 
        
        CRITICAL PERSONALIZATION:
        If {user_name} is from India (Location: India):
        - Suggest investment vehicles specific to India (e.g., PPF, NPS, ELSS, Indian Mutual Funds).
        - Use Indian risk-reward metrics and tax saving sections (like 80C) where relevant.
        - Ensure any crypto advice follows Indian regulations.
        
        General Task:
        1. Analyze if their goals are realistic given market conditions.
        2. Suggest a diversified asset split (e.g., 50% Equity, 30% Debt) suitable for their profile.
        3. Address the user by name.
        """

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}]
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
