import hashlib
import secrets
from functools import wraps
from flask import request, jsonify
from database import db

class Authentication:
    def __init__(self):
        """Authentication utility class"""
        pass

    def hash_password(self, password: str) -> str:
        """Hash password using SHA256"""
        return hashlib.sha256(password.encode()).hexdigest()

    def verify_password(self,password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        hash_value = hashlib.sha256(password.encode()).hexdigest()
        return hash_value == hashed_password

    def generate_token(self) -> str:
        """Generate random token"""
        return secrets.token_hex(32)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        token = token.replace('Bearer ', '')
        cursor = db.cursor()
        cursor.execute('SELECT * FROM users WHERE session_token = ?', (token,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(dict(user), *args, **kwargs)
    return decorated