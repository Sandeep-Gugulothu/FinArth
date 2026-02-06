from ai_agent.tools import MarketDataService, WeexService
from flask import Blueprint, jsonify, request
import asyncio

market_blue_print = Blueprint('market', __name__)

@market_blue_print.route('/dashboard', methods=['GET'])
def get_market_dashboard():
    """
    Endpoint for Dashboard UI to get real-time market data from CoinGecko.
    """
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        data = loop.run_until_complete(MarketDataService.get_dashboard_data())
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@market_blue_print.route('/chart/<coin_id>', methods=['GET'])
def get_coin_chart(coin_id):
    """
    Endpoint for Dashboard UI to get historical chart data.
    """
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        data = loop.run_until_complete(MarketDataService.get_coin_chart(coin_id))
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@market_blue_print.route('/weex/ticker/<symbol>', methods=['GET'])
def get_weex_ticker(symbol):
    try:
        data = WeexService.get_ticker(symbol)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@market_blue_print.route('/weex/analysis', methods=['POST'])
def get_weex_analysis():
    data = request.json
    symbol = data.get('symbol')
    date = data.get('date')
    
    if not symbol or not date:
        return jsonify({"error": "Symbol and date are required"}), 400
        
    try:
        entry_price = data.get('entryPrice')
        analysis = WeexService.calculate_investment_growth(symbol, date, manual_entry_price=entry_price)
        return jsonify(analysis), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
