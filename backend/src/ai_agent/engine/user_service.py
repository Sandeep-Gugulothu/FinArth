import sqlite3
from typing import Dict, Any, Optional
from database import db_path
from ai_agent.session_cache import session_cache

class UserService:
    @staticmethod
    def get_user_profile(user_id: int) -> Dict[str, Any]:
        """
        Fetches user profile data from cache or database.
        """
        if not user_id:
            return {}

        # 1. Try Cache
        cached = session_cache.get(user_id)
        if cached:
            return {
                "id": cached.user_id,
                "name": cached.name,
                "country": cached.country,
                "age": cached.age,
                "risk_preference": cached.risk_preference,
                "familiar_investments": cached.familiar_investments,
                "selected_options": cached.selected_options
            }

        # 2. Try Database
        try:
            conn = sqlite3.connect(str(db_path))
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            # Get basic profile
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            
            if not user:
                conn.close()
                return {}
            
            profile = dict(user)
            
            # Get investments
            cursor.execute("SELECT investment_type FROM user_investments WHERE user_id = ?", (user_id,))
            profile['familiar_investments'] = [row[0] for row in cursor.fetchall()]
            
            # Get objectives
            cursor.execute("SELECT objective FROM user_objectives WHERE user_id = ?", (user_id,))
            profile['selected_options'] = [row[0] for row in cursor.fetchall()]
            
            conn.close()
            
            # Update cache for next time
            session_cache.set(user_id, {
                'name': profile.get('name'),
                'country': profile.get('country'),
                'age': profile.get('age'),
                'riskPreference': profile.get('risk_preference'),
                'familiarInvestments': profile['familiar_investments'],
                'returnEstimate': profile.get('return_estimate'),
                'selectedOptions': profile['selected_options'],
                'isFirstLogin': profile.get('is_first_login', False)
            })
            
            return profile
            
        except Exception as e:
            print(f"User Service Error: {e}")
            return {}
