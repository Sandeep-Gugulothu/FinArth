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
from utils.migration_runner import MigrationRunner

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

# Run migrations
migration_runner = MigrationRunner(db)
try:
    migration_runner.run_migrations()
except Exception as error:
    logger.error('Failed to run migrations', metadata={'error': str(error)})
    raise