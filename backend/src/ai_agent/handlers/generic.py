import os
from typing import Dict, Any, Optional
from openai import OpenAI
from ai_agent.types import AgentResponse, AgentIntent
from ai_agent.handlers.base import BaseHandler
from utils.opik_client import OpikConfig, trace

from ai_agent.engine.user_service import UserService

class GenericHandler(BaseHandler):
    def __init__(self):
        self.client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )
        self.client = OpikConfig.track_openai_client(self.client)
        # Upgraded to a more capable model for better financial advice
        self._model_name = os.getenv('MODEL_NAME')  # or 'mistralai/mistral-7b-instruct:free'

    @trace(name="handler_generic_process")
    async def process(self, query: str, user_id: Optional[int], context: Dict[str, Any] = {}) -> AgentResponse:
        """
        Handles general financial questions or casual chat.
        """
        user_profile = UserService.get_user_profile(user_id) if user_id else {}
        user_name = user_profile.get('name', 'User')
        user_country = user_profile.get('country', 'International')
        risk_tolerance = user_profile.get('risk_tolerance', 'moderate')
        age = user_profile.get('age', 'unknown')
        
        # Build context-aware system message
        system_message = f"""You are FinArth, an expert AI financial advisor with deep knowledge in:
- Personal finance, budgeting, and savings strategies
- Investment planning (stocks, bonds, ETFs, mutual funds, real estate)
- Retirement planning and tax optimization
- Risk management and portfolio diversification
- Financial goal setting and wealth building

User Profile:
- Name: {user_name}
- Location: {user_country}
- Risk Tolerance: {risk_tolerance}
- Age: {age}

Guidelines:
1. Provide actionable, personalized advice based on the user's profile
2. Use clear explanations with examples when discussing complex concepts
3. Consider local regulations, currency, and tax implications for {user_country}
4. Be conversational yet professional
5. If discussing investments, always mention risk factors
6. Encourage long-term thinking and disciplined investing
7. Never guarantee returns or make promises about market performance"""

        # Include conversation history if available
        messages = [{"role": "system", "content": system_message}]
        
        if context.get('conversation_history'):
            messages.extend(context['conversation_history'][-6:])  # Last 3 exchanges
        
        messages.append({"role": "user", "content": query})

        try:
            response = self.client.chat.completions.create(
                model=self._model_name,
                messages=messages,
                temperature=0.7,
                max_tokens=1500,
                extra_body={
                    "metadata": {
                        "handler": "GenericHandler",
                        "user_id": user_id
                    }
                }
            )
            content = response.choices[0].message.content
            
            return AgentResponse(
                content=content,
                intent=AgentIntent.GENERAL_ADVICE,
                metadata={"handler": "GenericHandler"}
            )
            
        except Exception as e:
            return AgentResponse(
                content=f"API Error ({self._model_name}): {str(e)}",
                intent=AgentIntent.GENERAL_ADVICE,
                metadata={"error": str(e)}
            )
