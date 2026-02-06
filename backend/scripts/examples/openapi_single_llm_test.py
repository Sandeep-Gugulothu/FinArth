import os
import asyncio
from typing import Any
from openai import OpenAI
try:
    from opik.integrations.openai import track_openai
    OPIK_AVAILABLE = True
except ImportError:
    OPIK_AVAILABLE = False
    print("Warning: Opik integration disabled due to compatibility issues")

MODEL_NAME = os.getenv('MODEL_NAME')

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv('OPENROUTER_API_KEY'),
    base_url="https://openrouter.ai/api/v1"
)

opik_client: Any
# Track OpenAI calls through opik if available
if OPIK_AVAILABLE:
    try:
        opik_client = track_openai(client)
    except Exception as e:
        print(f"Opik tracking failed: {e}")
        opik_client = client
else:
    opik_client = client

query = 'What is the capital of France?'

print(MODEL_NAME, query)
try:
    prompt_response = opik_client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": query}],
        max_tokens=100
    )
except Exception as e:
    print('thought-step', e)
    prompt_response = None

response = prompt_response.choices[0].message.content or "Unable to generate final answer."
print(prompt_response)
print(MODEL_NAME, len(response), response)

# Flush opik client to ensure all data is sent
if OPIK_AVAILABLE and hasattr(opik_client, 'flush'):
    try:
        opik_client.flush()
    except Exception:
        pass

print('ReAct agent process completed', {
    'final_answer_length': len(response)
})
print(response)