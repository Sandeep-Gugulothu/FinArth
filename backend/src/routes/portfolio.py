"""
File Name: portfolio.py
Description: This file contains the code for portfolio related operations.
Author Name: The FinArth Team
Creation Date: 02-Feb-2026

Instructions to run: [TODO]

File Execution State: Validation is in progress
"""
from flask import Blueprint, jsonify, request
from database import db
from utils.auth import token_required
from utils.logger import Logger
from ai_agent.tools import WeexService
import datetime

logger = Logger.get_instance()
portfolio_blue_print = Blueprint('portfolio', __name__)

@portfolio_blue_print.route('/holdings', methods=['GET'])
@token_required
def get_user_portfolio(current_user):
    try:
        cursor = db.cursor()
        cursor.execute(
            'SELECT * FROM portfolio_holdings WHERE user_id = ? ORDER BY created_at DESC',
            (current_user['id'],)
        )
        holdings = cursor.fetchall()
        return jsonify({'holdings': [dict(holding) for holding in holdings]}), 200
    except Exception as e:
        logger.error(f'Failed to fetch portfolio: {str(e)}')
        return jsonify({'error': 'Failed to fetch portfolio'}), 500

@portfolio_blue_print.route('/holdings', methods=['POST'])
@token_required
def add_holding(current_user):
    try:
        data = request.get_json()
        category = data.get('category')
        symbol = data.get('symbol')
        date = data.get('date')
        entry_price = data.get('entry_price')

        # Automatically fetch entry price for Crypto tracker if not provided
        if category == 'Crypto' and symbol and date and not entry_price:
            try:
                dt = datetime.datetime.strptime(date, "%Y-%m-%d")
                start_ms = int(dt.timestamp() * 1000)
                history = WeexService.get_history(symbol, start_ms)
                if history and len(history) >= 5:
                    entry_price = float(history[4]) # Closing price on that day
            except Exception as e:
                logger.error(f'Failed to fetch historical entry price for {symbol}: {str(e)}')

        cursor = db.cursor()
        cursor.execute(
            'INSERT INTO portfolio_holdings (user_id, name, category, amount, date, symbol, entry_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (current_user['id'], data['name'], category, data['amount'], date, symbol or '', entry_price)
        )
        db.commit()
        return jsonify({'id': cursor.lastrowid, 'message': 'Holding added successfully'}), 201
    except Exception as e:
        logger.error(f'Failed to add holding: {str(e)}')
        return jsonify({'error': 'Failed to add holding'}), 500

@portfolio_blue_print.route('/holdings/<int:holding_id>', methods=['PUT'])
@token_required
def update_holding(current_user, holding_id):
    try:
        data = request.get_json()
        category = data.get('category')
        symbol = data.get('symbol')
        date = data.get('date')
        entry_price = data.get('entry_price')

        # Check if we need to re-fetch entry price
        if category == 'Crypto' and symbol and date and not entry_price:
            # Check if symbol or date changed compared to existing record
            cursor = db.cursor()
            cursor.execute('SELECT symbol, date, entry_price FROM portfolio_holdings WHERE id = ?', (holding_id,))
            existing = cursor.fetchone()
            if existing and (existing['symbol'] != symbol or existing['date'] != date or not existing['entry_price']):
                try:
                    dt = datetime.datetime.strptime(date, "%Y-%m-%d")
                    start_ms = int(dt.timestamp() * 1000)
                    history = WeexService.get_history(symbol, start_ms)
                    if history and len(history) >= 5:
                        entry_price = float(history[4])
                except Exception as e:
                    logger.error(f'Failed to update historical entry price for {symbol}: {str(e)}')

        cursor = db.cursor()
        cursor.execute(
            'UPDATE portfolio_holdings SET name = ?, category = ?, amount = ?, date = ?, symbol = ?, entry_price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            (data['name'], category, data['amount'], date, symbol or '', entry_price, holding_id, current_user['id'])
        )
        db.commit()
        return jsonify({'message': 'Holding updated successfully'}), 200
    except Exception as e:
        logger.error(f'Failed to update holding: {str(e)}')
        return jsonify({'error': 'Failed to update holding'}), 500

@portfolio_blue_print.route('/holdings/<int:holding_id>', methods=['DELETE'])
@token_required
def delete_holding(current_user, holding_id):
    try:
        cursor = db.cursor()
        cursor.execute(
            'DELETE FROM portfolio_holdings WHERE id = ? AND user_id = ?',
            (holding_id, current_user['id'])
        )
        db.commit()
        return jsonify({'message': 'Holding deleted successfully'}), 200
    except Exception as e:
        logger.error(f'Failed to delete holding: {str(e)}')
        return jsonify({'error': 'Failed to delete holding'}), 500
