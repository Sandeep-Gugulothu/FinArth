from typing import Dict, Any, Optional
from ai_agent.types import AgentResponse, AgentIntent, RouterResult
from ai_agent.router import IntentRouter
from ai_agent.handlers.portfolio import PortfolioHandler
from ai_agent.handlers.risk import RiskHandler
from ai_agent.handlers.planning import PlanHandler
from ai_agent.handlers.generic import GenericHandler
from ai_agent.handlers.market_analyst import MarketAnalystHandler
from utils.opik_client import OpikConfig, trace

class AgentOrchestrator:
    def __init__(self):
        self.router = IntentRouter()
        self.handlers = {
            AgentIntent.PORTFOLIO_ANALYSIS: PortfolioHandler(),
            AgentIntent.RISK_ASSESSMENT: RiskHandler(),
            AgentIntent.INVESTMENT_PLANNING: PlanHandler(),
            AgentIntent.GENERAL_ADVICE: GenericHandler(),
            AgentIntent.MARKET_ANALYSIS: MarketAnalystHandler()
        }

    @trace(name="agent_orchestrator_process")
    async def process(self, query: str, user_id: Optional[int] = None, history: list = []) -> AgentResponse:
        """
        Main entry point for the AI Agent.
        Orchestrates the flow: Query -> Router -> Handler -> Response.
        """
        
        # 1. Route the query
        router_result = await self.router.classify(query, history)
        
        # 2. Select Handler
        handler = self.handlers.get(router_result.intent, self.handlers[AgentIntent.GENERAL_ADVICE])
        
        # 3. Process with Handler
        # Pass router context and conversation history to handler
        context = {
            "intent_confidence": router_result.confidence,
            "intent_reasoning": router_result.reasoning,
            "original_query": query,
            "conversation_history": history  # Pass conversation history
        }
        
        response = await handler.process(query, user_id, context)
        
        # Ensure traces are sent
        OpikConfig.flush()
        
        return response
