"""
File Name: agent.py
Description: This file contains the code for invoking custom function call
             that triggers the LLM call for the user's query.
Author Name: The FinArth Team
Creation Date: 02-Feb-2026
Changes:
Version 1.0: Initial creation with agent functionality.
Version 1.1: Added userId support for personalized insights.

Instructions to run: This module can be imported from other backend system
                     files to expose agent functionality via backend server.

File Execution State: Validation is in progress
"""

import asyncio
from flask import Blueprint, jsonify, request
from utils.react_agent import ReactAgent
from utils.logger import Logger
from utils.chat_manager import ChatManager

agent_blue_print = Blueprint('agent', __name__)
logger = Logger.get_instance()

@agent_blue_print.route('/sessions', methods=['GET'])
def get_sessions():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'userId is required'}), 400
    sessions = ChatManager.get_sessions(user_id)
    return jsonify({'success': True, 'sessions': sessions})

@agent_blue_print.route('/sessions/<session_id>', methods=['GET'])
def get_session_messages(session_id):
    messages = ChatManager.get_messages(session_id)
    # Ensure ID is included in the dictionary if not already there
    # ChatManager.get_messages returns dict(row) which includes all columns
    return jsonify({'success': True, 'messages': messages})

@agent_blue_print.route('/message-feedback', methods=['POST'])
def message_feedback():
    data = request.get_json()
    message_id = data.get('messageId')
    feedback = data.get('feedback') # 'up' or 'down'

    if not message_id or not feedback:
        return jsonify({'error': 'messageId and feedback are required'}), 400
    
    ChatManager.update_message_feedback(message_id, feedback)
    return jsonify({'success': True})

@agent_blue_print.route('/sessions/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    ChatManager.delete_session(session_id)
    return jsonify({'success': True})

@agent_blue_print.route('/generate-insight', methods=['POST'])
def generate_insight():
    try:
        data = request.get_json()
        query = data.get('query')
        user_id = data.get('userId')
        session_id = data.get('sessionId')

        logger.info(
            'ReAct agent insight request received',
            user_id,
            {
                'query': query,
                'has_user_id': bool(user_id),
                'session_id': session_id
            }
        )
        # validate input
        if not query:
            logger.error('ReAct agent request missing query', user_id)
            return jsonify({'error': 'Query is required'}), 400

        # Handle session
        if not session_id and user_id:
            session_id = ChatManager.create_session(user_id, title=query[:50])
        
        if session_id:
            ChatManager.add_message(session_id, 'user', query)

        # Run async function in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(ReactAgent().get_multi_llm_response(
            query,
            user_id
        ))
        loop.close()

        bot_msg_id = None
        if session_id:
            bot_msg_id = ChatManager.add_message(session_id, 'bot', result.final_answer)

        # log the successful generation
        logger.info('ReAct agent insight generated successfully', user_id, {
            'steps_generated': len(result.steps),
            'final_answer_length': len(result.final_answer)
        })
        # return the result
        return jsonify({
            'success': True,
            'data': {
                'steps': [{'thought': step.thought, 'action': step.action, 'observation': step.observation} for step in result.steps],
                'finalAnswer': result.final_answer,
                'sessionId': session_id,
                'messageId': bot_msg_id
            }
        })
    except Exception as error:
        user_id = request.get_json().get('userId') if request.get_json() else None
        logger.critical('ReAct agent failed to generate insight', user_id, {
            'error': str(error)
        })
        return jsonify({
            'error': 'Failed to generate insight',
            'details': str(error)
        }), 500