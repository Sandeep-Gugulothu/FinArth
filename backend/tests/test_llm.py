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
try:
    from opik import llm_unit
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    print("Warning: Opik integration disabled due to compatibility issues")

@llm_unit() if OPIK_AVAILABLE else lambda x:x
async def test_single_llm_response(react_agent_instance):
    user_question = "What is the capital of France?"
    response = await react_agent_instance.get_single_llm_response(user_question)
    assert response is not None
    assert isinstance(response, str)
    assert any(p in response.lower() for p in ['paris'])

@llm_unit() if OPIK_AVAILABLE else lambda x:x
async def test_orchestrator_generic_intent(orchestrator_instance):
    query = "Hello, who are you and what can you do?"
    result = await orchestrator_instance.process(query)
    assert result is not None
    assert result.content != ""
    assert "FinArth" in result.content or "assistant" in result.content.lower()