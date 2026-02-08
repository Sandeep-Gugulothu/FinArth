"""
File Name: health.py
Description: This file contains the code for health check related operations.
Author Name: The FinArth Team
Creation Date: 02-Feb-2026

Instructions to run: [TODO]

File Execution State: Validation is in progress
"""
from flask import Blueprint, jsonify
import os
from utils.opik_client import OpikConfig

health_blue_print = Blueprint('health', __name__)

@health_blue_print.route('/', methods=['GET'])
def health_check():
    opik_client = OpikConfig.get_client()
    status = {
        'status': 'OK',
        'message': 'Backend is running',
        'opik': {
            'available': opik_client is not None,
            'project': os.getenv("OPIK_PROJECT_NAME", "FINARTH")
        }
    }
    return jsonify(status)