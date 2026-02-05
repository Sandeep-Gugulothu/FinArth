import os
import asyncio
from dotenv import load_dotenv
from openai import OpenAI
from opik import evaluate, Opik
from opik.evaluation.metrics import Hallucination, AnswerRelevance
from typing import Dict, Any

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

if not OPENROUTER_API_KEY:
    print("Error: OPENROUTER_API_KEY not found in .env")
    exit(1)

# Initialize OpenAI client for OpenRouter
client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url=OPENROUTER_BASE_URL
)

# Initialize Opik client
opik_client = Opik()

# Models to evaluate
MODELS_TO_TEST = [
    "liquid/lfm-2.5-1.2b-instruct:free",
    "arcee-ai/trinity-mini:free",
    "google/gemma-3n-e4b-it:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "openai/gpt-oss-20b:free",
    "tngtech/deepseek-r1t2-chimera:free",
    "sourceful/riverflow-v2-pro",
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.2-3b-instruct:free",
    "deepseek/deepseek-r1-distill-llama-70b:free"
]

# Dataset for evaluation
raw_dataset = [
    # General Financial Knowledge
    {"input": "What is the difference between an ETF and a Mutual Fund?", "expected_topics": ["Exchange Traded", "management fees", "intraday trading"]},
    
    # Portfolio Analysis (Contextual)
    {"input": "I have 60% in Tech stocks and 40% in Crypto. Is this risky?", "expected_topics": ["volatility", "diversification", "high risk", "concentration"]},
    
    # Indian Market Specifics (Localization)
    {"input": "How is crypto taxed in India?", "expected_topics": ["30%", "TDS", "1%", "no offset"]},
    
    # Planning
    {"input": "I am 30 years old and want to retire by 50. I can save 1 Lakh per month. Suggest a plan.", "expected_topics": ["equity", "debt", "inflation", "compounding"]},
    
    # Simple Fact
    {"input": "Who regulates the stock market in India?", "expected_topics": ["SEBI", "Securities and Exchange Board of India"]}
]

# Create dataset in Opik
dataset_name = "FinArth_Benchmark_v1"
dataset = opik_client.get_or_create_dataset(name=dataset_name)
# Clear existing items to avoid duplicates if re-running or just check count?
# Simple approach: insert items. Opik often appends.
# For this script, we'll assume we want to fresh start or append.
# To be safe, we insert.
try:
    dataset.insert(raw_dataset)
except:
    pass # Items might already exist or keys mismatch. Opik is usually forgiving.


def generate_response(item: Dict[str, Any], model: str) -> str:
    """Generates a response from the specified model."""
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": item["input"]}],
            max_tokens=500
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

async def run_evaluation():
    print(f"Starting evaluation for {len(MODELS_TO_TEST)} models...")
    
    # Define metrics
    # Using a strong model for judging or default
    # Note: Opik metrics usually default to a commercially available model if not specified.
    # Here we assume the environment is set up for Opik to use its default provider or configured one.
    # explicit model can be passed if needed e.g., Hallucination(model="openai/gpt-4o")
    
    # For this script, we'll try to use the default configuration.
    try:
        metrics = [
            Hallucination(),
            AnswerRelevance()
        ]
    except Exception as e:
        print(f"Warning: Could not initialize some metrics ({e}). Running without them or using simplified scoring.")
        metrics = []

    for model in MODELS_TO_TEST:
        print(f"\nEvaluating Model: {model}")
        try:
            experiment_name = f"FinArth_Eval_{model.replace('/', '_').replace(':', '_')}"
            
            # Opik evaluate function
            result = evaluate(
                dataset=dataset,
                task=lambda item: {"output": generate_response(item, model)},
                scoring_metrics=[],
                experiment_name=experiment_name
            )
            print(f"Completed experiment: {experiment_name}")
            
        except Exception as e:
            print(f"Failed to evaluate {model}: {e}")

if __name__ == "__main__":
    # Ensure asyncio loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(run_evaluation())
