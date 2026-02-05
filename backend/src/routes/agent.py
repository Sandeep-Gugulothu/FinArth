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
from flask import Blueprint, request, jsonify
from utils.logger import Logger
from ai_agent.chat_manager import ChatManager
from ai_agent.core import AgentOrchestrator

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
        
        # New Agent Orchestrator Call
        orchestrator = AgentOrchestrator()
        
        # We need to fetch history if we want to pass it
        # history = ChatManager.get_messages(session_id) if session_id else []
        # For now, let's keep it simple and just pass the query
        
        result = loop.run_until_complete(orchestrator.process(
            query,
            user_id
        ))
        loop.close()

        bot_msg_id = None
        if session_id:
            bot_msg_id = ChatManager.add_message(session_id, 'bot', result.content)

        # log the successful generation
        logger.info('AI Agent insight generated successfully', user_id, {
            'intent': result.intent,
            'response_length': len(result.content)
        })
        
        # Format response for frontend compatibility
        # The new agent doesn't expose 'steps' in the same way, so we return a simplified step
        # or we could expose the router reasoning as a step.
        steps = []
        if result.metadata:
             # 1. Router Step
             steps.append({
                 "thought": f"Analyzing user intent for query: '{query}'",
                 "action": "IntentRouter.classify",
                 "observation": f"Classified as {result.intent}. Confidence: {result.metadata.get('intent_confidence', 'N/A')}. Reasoning: {result.metadata.get('intent_reasoning', 'N/A')}"
             })

             # 2. Handler Step (Dynamic based on intent)
             handler_name = result.metadata.get('handler', 'Unknown Handler')
             steps.append({
                 "thought": f"Routing to specialist: {handler_name}",
                 "action": f"{handler_name}.process",
                 "observation": "fetching user data and market context..."
             })
             
             # 3. Model Step
             model_used = result.metadata.get('model', 'Unknown Model')
             steps.append({
                 "thought": f"Generating response using {model_used}",
                 "action": "LLM Generation",
                 "observation": "Insight generated successfully."
             })

        return jsonify({
            'success': True,
            'data': {
                'steps': steps,
                'finalAnswer': result.content,
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