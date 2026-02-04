"""
File Name: conftest.py
Description: This file helps to set up fixures for testing.
Author Name: The FinArth Team
Creation Date: 03-Feb-2026
Version: 1.0 - Initial creation with fixtures for testing.

Instructions to run: Use pytest to run the tests in this file.

File Execution State: Validated with so far changes.
"""
import pytest

@pytest.fixture(scope="module", autouse=True)
def setup_environment():
    # Setup code before any tests run
    print("\nSetting up test environment...")
    yield
    # Teardown code after all tests run
    print("\nTearing down test environment...")

@pytest.fixture
def sample_prompt():
    return "It's a bright sunny day in the city!"

@pytest.fixture
def user_authentication():
    from backend.src.utils.auth import Authentication
    return Authentication()

@pytest.fixture
def react_agent_instance():
    from backend.src.utils.react_agent import ReactAgent
    return ReactAgent()