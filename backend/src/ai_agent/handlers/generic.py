import os
from typing import Dict, Any, Optional
from openai import OpenAI
from ai_agent.types import AgentResponse, AgentIntent
from ai_agent.handlers.base import BaseHandler
from utils.opik_client import OpikConfig, trace

MODEL_NAME = 'liquid/lfm-2.5-1.2b-instruct:free'

from ai_agent.engine.user_service import UserService

class GenericHandler(BaseHandler):
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        self.client = OpikConfig.track_openai_client(self.client)

    @trace(name="handler_generic_process")
    async def process(self, query: str, user_id: Optional[int], context: Dict[str, Any] = {}) -> AgentResponse:
        """
        Handles general financial questions or casual chat.
        """
        user_profile = UserService.get_user_profile(user_id) if user_id else {}
        user_name = user_profile.get('name', 'User')
        user_country = user_profile.get('country', 'International')

        prompt = f"""You are a helpful financial assistant named FinArth.
        
        User Context:
        - Name: {user_name}
        - Location: {user_country}
        
        Answer the user's question clearly and concisely. 
        If relevant, consider their location for context (e.g., local currency or tax basics).
        Always address the user by name if it's not "User".
        
        User Query: {query}
        """

        try:
            response = self.client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response.choices[0].message.content
            
            return AgentResponse(
                content=content,
                intent=AgentIntent.GENERAL_ADVICE,
                metadata={"handler": "GenericHandler"}
            )
            
        except Exception as e:
            return AgentResponse(
                content=f"API Error ({MODEL_NAME}): {str(e)}",
                intent=AgentIntent.GENERAL_ADVICE,
                metadata={"error": str(e)}
            )
