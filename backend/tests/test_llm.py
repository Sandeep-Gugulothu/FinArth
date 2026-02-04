"""
File Name: test_llm.py
Description: This file contains the code for testing the LLM integration
             functionality.
Author Name: The Comet Team, The FinArth Team
Creation Date: 04-Feb-2026
Version: 1.0 - Initial creation with the LLM integration tests.

Instructions to run: Use pytest to run the tests in this file.

File Execution State: Validated with so far changes.
"""
from opik import llm_unit

@llm_unit()
async def test_single_llm_response(react_agent_instance):
    user_question = "What is the capital of France?"
    response = await react_agent_instance.get_single_llm_response(user_question)
    assert response is not None
    assert isinstance(response, str)
    assert True == (
        ('Paris' in response) or
        ('paris' in response) or
        ('PARIS' in response)
        )