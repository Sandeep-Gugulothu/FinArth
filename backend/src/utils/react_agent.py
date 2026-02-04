"""
File Name: react_agent.py
Description: This file contains the code for calling the LLM using
             Reason+Act framework to generate financial insights.
             This file can consider user preferences if userId is provided.
Author Name: The FinArth Team
Creation Date: 24-Jan-2026
Modified Date: 27-Jan-2026
Version: 1.1

Instructions to run: This module can be imported from other backend system
                     files to invoke the generate_insight_with_reason_act
                     function.

File Execution State: Validation is in progress

Note: Make sure you update the API key with yours and defined in .env file.
      If you don't have one, then please feel to create one from the website
      below.
      https://openrouter.ai/settings/keys
"""

import os
import asyncio
import requests
from typing import List, Dict, Optional, Any
from dataclasses import dataclass
from openai import OpenAI
try:
    from opik.integrations.openai import track_openai
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    print("Warning: Opik integration disabled due to compatibility issues")
from utils.logger import Logger

logger = Logger.get_instance()
MODEL_NAME = 'nvidia/nemotron-3-nano-30b-a3b:free'

@dataclass
class ReActStep:
    thought: str
    action: Optional[str] = None
    observation: Optional[str] = None

@dataclass
class ReActResult:
    steps: List[ReActStep]
    final_answer: str

# Mock tool functions
class MockTools:
    @staticmethod
    async def fetch_project_data() -> str:
        return "Project data: Budget ₹50L, Timeline: 7 years, Risk tolerance: Moderate, Current savings: ₹12L"

    @staticmethod
    async def calculate_risk(data: str) -> str:
        return "Risk analysis: Market volatility 15%, Inflation risk 6%, Liquidity risk 3%"

    @staticmethod
    async def get_market_data() -> str:
        return "Market data: Equity returns 12%, Debt returns 7%, Real estate 9%"

# Reason+Act Agent class
class ReactAgent:
    # Constructor
    def __init__(self):
        """Initialize the ReAct agent with necessary configurations"""
        self._mock_tools = {
            'fetchProjectData': MockTools.fetch_project_data,
            'calculateRisk': MockTools.calculate_risk,
            'getMarketData': MockTools.get_market_data
        }

        # Initialize OpenAI client
        client = OpenAI(
            api_key=os.getenv('OPENROUTER_API_KEY'),
            base_url="https://openrouter.ai/api/v1"
        )

        self.opik_client: Any
        # Track OpenAI calls through opik if available
        if OPIK_AVAILABLE:
            try:
                self.opik_client = track_openai(client)
            except Exception as e:
                print(f"Opik tracking failed: {e}")
                self.opik_client = client
        else:
            self.opik_client = client

    async def get_single_llm_response(
            self,
            query: str,
            user_id: Optional[int] = None) -> str:
        logger.log_llm_call(MODEL_NAME, query, user_id)
        try:
            prompt_response = self.opik_client.chat.completions.create(
                model=MODEL_NAME,
                messages=[{"role": "user", "content": query}],
                max_tokens=100
            )
        except Exception as e:
            logger.log_llm_error('thought-step', e, user_id)
            prompt_response = None

        response = prompt_response.choices[0].message.content or "Unable to generate final answer."
        logger.log_llm_response(MODEL_NAME, len(response), user_id, {'type': 'response'})

        # Flush opik client to ensure all data is sent
        if OPIK_AVAILABLE and hasattr(self.opik_client, 'flush'):
            try:
                await self.opik_client.flush()
            except Exception:
                pass

        logger.info('ReAct agent process completed', user_id, {
            'final_answer_length': len(response)
        })
        # return the result to user
        return response

    async def get_multi_llm_response(
            self,
            query: str,
            user_id: Optional[int] = None) -> ReActResult:
        """Generate financial insights using ReAct framework"""
        logger.info('Starting ReAct agent process', user_id, {'user_id': user_id, 'query': query, 'model': MODEL_NAME})

        # ReAct process
        steps: List[ReActStep] = []
        user_context = ''

        # Get user preferences if user_id provided
        if user_id:
            try:
                logger.info('Fetching user preferences for LLM context', user_id)
                response = requests.get(f'http://localhost:8000/api/users/{user_id}/preferences')
                if response.status_code == 200:
                    data = response.json()
                    prefs = data['preferences']
                    user_context = f"""
            User Context:
            - Name: {prefs['name']}
            - Country: {prefs['country']}
            - Age: {prefs['age']}
            - Risk Preference: {prefs['riskPreference']}
            - Familiar Investments: {', '.join(prefs['familiarInvestments'])}
            - Investment Objectives: {', '.join(prefs['selectedOptions'])}
            """
                    logger.info('User preferences loaded for LLM context', user_id, {'preferences_loaded': True})
            except Exception as error:
                logger.log_llm_error('preferences-fetch', error, user_id)
        
        context = f"User Query: {query}{user_context}\n\n"

        # ReAct iterative steps
        for i in range(3):
            logger.debug(f'ReAct step {i + 1} starting', user_id, {'step': i + 1, 'context': context[:100]})
            # Thought step
            thought_prompt = f"""{context}
    Think step by step about this financial query. What do you need to analyze or what tool should you use?

    Available tools:
    - fetchProjectData: Get project financial details
    - calculateRisk: Analyze risk factors
    - getMarketData: Get current market information

    Respond with your reasoning in this format:
    Thought: [your reasoning]
    Action: [tool_name] (if needed, otherwise say "none")"""
            logger.log_llm_call(MODEL_NAME, thought_prompt, user_id, {'step': i + 1, 'type': 'thought'})
            try:
                thought_response = self.opik_client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[{"role": "user", "content": thought_prompt}],
                    max_tokens=2000
                )
            except Exception as e:
                logger.log_llm_error('thought-step', e, user_id)
                thought_response = None

            thought_content = thought_response.choices[0].message.content or ""
            logger.log_llm_response(MODEL_NAME, len(thought_content), user_id, {'step': i + 1, 'type': 'thought'})

            # Parse thought and action
            thought_lines = thought_content.split('\n')
            thought = ""
            action = None

            # Extract thought and action
            for line in thought_lines:
                if line.startswith('Thought:'):
                    thought = line.replace('Thought:', '').strip()
                elif line.startswith('Action:'):
                    action = line.replace('Action:', '').strip()
            if not thought:
                thought = thought_content

            step = ReActStep(thought=thought)
            # Action step (if needed)
            if action and action != "none" and action in self._mock_tools:
                logger.debug(f'Executing tool: {action}', user_id, {'step': i + 1, 'tool': action})
                step.action = action
                tool_result = await self._mock_tools[action]()
                step.observation = tool_result
                context += f"Step {i + 1}:\nThought: {thought}\nAction: {action}\nObservation: {tool_result}\n\n"
                logger.debug(f'Tool execution completed: {action}', user_id, {'step': i + 1, 'tool': action, 'result_length': len(tool_result)})
            else:
                context += f"Step {i + 1}:\nThought: {thought}\n\n"
            steps.append(step)

        # Final answer
        final_prompt = f"""{context}
    Based on your analysis above, provide a comprehensive final answer to the user's query: "{query}"

    Focus on actionable insights and specific recommendations."""
        logger.log_llm_call(MODEL_NAME, final_prompt, user_id, {'type': 'final_answer'})
        final_response = self.opik_client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": final_prompt}],
            max_tokens=3000
        )
        final_answer = final_response.choices[0].message.content or "Unable to generate final answer."
        logger.log_llm_response(MODEL_NAME, len(final_answer), user_id, {'type': 'final_answer'})

        # Flush opik client to ensure all data is sent
        if OPIK_AVAILABLE and hasattr(self.opik_client, 'flush'):
            try:
                await self.opik_client.flush()
            except Exception:
                pass

        logger.info('ReAct agent process completed', user_id, {
            'steps_count': len(steps),
            'final_answer_length': len(final_answer)
        })
        # return the result to user
        return ReActResult(steps=steps, final_answer=final_answer)