'''
File Name: openrouter_api.py
Description: This file contains the code for calling the openrouter api
Author Name: Open Router Team
Date: 21-Jan-2026
Version: 1.0

Instructions to run:
Follow the command sequence below in the terminal:
1. Setup the virtual environment:
python3 -m venv <path/to/venv>
2. Activate the virtual environment:
source <path/to/venv>/bin/activate
3. Install required packages:
pip<3/x> install requests
4. Run the script:
python openrouter_api.py
'''
# Import the required libraries
import requests
import json

# First API call with reasoning
response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
  },
  data=json.dumps({
    "model": "xiaomi/mimo-v2-flash:free",
    "messages": [
        {
          "role": "user",
          "content": "Can you suggest me with best investment options?"
        }
      ],
    "reasoning": {"enabled": True}
  })
)

# Extract the assistant message with reasoning_details
response = response.json()
# print(response)
response = response['choices'][0]['message']
print('\n')
print('\n')
print(response)

# Preserve the assistant message with reasoning_details
messages = [
  {"role": "user", "content": "Can you suggest me with best investment options?"},
  {
    "role": "assistant",
    "content": response.get('content'),
    "reasoning_details": response.get('reasoning_details')  # Pass back unmodified
  },
  {"role": "user", "content": "Are you sure? Think carefully."}
]

# Second API call - model continues reasoning from where it left off
response2 = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
  },
  data=json.dumps({
    "model": "xiaomi/mimo-v2-flash:free",
    "messages": messages,  # Includes preserved reasoning_details
    "reasoning": {"enabled": True}
  })
)

# Extract the assistant message with reasoning_details
response2 = response2.json()
# print('\n')
# print('\n')
# print(response2)
response2 = response2['choices'][0]['message']
print('\n')
print('\n')
print(response2)