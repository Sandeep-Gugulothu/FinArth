# FinArth System Improvement Plan

## Overview
This document outlines the roadmap for transitioning FinArth from a purely LLM-wrapper-based system to a robust, algorithm-driven financial assistant. The goal is to improve response accuracy, reduce latency, and ensure deterministic reliability for critical financial data, while keeping the Codebase clean and organized.

## Phase 1: Codebase Hygiene & Structure (Immediate Priority)
**Goal**: Organize the backend directory to separate source code from operational scripts and configuration.
- [ ] **Restructure Root Directory**:
    - Create `backend/scripts/` for utility scripts (`start_python.py`, `db-viewer.js`, `test-logging.ts`).
    - Audit `sample_examples/` and archive/remove if unnecessary.
    - Ensure `backend/src/` contains only application logic.

## Phase 2: Algorithmic Core Implementation (Reducing LLM Dependency)
**Goal**: Implement deterministic algorithms for financial calculations. The LLM should analyze *computed metrics*, not raw data.

### 2.1 Portfolio Analysis Engine
Instead of dumping raw holdings to the LLM:
- **Implement `PortfolioAnalyzer` class**:
    - **Performance Metrics**: Calculate Total Return within Python.
    - **Risk Metrics**: Implement Volatility (Std Dev) and Diversification Score calculations.
    - **Allocation Drift**: Calculate current vs. target allocation percentages programmatically.
- **Benefit**: The LLM receives "Portfolio is 15% overweight in Tech with high volatility," leading to grounded advice.

### 2.2 Market Data & Technical Analysis
- **Enhance `MarketDataService`**:
    - Integrate a lightweight technical analysis library (e.g., `ta` or custom `numpy` calculations).
    - Calculate RSI, moving averages (SMA/EMA), and MACD programmatically.
- **Signal Generation**:
    - Create a deterministic "Signal Generator" that outputs tags like `BULLISH_TREND`, `OVERSOLD`, `HIGH_VOLATILITY`.
- **Benefit**: The Market Analyst Agent stops "guessing" trends from a single price point and interprets concrete technical signals.

## Phase 3: Response Quality & Safety
**Goal**: Ensure responses are consistent and structured.
- **Response Templates**: Use structured templates for common queries (e.g., "Price Check" should always look the same).
- **Guardrails**:
    - Post-processing validation to ensure the LLM didn't hallucinate non-existent tickers.
    - Financial disclaimer injection at the router level.

## Phase 4: Intent classification improvements
- **Hybrid Routing**:
    - Use keyword/regex matching for high-confidence simple queries (e.g. "Price of BTC") to bypass the LLM router for speed.
    - Use LLM routing only for ambiguous or complex queries.

## Next Steps
1. Execute Phase 1 (Cleanup).
2. Begin Phase 2 with the `PortfolioAnalyzer`.
