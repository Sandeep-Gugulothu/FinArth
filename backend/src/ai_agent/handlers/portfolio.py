import os
import sqlite3 
import json
from typing import Dict, Any, Optional
from openai import OpenAI
from ai_agent.types import AgentResponse, AgentIntent
from ai_agent.handlers.base import BaseHandler
from ai_agent.tools import MarketDataService
from utils.opik_client import OpikConfig, trace
from database import db_path  # Import db_path to connect
from ai_agent.engine.portfolio_analyzer import PortfolioAnalyzer

MODEL_NAME = 'meta-llama/llama-3.1-8b-instruct:free'

from ai_agent.engine.user_service import UserService

class PortfolioHandler(BaseHandler):
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        self.client = OpikConfig.track_openai_client(self.client)

    def _get_user_holdings(self, user_id: int):
        if not user_id:
            return []
        try:
            conn = sqlite3.connect(str(db_path))
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM portfolio_holdings WHERE user_id = ?", (user_id,))
            rows = cursor.fetchall()
            conn.close()
            return [dict(row) for row in rows]
        except Exception as e:
            print(f"DB Error: {e}")
            return []

    @trace(name="handler_portfolio_process")
    async def process(self, query: str, user_id: Optional[int], context: Dict[str, Any] = {}) -> AgentResponse:
        """
        Analyzes the user's portfolio holdings.
        """
        if not user_id:
             return AgentResponse(
                content="I need you to be logged in to analyze your portfolio.",
                intent=AgentIntent.PORTFOLIO_ANALYSIS,
                metadata={"error": "User not logged in"}
            )

        user_profile = UserService.get_user_profile(user_id)
        user_name = user_profile.get('name', 'User')
        user_country = user_profile.get('country', 'International')

        holdings = self._get_user_holdings(user_id)
        
        if not holdings:
            return AgentResponse(
                content=f"Hi {user_name}, I don't see any holdings in your portfolio yet. You can add them in the Dashboard.",
                intent=AgentIntent.PORTFOLIO_ANALYSIS,
                metadata={"status": "empty_portfolio"}
            )

        # Deterministic Analysis
        analysis = PortfolioAnalyzer.analyze_holdings(holdings)

        market_context = await MarketDataService.get_market_context()

        system_message = f"""You are FinArth, an expert Portfolio Analyst specializing in asset allocation and risk management.

User Profile:
- Name: {user_name}
- Location: {user_country}

Portfolio Summary:
- Total Value: ${analysis['total_value']:.2f}
- Risk Score: {analysis['risk_metric']}/10
- Allocation: {json.dumps(analysis['allocation'], indent=2)}
- Top Assets: {json.dumps(analysis['top_3_assets'], indent=2)}

Guidelines:
1. Provide specific insights on allocation, performance, and risk
2. For India: Consider Indian tax implications and market specifics
3. Warn if Risk Score > 7 about volatility
4. Suggest rebalancing if needed
5. Address user by name

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
                max_tokens=800,
                extra_body={
                    "metadata": {
                        "handler": "PortfolioHandler",
                        "user_id": user_id,
                        "holdings_count": len(holdings)
                    }
                }
            )
            content = response.choices[0].message.content
            
            return AgentResponse(
                content=content,
                intent=AgentIntent.PORTFOLIO_ANALYSIS,
                metadata={
                    "handler": "PortfolioHandler", 
                    "holdings_count": len(holdings),
                    "total_value": analysis['total_value'],
                    "model": MODEL_NAME
                }
            )
            
        except Exception as e:
            return AgentResponse(
                content=f"API Error ({MODEL_NAME}): {str(e)}",
                intent=AgentIntent.PORTFOLIO_ANALYSIS,
                metadata={"error": str(e)}
            )
