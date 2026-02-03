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

portfolio_blue_print = Blueprint('portfolio', __name__)

@portfolio_blue_print.route('/<int:user_id>', methods=['GET'])
def get_user_portfolio(user_id):
    try:
        cursor = db.cursor()
        cursor.execute(
            'SELECT * FROM portfolio_holdings WHERE user_id = ? ORDER BY created_at DESC',
            (user_id,)
        )
        holdings = cursor.fetchall()
        # convert sqlite3.Row objects to dictionaries
        return jsonify({'holdings': [dict(holding) for holding in holdings]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@portfolio_blue_print.route('/<int:user_id>/holdings', methods=['POST'])
def add_holding(user_id):
    data = request.get_json()
    name = data.get('name')
    category = data.get('category')
    amount = data.get('amount')
    date = data.get('date')
    symbol = data.get('symbol', '')
    # Insert new holding into the database
    try:
        cursor = db.cursor()
        cursor.execute(
            'INSERT INTO portfolio_holdings (user_id, name, category, amount, date, symbol) VALUES (?, ?, ?, ?, ?, ?)',
            (user_id, name, category, amount, date, symbol)
        )
        db.commit()
        # Get the ID of the newly inserted holding
        return jsonify({'id': cursor.lastrowid, 'message': 'Holding added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@portfolio_blue_print.route('/<int:user_id>/holdings/<int:holding_id>', methods=['PUT'])
def update_holding(user_id, holding_id):
    data = request.get_json()
    name = data.get('name')
    category = data.get('category')
    amount = data.get('amount')
    date = data.get('date')
    symbol = data.get('symbol', '')
    # update existing holding in the database
    try:
        cursor = db.cursor()
        cursor.execute(
            'UPDATE portfolio_holdings SET name = ?, category = ?, amount = ?, date = ?, symbol = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            (name, category, amount, date, symbol, holding_id, user_id)
        )
        db.commit()
        return jsonify({'message': 'Holding updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@portfolio_blue_print.route('/<int:user_id>/holdings/<int:holding_id>', methods=['DELETE'])
def delete_holding(user_id, holding_id):
    try:
        cursor = db.cursor()
        cursor.execute(
            'DELETE FROM portfolio_holdings WHERE id = ? AND user_id = ?',
            (holding_id, user_id)
        )
        db.commit()
        return jsonify({'message': 'Holding deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500