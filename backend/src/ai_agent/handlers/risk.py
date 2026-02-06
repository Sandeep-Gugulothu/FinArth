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

MODEL_NAME = 'google/gemini-2.0-flash-exp:free'

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

        system_message = f"""You are FinArth, a Risk Management Specialist focused on portfolio alignment and risk assessment.

User Profile:
- Age: {profile.get('age', 'Unknown')}
- Risk Preference: {profile.get('risk_preference', 'Unknown')}
- Country: {profile.get('country', 'Unknown')}

Current Portfolio Allocation:
{json.dumps(allocation_summary, indent=2)}

Guidelines:
1. Perform Gap Analysis: Does portfolio match stated risk preference?
2. Warn if Low Risk user holds high-volatility assets (>50% crypto/stocks)
3. Suggest growth assets if High Risk user is too conservative
4. Reference specific market risks from current conditions
5. Provide actionable rebalancing recommendations

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
