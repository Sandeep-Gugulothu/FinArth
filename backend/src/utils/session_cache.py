"""
File Name: session_cache.py
Description: This file contains the code for managing user session cache.
Author Name: The FinArth Team
Creation Date: 27-Jan-2026
Version: 1.0

Instructions to run: Import the session_cache module and use its methods to
                     manage user sessions.

File Execution State: Validation is in progress
Note: This module can be imported and used in other parts of the application
      to manage user sessions efficiently.
"""

from datetime import datetime
from typing import Optional, Dict, List, Any

class UserSession:
    def __init__(self, user_id: int, name: str = '', country: str = '', age: int = 0,
                 risk_preference: str = '', familiar_investments: List[str] = None,
                 return_estimate: str = '', selected_options: List[str] = None,
                 is_first_login: bool = True):
        self.user_id = user_id
        self.name = name
        self.country = country
        self.age = age
        self.risk_preference = risk_preference
        self.familiar_investments = familiar_investments or []
        self.return_estimate = return_estimate
        self.selected_options = selected_options or []
        self.is_first_login = is_first_login
        self.last_updated = datetime.now()

class SessionCache:
    def __init__(self):
        self.cache: Dict[int, UserSession] = {}
    
    def set(self, user_id: int, user_data: Dict[str, Any]):
        """Set user session data"""
        existing = self.cache.get(user_id)
        # Create or update the session
        session = UserSession(
            user_id=user_id,
            name=user_data.get('name', existing.name if existing else ''),
            country=user_data.get('country', existing.country if existing else ''),
            age=user_data.get('age', existing.age if existing else 0),
            risk_preference=user_data.get('riskPreference', existing.risk_preference if existing else ''),
            familiar_investments=user_data.get('familiarInvestments', existing.familiar_investments if existing else []),
            return_estimate=user_data.get('returnEstimate', existing.return_estimate if existing else ''),
            selected_options=user_data.get('selectedOptions', existing.selected_options if existing else []),
            is_first_login=user_data.get('isFirstLogin', existing.is_first_login if existing else True)
        )
        self.cache[user_id] = session
    
    def get(self, user_id: int) -> Optional[UserSession]:
        """Get user session data"""
        return self.cache.get(user_id)

    def delete(self, user_id: int):
        """Delete user session"""
        if user_id in self.cache:
            del self.cache[user_id]

    def clear(self):
        """Clear all sessions"""
        self.cache.clear()

# Global session cache instance
session_cache = SessionCache()