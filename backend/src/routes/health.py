"""
File Name: health.py
Description: This file contains the code for health check related operations.
Author Name: The FinArth Team
Creation Date: 02-Feb-2026

Instructions to run: [TODO]

File Execution State: Validation is in progress
"""
from flask import Blueprint, jsonify

health_blue_print = Blueprint('health', __name__)

@health_blue_print.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'Backend is running'})