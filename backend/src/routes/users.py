"""
File Name: users.py
Description: This file contains the code for user-related operations,
             including registration, login, and preference management.
Author Name: Sandeep Gugulothu
Creation Date: 22-Jan-2026
Modified Date: 03-Feb-2026
Changes:
Version 1.0: Initial creation with user details registration and data
             retrieval.
Version 1.1: Added onboarding data handling, session caching, and sync to backup

Instructions to run: This module can be imported from other backend system
                     files to perform user-related operations.

File Execution State: Validation is in progress
"""

from flask import Blueprint, jsonify, request
import sqlite3
from database import db, sync_to_backup
from utils.auth import Authentication
from ai_agent.session_cache import session_cache
from utils.logger import Logger

users_blue_print = Blueprint('users', __name__)
logger = Logger.get_instance()

@users_blue_print.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    logger.info('User registration attempt', metadata={'email': email})
    # validate input
    if not email or not password:
        logger.error('Registration failed: Missing email or password')
        return jsonify({'error': 'Email and password are required'}), 400
    hashed_password = Authentication().hash_password(password)
    verification_token = Authentication().generate_token()
    logger.log_db_operation('INSERT', 'users', data={'email': email})
    # Insert new user into the database
    try:
        cursor = db.cursor()
        cursor.execute(
            'INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)',
            (email, hashed_password, verification_token)
        )
        db.commit()
        user_id = cursor.lastrowid
        
        logger.info('User registered successfully', user_id, {'email': email, 'user_id': user_id})
        return jsonify({
            'success': True,
            'userId': user_id,
            'message': 'User registered successfully'
        })
    except sqlite3.IntegrityError as e:
        logger.log_db_error('INSERT', 'users', e)
        if 'UNIQUE constraint failed' in str(e):
            return jsonify({'error': 'User already exists'}), 409
        return jsonify({'error': str(e)}), 500

@users_blue_print.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    logger.info('User login attempt', metadata={'email': email})
    
    if not email or not password:
        logger.error('Login failed: Missing credentials')
        return jsonify({'error': 'Email and password are required'}), 400
    
    logger.log_db_operation('SELECT', 'users', data={'email': email})
    
    try:
        cursor = db.cursor()
        cursor.execute(
            'SELECT id, email, password, name, email_verified, is_first_login FROM users WHERE email = ?',
            (email,)
        )
        user = cursor.fetchone()
        
        if not user:
            logger.error('Login failed: User not found', metadata={'email': email})
            return jsonify({
                'error': 'User not found',
                'needsSignup': True
            }), 404
        
        if not Authentication().verify_password(password, user['password']):
            logger.error('Login failed: Invalid password', user['id'], {'email': email})
            return jsonify({'error': 'Invalid password'}), 401
        
        # Load user preferences from database or cache
        if user['is_first_login']:
            # First login - check session cache
            cached_session = session_cache.get(user['id'])
            if cached_session:
                logger.info('Using cached session for first login', user['id'])
        else:
            # Load from database
            logger.log_db_operation('SELECT', 'users_with_preferences', user['id'])
            cursor.execute("""
                SELECT u.*, 
                       GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
                       GROUP_CONCAT(DISTINCT uo.objective) as objectives
                FROM users u
                LEFT JOIN user_investments ui ON u.id = ui.user_id
                LEFT JOIN user_objectives uo ON u.id = uo.user_id
                WHERE u.id = ?
                GROUP BY u.id
            """, (user['id'],))
            full_user = cursor.fetchone()
            
            if full_user:
                session_cache.set(user['id'], {
                    'name': full_user['name'],
                    'country': full_user['country'],
                    'age': full_user['age'],
                    'riskPreference': full_user['risk_preference'],
                    'familiarInvestments': full_user['investments'].split(',') if full_user['investments'] else [],
                    'returnEstimate': full_user['return_estimate'],
                    'selectedOptions': full_user['objectives'].split(',') if full_user['objectives'] else [],
                    'isFirstLogin': False
                })
                logger.info('User preferences loaded to cache', user['id'])
        
        # Generate session token
        session_token = Authentication().generate_token()
        cursor.execute('UPDATE users SET session_token = ? WHERE id = ?', (session_token, user['id']))
        db.commit()
        
        logger.info('User login successful', user['id'], {'email': email})
        return jsonify({
            'success': True,
            'token': session_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'emailVerified': user['email_verified']
            },
            'needsOnboarding': not user['name'],
            'isFirstLogin': user['is_first_login']
        })
    except Exception as e:
        logger.log_db_error('SELECT', 'users', e)
        return jsonify({'error': str(e)}), 500

@users_blue_print.route('/onboarding', methods=['POST'])
def onboarding():
    data = request.get_json()
    user_id = data.get('userId')
    name = data.get('name')
    country = data.get('country')
    age = data.get('age')
    risk_preference = data.get('riskPreference')
    familiar_investments = data.get('familiarInvestments', [])
    return_estimate = data.get('returnEstimate')
    selected_options = data.get('selectedOptions', [])
    
    print('Onboarding data received:', {
        'userId': user_id,
        'name': name,
        'country': country,
        'age': age,
        'riskPreference': risk_preference,
        'familiarInvestments': len(familiar_investments) if familiar_investments else 0,
        'returnEstimate': return_estimate,
        'selectedOptions': len(selected_options) if selected_options else 0
    })
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    # Save to session cache first
    session_cache.set(user_id, {
        'name': name,
        'country': country,
        'age': age,
        'riskPreference': risk_preference,
        'familiarInvestments': familiar_investments,
        'returnEstimate': return_estimate,
        'selectedOptions': selected_options,
        'isFirstLogin': False
    })
    
    try:
        cursor = db.cursor()
        
        # Update user profile in database
        cursor.execute(
            'UPDATE users SET name = ?, country = ?, age = ?, risk_preference = ?, return_estimate = ?, is_first_login = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            (name, country, age, risk_preference, return_estimate, user_id)
        )
        
        print('User profile updated, affected rows:', cursor.rowcount)
        
        # Clear existing investments and objectives
        cursor.execute('DELETE FROM user_investments WHERE user_id = ?', (user_id,))
        cursor.execute('DELETE FROM user_objectives WHERE user_id = ?', (user_id,))
        
        # Insert investments
        if familiar_investments:
            for investment in familiar_investments:
                cursor.execute('INSERT INTO user_investments (user_id, investment_type) VALUES (?, ?)', (user_id, investment))
            print('Investments saved:', len(familiar_investments))
        
        # Insert objectives
        if selected_options:
            for objective in selected_options:
                cursor.execute('INSERT INTO user_objectives (user_id, objective) VALUES (?, ?)', (user_id, objective))
            print('Objectives saved:', len(selected_options))
        
        db.commit()
        
        # Sync to backup
        sync_to_backup()
        
        return jsonify({
            'success': True,
            'message': 'Onboarding completed successfully'
        })
    except Exception as e:
        print('Error updating user profile:', e)
        return jsonify({'error': str(e)}), 500

@users_blue_print.route('/verify/<token>', methods=['GET'])
def verify_email(token):
    try:
        cursor = db.cursor()
        cursor.execute(
            'UPDATE users SET email_verified = 1, verification_token = NULL WHERE verification_token = ?',
            (token,)
        )
        db.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Invalid verification token'}), 400
        
        return jsonify({'success': True, 'message': 'Email verified successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_blue_print.route('/<int:user_id>/preferences', methods=['GET'])
def get_user_preferences(user_id):
    # Handle demo user (ID 999)
    if user_id == 999:
        demo_preferences = {
            'userId': 999,
            'name': 'Demo User',
            'country': 'India',
            'age': 30,
            'riskPreference': 'moderate',
            'familiarInvestments': ['Mutual Funds', 'Stocks'],
            'returnEstimate': 'ai',
            'selectedOptions': ['strategy', 'returns'],
            'isFirstLogin': False
        }
        
        # Cache demo preferences
        session_cache.set(999, demo_preferences)
        
        return jsonify({
            'success': True,
            'source': 'demo',
            'preferences': demo_preferences
        })
    
    # First check session cache
    cached_session = session_cache.get(user_id)
    if cached_session:
        print(f'Returning preferences from cache for user: {user_id}')
        return jsonify({
            'success': True,
            'source': 'cache',
            'preferences': {
                'userId': cached_session.user_id,
                'name': cached_session.name,
                'country': cached_session.country,
                'age': cached_session.age,
                'riskPreference': cached_session.risk_preference,
                'familiarInvestments': cached_session.familiar_investments,
                'returnEstimate': cached_session.return_estimate,
                'selectedOptions': cached_session.selected_options,
                'isFirstLogin': cached_session.is_first_login
            }
        })
    
    # Fallback to database
    try:
        cursor = db.cursor()
        cursor.execute("""
            SELECT u.*, 
                   GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
                   GROUP_CONCAT(DISTINCT uo.objective) as objectives
            FROM users u
            LEFT JOIN user_investments ui ON u.id = ui.user_id
            LEFT JOIN user_objectives uo ON u.id = uo.user_id
            WHERE u.id = ?
            GROUP BY u.id
        """, (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        preferences = {
            'userId': user['id'],
            'name': user['name'],
            'country': user['country'],
            'age': user['age'],
            'riskPreference': user['risk_preference'],
            'familiarInvestments': user['investments'].split(',') if user['investments'] else [],
            'returnEstimate': user['return_estimate'],
            'selectedOptions': user['objectives'].split(',') if user['objectives'] else [],
            'isFirstLogin': user['is_first_login']
        }
        
        # Cache for future use
        session_cache.set(user_id, preferences)
        
        print(f'Returning preferences from database for user: {user_id}')
        return jsonify({
            'success': True,
            'source': 'database',
            'preferences': preferences
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_blue_print.route('/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    # Handle demo user (ID 999)
    if user_id == 999:
        demo_user = {
            'id': 999,
            'email': 'guest@finarth.demo',
            'name': 'Demo User',
            'country': 'India',
            'age': 30,
            'risk_preference': 'moderate',
            'return_estimate': 'ai',
            'email_verified': True,
            'is_first_login': False,
            'investments': 'Mutual Funds,Stocks',
            'objectives': 'strategy,returns'
        }
        return jsonify(demo_user)
    
    try:
        cursor = db.cursor()
        cursor.execute("""
            SELECT u.*, 
                   GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
                   GROUP_CONCAT(DISTINCT uo.objective) as objectives
            FROM users u
            LEFT JOIN user_investments ui ON u.id = ui.user_id
            LEFT JOIN user_objectives uo ON u.id = uo.user_id
            WHERE u.id = ?
            GROUP BY u.id
        """, (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(dict(user))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_blue_print.route('/', methods=['GET'])
def get_all_users():
    try:
        cursor = db.cursor()
        cursor.execute("""
            SELECT u.*, 
                   GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
                   GROUP_CONCAT(DISTINCT uo.objective) as objectives
            FROM users u
            LEFT JOIN user_investments ui ON u.id = ui.user_id
            LEFT JOIN user_objectives uo ON u.id = uo.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        """)
        users = cursor.fetchall()
        
        return jsonify([dict(user) for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500