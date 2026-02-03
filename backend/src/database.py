"""
File Name: database.py
Description: This file contains the code for initialising database tables.
Author Name: Sandeep Gugulothu
Creation Date: 19-Jan-2026
Modified Date: 03-Jan-2026
Changes:
Version 1.0: Initial database creation.
Version 1.1: Added backup and sync functionality.
Version 1.2: Ported to Python 3.

Instructions to run: This module can be imported from other backend system
                     files to perform database operations.

File Execution State: Validation is in progress
"""

import sqlite3
import os
import shutil
from pathlib import Path
from utils.logger import Logger

logger = Logger.get_instance()

# Database paths
db_path = Path(__file__).parent.parent / "database.sqlite"
backup_path = Path(__file__).parent.parent / "database_backup.sqlite"

def create_backup():
    """Create backup database"""
    if db_path.exists():
        shutil.copy2(db_path, backup_path)
        logger.info('Database backup created successfully')
    else:
        logger.error('Primary database not found for backup')

def sync_to_backup():
    """Sync primary to backup"""
    try:
        if db_path.exists():
            shutil.copy2(db_path, backup_path)
            logger.info('Database synced to backup successfully')
    except Exception as error:
        logger.error('Failed to sync database to backup', metadata={'error': str(error)})

# Initialize database connections
db = sqlite3.connect(str(db_path), check_same_thread=False)
backup_db = sqlite3.connect(str(backup_path), check_same_thread=False)

# Enable row factory for dict-like access
db.row_factory = sqlite3.Row
backup_db.row_factory = sqlite3.Row

def initialize_tables():
    """Initialize database tables"""
    cursor = db.cursor()
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            country TEXT,
            age INTEGER,
            risk_preference TEXT,
            return_estimate TEXT,
            email_verified BOOLEAN DEFAULT FALSE,
            verification_token TEXT,
            is_first_login BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # User investments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_investments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            investment_type TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    # User objectives table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_objectives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            objective TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    # Portfolio holdings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS portfolio_holdings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            amount INTEGER NOT NULL,
            date TEXT NOT NULL,
            symbol TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    db.commit()

def initialize_backup_tables():
    """Initialize backup database tables"""
    cursor = backup_db.cursor()
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT,
            country TEXT,
            age INTEGER,
            risk_preference TEXT,
            return_estimate TEXT,
            email_verified BOOLEAN DEFAULT FALSE,
            verification_token TEXT,
            is_first_login BOOLEAN DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    # User investments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_investments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            investment_type TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    # User objectives table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_objectives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            objective TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    # Portfolio holdings table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS portfolio_holdings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            amount INTEGER NOT NULL,
            date TEXT NOT NULL,
            symbol TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    backup_db.commit()

# Initialize tables on import
initialize_tables()
initialize_backup_tables()