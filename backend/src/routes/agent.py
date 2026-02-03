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
from utils.react_agent import generate_insight_with_reason_act
from utils.logger import Logger

agent_blue_print = Blueprint('agent', __name__)
logger = Logger.get_instance()

@agent_blue_print.route('/generate-insight', methods=['POST'])
def generate_insight():
    try:
        data = request.get_json()
        query = data.get('query')
        user_id = data.get('userId')
        logger.info('ReAct agent insight request received', user_id, {'query': query, 'has_user_id': bool(user_id)})
        # validate input
        if not query:
            logger.error('ReAct agent request missing query', user_id)
            return jsonify({'error': 'Query is required'}), 400
        # Run async function in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(generate_insight_with_reason_act(query, user_id))
        loop.close()
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
                'finalAnswer': result.final_answer
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