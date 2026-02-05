from database import db
import uuid
from datetime import datetime
from utils.logger import Logger

logger = Logger.get_instance()

class ChatManager:
    @staticmethod
    def get_sessions(user_id):
        cursor = db.cursor()
        cursor.execute("""
            SELECT id, title, created_at, updated_at 
            FROM chat_sessions 
            WHERE user_id = ? 
            ORDER BY updated_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    @staticmethod
    def get_messages(session_id):
        cursor = db.cursor()
        cursor.execute("""
            SELECT role, content, timestamp 
            FROM chat_messages 
            WHERE session_id = ? 
            ORDER BY timestamp ASC
        """, (session_id,))
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    @staticmethod
    def create_session(user_id, title="New Chat"):
        session_id = str(uuid.uuid4())
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO chat_sessions (id, user_id, title) 
            VALUES (?, ?, ?)
        """, (session_id, user_id, title))
        db.commit()
        return session_id

    @staticmethod
    def add_message(session_id, role, content):
        cursor = db.cursor()
        cursor.execute("""
            INSERT INTO chat_messages (session_id, role, content) 
            VALUES (?, ?, ?)
        """, (session_id, role, content))
        message_id = cursor.lastrowid
        # Update session timestamp
        cursor.execute("""
            UPDATE chat_sessions 
            SET updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        """, (session_id,))
        db.commit()
        return message_id

    @staticmethod
    def update_message_feedback(message_id, feedback):
        cursor = db.cursor()
        cursor.execute("""
            UPDATE chat_messages 
            SET feedback = ? 
            WHERE id = ?
        """, (feedback, message_id))
        db.commit()

    @staticmethod
    def update_session_title(session_id, title):
        cursor = db.cursor()
        cursor.execute("""
            UPDATE chat_sessions 
            SET title = ? 
            WHERE id = ?
        """, (title, session_id))
        db.commit()

    @staticmethod
    def delete_session(session_id):
        cursor = db.cursor()
        cursor.execute("DELETE FROM chat_messages WHERE session_id = ?", (session_id,))
        cursor.execute("DELETE FROM chat_sessions WHERE id = ?", (session_id,))
        db.commit()
