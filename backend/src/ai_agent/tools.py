import os
import requests
import asyncio
from concurrent.futures import ThreadPoolExecutor
from utils.opik_client import OpikConfig, trace

class MarketDataService:
    @staticmethod
    @trace(name="tool_get_market_context")
    async def get_market_context() -> str:
        """
        Fetches real-time market data using Financial Modeling Prep (FMP) API.
        Covers Major Indexes, Top Crypto, and Sector Performance.
        """
        api_key = os.getenv("FMP_API_KEY")
        if not api_key:
            return "Error: FMP_API_KEY not found."

        base_url = "https://financialmodelingprep.com/api/v3"
        
        def fetch_url(url):
            try:
                r = requests.get(f"{base_url}{url}&apikey={api_key}", timeout=5)
                return r.json() if r.status_code == 200 else None
            except:
                return None

        # Parallel fetch for speed
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as pool:
            # 1. Major Indexes (SPY, QQQ, DIA)
            indexes_task = loop.run_in_executor(pool, fetch_url, "/quote/SPY,QQQ,DIA,GLD?limit=4")
            # 2. Crypto (BTC, ETH)
            crypto_task = loop.run_in_executor(pool, fetch_url, "/quote/BTCUSD,ETHUSD?limit=2")
            # 3. Market Sector Performance
            sectors_task = loop.run_in_executor(pool, fetch_url, "/sectors-performance?")

            indexes, crypto, sectors = await asyncio.gather(indexes_task, crypto_task, sectors_task)

        # Formatting Output
        summary = ["Real-Time Market Data (Financial Modeling Prep):"]
        
        if indexes:
            summary.append("\n**Major ETFs & Commodities:**")
            for item in indexes:
                summary.append(f"- {item.get('name', item.get('symbol'))}: ${item.get('price')} ({item.get('changesPercentage')}%)")

        if crypto:
            summary.append("\n**Cryptocurrency:**")
            for item in crypto:
                # FMP often returns crypto tickers like BTCUSD
                name = item.get('name', item.get('symbol'))
                summary.append(f"- {name}: ${item.get('price')} ({item.get('changesPercentage')}%)")

        if sectors:
            summary.append("\n**Sector Performance (Today):**")
            # FMP returns a list of sectors, let's take top 3 and bottom 3
            # Or just list all if small
            for sec in sectors[:5]: # Top 5 sectors
                 summary.append(f"- {sec.get('sector')}: {sec.get('changesPercentage')}")

        if len(summary) == 1:
            return "Error fetching market data. Please check API Key or limits."

        return "\n".join(summary)
