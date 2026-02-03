import hashlib
import secrets

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