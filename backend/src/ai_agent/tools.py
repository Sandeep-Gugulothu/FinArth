import os
import requests
import asyncio
import time
import json
from concurrent.futures import ThreadPoolExecutor
from utils.opik_client import OpikConfig, trace

import threading

class MarketDataService:
    CACHE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "market_cache.json")
    _cache = {"data": None, "expiry": 0}
    CACHE_DURATION = 3600  # 1 hour
    _fetch_lock = threading.Lock()
    _is_fetching = False

    @staticmethod
    def _load_cache():
        """Load cache from file if it exists."""
        if MarketDataService._cache["data"]:
            return MarketDataService._cache
        
        if os.path.exists(MarketDataService.CACHE_FILE):
            try:
                with open(MarketDataService.CACHE_FILE, 'r') as f:
                    cached = json.load(f)
                    MarketDataService._cache = cached
                    return cached
            except:
                pass
        return MarketDataService._cache

    @staticmethod
    def _save_cache(data, expiry):
        """Save cache to file."""
        MarketDataService._cache = {"data": data, "expiry": expiry}
        try:
            with open(MarketDataService.CACHE_FILE, 'w') as f:
                json.dump(MarketDataService._cache, f)
        except:
            pass

    @staticmethod
    async def get_dashboard_data():
        """
        Fetches structured market data with persistent file-based caching and concurrency protection.
        """
        current_time = time.time()
        cache = MarketDataService._load_cache()
        
        # Check if cache is valid
        if cache.get("data") and current_time < cache.get("expiry", 0):
            # Strict validation: Ensure global and top_coins exist
            d = cache["data"]
            if d.get("global") and d.get("top_coins"):
                return d

        # Use threading lock to prevent thundering herd across Flask threads
        acquired = MarketDataService._fetch_lock.acquire(blocking=False)
        if not acquired:
            # Another thread is fetching, return cached data
            cache = MarketDataService._load_cache()
            if cache.get("data"):
                return cache["data"]
            # Wait for the other thread to finish
            with MarketDataService._fetch_lock:
                return MarketDataService._load_cache().get("data", {"global": {}, "top_coins": []})
        
        try:
            # Re-check cache inside lock
            cache = MarketDataService._load_cache()
            if cache.get("data") and current_time < cache.get("expiry", 0):
                d = cache["data"]
                if d.get("global") and d.get("top_coins"):
                    return d
            
            # Perform the fetch
            return await MarketDataService._perform_fetch(cache)
        finally:
            MarketDataService._fetch_lock.release()

    @staticmethod
    async def _perform_fetch(cache):
        """Internal method to perform ONE attempt to refresh market data."""
        current_time = time.time()
        api_key = os.getenv("COINGECKO_API_KEY")
        is_pro = os.getenv("COINGECKO_IS_PRO", "false").lower() == "true"
        base_url = "https://pro-api.coingecko.com/api/v3" if is_pro else "https://api.coingecko.com/api/v3"
        
        headers = {"accept": "application/json"}
        if api_key:
            header_name = "x-cg-pro-api-key" if is_pro else "x-cg-demo-api-key"
            headers[header_name] = api_key

        def fetch_url(endpoint):
            try:
                url = f"{base_url}{endpoint}" if endpoint.startswith("/") else endpoint
                r = requests.get(url, headers=headers, timeout=10)
                if r.status_code == 200:
                    return r.json()
                print(f"CoinGecko Error {r.status_code} on {endpoint}")
                return None
            except Exception as e:
                print(f"Exception fetching {endpoint}: {str(e)}")
                return None

        print("Attempting to refresh market data from CoinGecko...")
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor() as pool:
            global_task = loop.run_in_executor(pool, fetch_url, "/global")
            coins_task = loop.run_in_executor(pool, fetch_url, "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d")
            
            global_data, coins = await asyncio.gather(global_task, coins_task)

        # Deep data extraction
        global_obj = global_data.get("data") if (isinstance(global_data, dict) and "data" in global_data) else None
        
        # Only update cache if we have BOTH global stats and coin list
        # This prevents caching a "broken" half-state
        if global_obj and coins and len(coins) > 0:
            fresh_data = {
                "global": global_obj,
                "top_coins": coins,
                "updated_at": current_time
            }
            MarketDataService._save_cache(fresh_data, current_time + MarketDataService.CACHE_DURATION)
            print("Successfully updated market cache.")
            return fresh_data
        
        # FAILSAFE: If API call failed, return the old cache (if it exists)
        # We do NOT update the expiry, so the next request after some time will try again.
        if cache.get("data"):
            print("API fetch failed/limited. Serving last known good data from cache.")
            return cache["data"]

        # If absolutely no data is available (first run + API fail), return empty but don't mock
        return {"global": {}, "top_coins": []}

    @staticmethod
    async def get_coin_chart(coin_id="bitcoin", days=7):
        """Fetches historical chart data for specific coin."""
        api_key = os.getenv("COINGECKO_API_KEY")
        is_pro = os.getenv("COINGECKO_IS_PRO", "false").lower() == "true"
        base_url = "https://pro-api.coingecko.com/api/v3" if is_pro else "https://api.coingecko.com/api/v3"
        
        headers = {"accept": "application/json"}
        if api_key:
            header_name = "x-cg-pro-api-key" if is_pro else "x-cg-demo-api-key"
            headers[header_name] = api_key

        try:
            url = f"{base_url}/coins/{coin_id}/market_chart?vs_currency=usd&days={days}"
            r = requests.get(url, headers=headers, timeout=10)
            return r.json() if r.status_code == 200 else None
        except:
            return None

class WeexService:
    """Service to handle financial data from WEEX exchange."""
    
    @staticmethod
    def get_ticker(symbol: str):
        """Fetches the latest execution price and 24h metrics from WEEX."""
        # Enforce lowercase and cmt_ prefix as requested
        clean = symbol.lower().split('_')[-1] # handles symbols like cmt_btcusdt or just btcusdt
        weex_symbol = f"cmt_{clean}"
        url = f"https://api-contract.weex.com/capi/v2/market/ticker?symbol={weex_symbol}"
        print(f"Fetching WEEX Ticker: {url}")
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                data = r.json()
                if data and 'last' in data:
                    return data
            print(f"WEEX Ticker unsuccessful for {weex_symbol}: {r.status_code}")
            return None
        except Exception as e:
            print(f"WEEX Ticker Exception: {str(e)}")
            return None

    @staticmethod
    def get_history(symbol: str, start_time_ms: int):
        """Fetches historical daily candles from WEEX."""
        clean = symbol.lower().split('_')[-1]
        weex_symbol = f"cmt_{clean}"
        # Filter for candles AFTER the start time
        url = f"https://api-contract.weex.com/capi/v2/market/historyCandles?symbol={weex_symbol}&granularity=1d&startTime={start_time_ms}&limit=100"
        print(f"Fetching WEEX History: {url}")
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                return r.json()
            return None
        except Exception as e:
            print(f"WEEX History Exception: {str(e)}")
            return None

    @staticmethod
    def calculate_investment_growth(symbol: str, investment_date_str: str, manual_entry_price: float = None):
        """Calculates profit/loss since investment date using WEEX data."""
        try:
            ticker = WeexService.get_ticker(symbol)
            if not ticker:
                return {"error": "Symbol not found on WEEX"}

            current_price = float(ticker.get('last', 0))
            purchase_price = manual_entry_price
            growth_pct = None
            
            # If we don't have a manual entry price, fetch it from history
            if purchase_price is None:
                import datetime
                dt = datetime.datetime.strptime(investment_date_str, "%Y-%m-%d")
                start_ms = int(dt.timestamp() * 1000)
                history = WeexService.get_history(symbol, start_ms)
                
                # If we have history, use the first candle (closest to investment date)
                if history and len(history) > 0:
                    try:
                        purchase_price = float(history[0][1])
                    except (IndexError, ValueError):
                        pass
            
            if purchase_price and purchase_price > 0:
                growth_pct = round(((current_price - purchase_price) / purchase_price) * 100, 2)
            
            return {
                "symbol": symbol,
                "current_price": current_price,
                "purchase_price": purchase_price,
                "growth_percentage": growth_pct,
                "high_24h": ticker.get('high_24h'),
                "low_24h": ticker.get('low_24h'),
                "price_change_24h_pct": round(float(ticker.get('priceChangePercent', 0)) * 100, 2)
            }
        except Exception as e:
            print(f"Growth calculation error: {str(e)}")
            return {"error": str(e)}

    @staticmethod
    @trace(name="tool_get_market_context")
    async def get_market_context() -> str:
        """
        Fetches real-time market data using CoinGecko API.
        Covers Global Market Data, Top Cryptocurrencies, and Trending Assets.
        """
        # (This method remains same but uses get_dashboard_data logic internally if needed, or keeping it as is for now)
        data = await MarketDataService.get_dashboard_data()
        
        summary = ["Real-Time Market Data (CoinGecko):"]
        
        if data["global"]:
            g = data["global"]
            mc_change = g.get('market_cap_change_percentage_24h_usd', 0)
            summary.append(f"\n**Global Overview:** Cap Change: {mc_change:.2f}%, BTC Dom: {g.get('market_cap_percentage', {}).get('btc', 0):.2f}%")

        if data["top_coins"]:
            summary.append("\n**Top Assets:**")
            for coin in data["top_coins"][:5]:
                summary.append(f"- {coin['name']}: ${coin['current_price']:,.2} ({coin['price_change_percentage_24h']:+.2f}%)")

        if data["trending"]:
            summary.append("\n**Trending:**")
            for t in data["trending"][:3]:
                summary.append(f"- {t['item']['name']} ({t['item']['symbol']})")

        return "\n".join(summary)
