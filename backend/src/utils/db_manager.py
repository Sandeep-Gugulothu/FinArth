import sqlite3
import shutil
from pathlib import Path
from typing import Optional
from utils.logger import Logger

logger = Logger.get_instance()

class DatabaseManager:
    def __init__(self, base_path: Path):
        self.write_db = base_path.parent / f"{base_path.stem}_write.db"
        self.backup_db = base_path.parent / f"{base_path.stem}_backup.db"
        self.read_db = base_path.parent / f"{base_path.stem}_read.db"
        
        self.write_db.parent.mkdir(parents=True, exist_ok=True)
        
        if not self.write_db.exists():
            self._init_databases()
    
    def _init_databases(self):
        sqlite3.connect(str(self.write_db)).close()
        shutil.copy2(self.write_db, self.backup_db)
        shutil.copy2(self.write_db, self.read_db)
        logger.info('Initialized write, backup, and read databases')
    
    def get_write_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.write_db), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    
    def get_read_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.read_db), check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    
    def _replicate(self):
        shutil.copy2(self.write_db, self.backup_db)
        shutil.copy2(self.backup_db, self.read_db)
    
    def execute_write(self, query: str, params: tuple = ()):
        conn = self.get_write_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            lastrowid = cursor.lastrowid
        finally:
            conn.close()
        
        self._replicate()
        return lastrowid
    
    def execute_read(self, query: str, params: tuple = ()):
        conn = self.get_read_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            return cursor.fetchall()
        finally:
            conn.close()

_db_manager: Optional[DatabaseManager] = None

def get_db_manager() -> DatabaseManager:
    global _db_manager
    if not _db_manager:
        db_path = Path(__file__).parent.parent.parent / "database.sqlite"
        _db_manager = DatabaseManager(db_path)
    return _db_manager
