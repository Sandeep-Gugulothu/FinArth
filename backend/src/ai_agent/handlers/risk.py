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

class RiskHandler(BaseHandler):
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        self.client = OpikConfig.track_openai_client(self.client)

    def _get_user_profile(self, user_id: int):
        if not user_id:
             return None
        try:
            conn = sqlite3.connect(str(db_path))
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT risk_preference, age, country FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            
            # Also get holdings for context
            cursor.execute("SELECT category, amount FROM portfolio_holdings WHERE user_id = ?", (user_id,))
            holdings = cursor.fetchall()
            
            conn.close()
            
            return {
                "profile": dict(row) if row else {},
                "holdings": [dict(h) for h in holdings]
            }
        except Exception as e:
            print(f"DB Error: {e}")
            return None

    @trace(name="handler_risk_process")
    async def process(self, query: str, user_id: Optional[int], context: Dict[str, Any] = {}) -> AgentResponse:
        """
        Analyzes the risk associated with the user's portfolio and profile.
        """
        if not user_id:
             return AgentResponse(
                 content="I need you to be logged in to assess your risk profile.",
                 intent=AgentIntent.RISK_ASSESSMENT,
                 metadata={"error": "User not logged in"}
             )

        data = self._get_user_profile(user_id)
        if not data or not data["profile"]:
            return AgentResponse(
                content="I couldn't find your risk profile. Please update it in your settings.",
                intent=AgentIntent.RISK_ASSESSMENT,
                 metadata={"status": "missing_profile"}
            )
            
        profile = data["profile"]
        holdings = data["holdings"]
        market_context = await MarketDataService.get_market_context()

        # Simple aggregation for prompt
        allocation_summary = {}
        for h in holdings:
            allocation_summary[h['category']] = allocation_summary.get(h['category'], 0) + h['amount']

        prompt = f"""You are a Risk Manager named FinArth.
        
        User Query: "{query}"

        User Profile:
        - Age: {profile.get('age', 'Unknown')}
        - Risk Preference: {profile.get('risk_preference', 'Unknown')}
        - Country: {profile.get('country', 'Unknown')}
        
        Current Portfolio Allocation:
        {json.dumps(allocation_summary, indent=2)}
        
        Market Context:
        {market_context}
        
        Task:
        Perform a Gap Analysis. Does the user's actual portfolio align with their stated risk preference?
        For example, if they are "Low Risk" but hold 90% Crypto, warn them.
        If they are "High Risk" but hold only Cash, suggest growth assets.
        Reference specific market risks from the context.
        """

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
            
            return AgentResponse(
                content=content,
                intent=AgentIntent.RISK_ASSESSMENT,
                metadata={
                    "handler": "RiskHandler",
                    "risk_preference": profile.get('risk_preference')
                }
            )
            
        except Exception as e:
            return AgentResponse(
                content=f"API Error ({MODEL_NAME}): {str(e)}",
                intent=AgentIntent.RISK_ASSESSMENT,
                metadata={"error": str(e)}
            )
