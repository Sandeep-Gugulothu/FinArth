import asyncio
import os
import sys

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from ai_agent.tools import MarketDataService

async def test():
    try:
        print("Fetching dashboard data...")
        data = await MarketDataService.get_dashboard_data()
        print("Success!")
        print(f"Global keys: {list(data['global'].keys()) if data['global'] else 'None'}")
        print(f"Top coins count: {len(data['top_coins'])}")
        print(f"Trending count: {len(data['trending'])}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
