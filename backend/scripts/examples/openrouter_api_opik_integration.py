'''
File Name: openrouter_api_opik_integration.py
Description: This file contains the code for calling the openrouter api
Author Name: Open Router Team
Modified Date: 21-Jan-2026
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
python<version> openrouter_api_opik_integration.py
example: python3 openrouter_api_opik_integration.py

File Execution State: Execution successful but with model response is incomplete

Note: Make sure you update the API key with yours. If you don't have one, then
please feel to create one from the website below.
https://openrouter.ai/settings/keys
'''

from opik.integrations.openai import track_openai
from openai import OpenAI

# Initialize the OpenAI client with OpenRouter base URL
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="<API_KEY>"
)
client = track_openai(client)

# Optional headers for OpenRouter leaderboard
headers = {
    "HTTP-Referer": "https://openrouter.ai/",  # Optional. Site URL for rankings
    "X-Title": "Open_Router"  # Optional. Site title for rankings
}

response = client.chat.completions.create(
    model="xiaomi/mimo-v2-flash:free",  # Specify the Xiaomi MIMO model
    extra_headers=headers,
    messages=[
        {"role": "user", "content": "You are a financial advisor and can you please suggest me with available investment options in the UK region?"}
    ],
    temperature=0.7,
    max_tokens=100
)

print(response.choices[0].message.content)
print('\n')
print('\n')
print('\n')
print(response)