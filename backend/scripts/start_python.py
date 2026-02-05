#!/usr/bin/env python3
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


"""
This script runs the Python backend server
"""

import os
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import flask
        import flask_cors
        import requests
        import openai
        import pytest
        print("All Python dependencies are installed")
        return True
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Installing dependencies...")
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        return True

def main():
    """Main function to start the Python server"""
    print("Starting FinArth Python Backend Server...")
    
    # Change to src directory
    src_dir = Path(__file__).parent / "src"
    os.chdir(src_dir)

    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Start the server
    print("Starting Python Flask server on port 8000...")
    subprocess.run([sys.executable, "server.py"])

if __name__ == "__main__":
    main()