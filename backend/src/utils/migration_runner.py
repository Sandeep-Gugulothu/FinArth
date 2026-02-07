"""
File: migration_runner.py
Description: Database migration system to handle schema changes
"""

import sqlite3
import os
from pathlib import Path
from utils.logger import Logger

logger = Logger.get_instance()

class MigrationRunner:
    def __init__(self, db_connection):
        self.db = db_connection
        self.migrations_path = Path(__file__).parent.parent /'db'/'migrations'
    
    def get_current_version(self):
        """Get current schema version"""
        cursor = self.db.cursor()
        try:
            cursor.execute('SELECT MAX(version) as version FROM schema_version')
            row = cursor.fetchone()
            return row['version'] if row['version'] else 0
        except sqlite3.OperationalError as e:
            if 'no such table' in str(e):
                return 0
            raise
    
    def apply_migration(self, version, sql):
        """Apply a single migration"""
        cursor = self.db.cursor()
        cursor.executescript(sql)
        cursor.execute('INSERT INTO schema_version (version) VALUES (?)', (version,))
        self.db.commit()
    
    def run_migrations(self):
        """Run all pending migrations"""
        try:
            current_version = self.get_current_version()
            logger.info('Current database version', metadata={'version': current_version})
            
            if not self.migrations_path.exists():
                logger.error('Migrations directory not found')
                logger.debug(self.migrations_path)
                return
            
            files = sorted([f for f in os.listdir(self.migrations_path) if f.endswith('.sql')])
            
            for file in files:
                # Extract version from filename (e.g., 001_initial_schema.sql)
                version_str = file.split('_')[0]
                try:
                    version = int(version_str)
                except ValueError:
                    continue
                
                if version <= current_version:
                    continue
                
                file_path = self.migrations_path / file
                with open(file_path, 'r') as f:
                    sql = f.read()
                
                logger.info('Applying migration', metadata={'version': version, 'file': file})
                self.apply_migration(version, sql)
                logger.info('Migration applied successfully', metadata={'version': version, 'file': file})
            
            new_version = self.get_current_version()
            logger.info('Database migrations complete', metadata={'version': new_version})
        except Exception as error:
            logger.error('Migration failed', metadata={'error': str(error)})
            raise
