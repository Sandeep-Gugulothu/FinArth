
import asyncio
import os
from dotenv import load_dotenv
from opik import Opik
from opik.evaluation import evaluate
from opik.evaluation.metrics import base_metric, score_result
from ai_agent.router import IntentRouter
from ai_agent.types import AgentIntent

# Load key from .env
load_dotenv()

# Metric
class IntentAccuracy(base_metric.BaseMetric):
    def __init__(self, name: str = "intent_accuracy"):
        self.name = name

    def score(self, output, expected_output, **kwargs):
        actual = output.intent.value
        expected = expected_output
        
        return score_result.ScoreResult(
            name=self.name,
            value=1.0 if actual == expected else 0.0,
            reason=f"Expected {expected}, got {actual}"
        )

# Evaluation Task
async def evaluation_task(item):
    router = IntentRouter()
    # We await the router classification
    result = await router.classify(item["input"])
    
    return {
        "input": item["input"],
        "output": result,
        "expected_output": item["expected"]
    }

# Sync wrapper for Opik (which expects sync usually, or handles async? Opik SDK is often sync)
# We'll use a wrapper since our router is async
def sync_evaluation_task(item):
    return asyncio.run(evaluation_task(item))

# Dataset
DATASET_ITEMS = [
    {"input": "How much money do I have in stocks?", "expected": "PORTFOLIO_ANALYSIS"},
    {"input": "What is my current asset allocation?", "expected": "PORTFOLIO_ANALYSIS"},
    {"input": "Is my portfolio too risky?", "expected": "RISK_ASSESSMENT"},
    {"input": "What happens if the market crashes?", "expected": "RISK_ASSESSMENT"},
    {"input": "I want to start a new retirement plan", "expected": "INVESTMENT_PLANNING"},
    {"input": "Create a savings goal for a car", "expected": "INVESTMENT_PLANNING"},
    {"input": "What is the S&P 500?", "expected": "GENERAL_ADVICE"},
    {"input": "Tell me a joke about money", "expected": "GENERAL_ADVICE"},
]

if __name__ == "__main__":
    if not os.getenv("OPIK_API_KEY"):
        print("Please set OPIK_API_KEY to run evaluation.")
        exit(1)

    client = Opik()
    client.auth_check()
    dataset = client.get_or_create_dataset(name="FinArth_Router_Benchmark")
    dataset.insert(DATASET_ITEMS)
    
    evaluate(
        experiment_name="Router_Model_Baseline",
        dataset=dataset,
        task=sync_evaluation_task,
        scoring_metrics=[IntentAccuracy()]
    )
