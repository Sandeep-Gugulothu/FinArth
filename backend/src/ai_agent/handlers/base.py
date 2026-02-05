from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from ai_agent.types import AgentResponse, AgentIntent

class BaseHandler(ABC):
    """
    Abstract Base Class for all specialized agent handlers.
    """
    
    @abstractmethod
    async def process(self, query: str, user_id: Optional[int], context: Dict[str, Any] = {}) -> AgentResponse:
        """
        Process the user query and return an AgentResponse.
        
        Args:
            query: The user's input question
            user_id: The ID of the authenticated user (if any)
            context: Additional context from the router/orchestrator
            
        Returns:
            AgentResponse containing the final answer and metadata
        """
        pass
