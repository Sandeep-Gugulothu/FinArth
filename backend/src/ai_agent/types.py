from enum import Enum
from dataclasses import dataclass
from typing import Optional, Dict, Any, List

class AgentIntent(str, Enum):
    PORTFOLIO_ANALYSIS = "PORTFOLIO_ANALYSIS"
    RISK_ASSESSMENT = "RISK_ASSESSMENT"
    INVESTMENT_PLANNING = "INVESTMENT_PLANNING"
    GENERAL_ADVICE = "GENERAL_ADVICE"
    MARKET_ANALYSIS = "MARKET_ANALYSIS"

@dataclass
class RouterResult:
    intent: AgentIntent
    confidence: float
    reasoning: str

@dataclass
class AgentResponse:
    content: str
    intent: AgentIntent
    metadata: Dict[str, Any] = None
