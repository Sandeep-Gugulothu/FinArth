"""
File Name: plans.py
Description: This file contains the code for plans related operations.
Author Name: The FinArth Team
Creation Date: 02-Feb-2026

Instructions to run: [TODO]

File Execution State: Validation is in progress
"""
from flask import Blueprint, jsonify, request
from database import db
from utils.auth import token_required
from utils.logger import Logger

logger = Logger.get_instance()
plans_blue_print = Blueprint('plans', __name__)

@plans_blue_print.route('/goals', methods=['GET'])
@token_required
def get_goals(current_user):
    try:
        cursor = db.cursor()
        cursor.execute('SELECT * FROM financial_goals WHERE user_id = ? ORDER BY created_at DESC', (current_user['id'],))
        goals = [dict(row) for row in cursor.fetchall()]
        
        for goal in goals:
            goal['progress'] = int((goal['current_amount'] / goal['target_amount']) * 100) if goal['target_amount'] > 0 else 0
            goal['timeline'] = f"{goal['timeline_years']} year{'s' if goal['timeline_years'] > 1 else ''}"
        
        return jsonify({'goals': goals}), 200
    except Exception as e:
        logger.error(f'Failed to fetch goals: {str(e)}')
        return jsonify({'error': 'Failed to fetch goals'}), 500

@plans_blue_print.route('/goals', methods=['POST'])
@token_required
def create_goal(current_user):
    try:
        data = request.json
        cursor = db.cursor()
        cursor.execute(
            'INSERT INTO financial_goals (user_id, name, target_amount, current_amount, timeline_years, monthly_required, risk_profile, adjust_inflation, return_rate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (
                current_user['id'], 
                data['name'], 
                data['target_amount'], 
                data.get('current_amount', 0), 
                data['timeline_years'], 
                data['monthly_required'],
                data.get('risk_profile', 'Moderate'),
                1 if data.get('adjust_inflation', True) else 0,
                data.get('return_rate'),
                data.get('status', 'on-track')
            )
        )
        db.commit()
        return jsonify({'message': 'Goal created successfully', 'id': cursor.lastrowid}), 201
    except Exception as e:
        logger.error(f'Failed to create goal: {str(e)}')
        return jsonify({'error': 'Failed to create goal'}), 500

@plans_blue_print.route('/goals/<int:goal_id>', methods=['PUT'])
@token_required
def update_goal(current_user, goal_id):
    try:
        data = request.json
        cursor = db.cursor()
        cursor.execute(
            'UPDATE financial_goals SET name = ?, target_amount = ?, current_amount = ?, timeline_years = ?, monthly_required = ?, risk_profile = ?, adjust_inflation = ?, return_rate = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            (
                data['name'], 
                data['target_amount'], 
                data['current_amount'], 
                data['timeline_years'], 
                data['monthly_required'],
                data.get('risk_profile'),
                1 if data.get('adjust_inflation', True) else 0,
                data.get('return_rate'),
                data['status'], 
                goal_id, 
                current_user['id']
            )
        )
        db.commit()
        return jsonify({'message': 'Goal updated successfully'}), 200
    except Exception as e:
        logger.error(f'Failed to update goal: {str(e)}')
        return jsonify({'error': 'Failed to update goal'}), 500

@plans_blue_print.route('/goals/<int:goal_id>', methods=['DELETE'])
@token_required
def delete_goal(current_user, goal_id):
    try:
        cursor = db.cursor()
        cursor.execute('DELETE FROM financial_goals WHERE id = ? AND user_id = ?', (goal_id, current_user['id']))
        db.commit()
        return jsonify({'message': 'Goal deleted successfully'}), 200
    except Exception as e:
        logger.error(f'Failed to delete goal: {str(e)}')
        return jsonify({'error': 'Failed to delete goal'}), 500

@plans_blue_print.route('/generate', methods=['POST'])
def generate_plan():
    return jsonify({'message': 'Plans endpoint - coming soon'})