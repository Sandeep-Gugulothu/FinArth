import os
import json
from datetime import datetime
from pathlib import Path
from enum import Enum
from typing import Optional, Dict, Any
import inspect

class LogLevel(Enum):
    INFO = 'INFO'
    DEBUG = 'DEBUG'
    ERROR = 'ERROR'
    CRITICAL = 'CRITICAL'

class Logger:
    _instance = None

    def __init__(self):
        self.config = {
            'max_lines_per_file': 1000,
            'log_level': LogLevel.DEBUG,
            'enable_colors': True
        }
        self.log_dir = Path(__file__).parent.parent / 'logs'
        self.color_codes = {
            LogLevel.INFO: '\033[32m',      # Green
            LogLevel.DEBUG: '\033[34m',     # Blue
            LogLevel.ERROR: '\033[33m',     # Orange/Yellow
            LogLevel.CRITICAL: '\033[31m',  # Red
            'RESET': '\033[0m'
        }
        self._ensure_log_directory()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def configure(self, config: Dict[str, Any]):
        self.config.update(config)

    def _ensure_log_directory(self):
        self.log_dir.mkdir(exist_ok=True)

    def _get_log_filename(self, user_id: Optional[int] = None) -> str:
        date = datetime.now().strftime('%Y-%m-%d')
        user_prefix = f'user_{user_id}' if user_id else 'system'
        return f'{user_prefix}_{date}.log'

    def _get_current_file_line_count(self, file_path: Path) -> int:
        if not file_path.exists():
            return 0
        with open(file_path, 'r') as f:
            return len([line for line in f if line.strip()])

    def _get_next_log_file(self, user_id: Optional[int] = None) -> Path:
        base_filename = self._get_log_filename(user_id)
        base_path = self.log_dir / base_filename
        file_index = 1
        current_file = base_path
        # check if the current file exceeds max lines.
        while current_file.exists():
            line_count = self._get_current_file_line_count(current_file)
            if line_count < self.config['max_lines_per_file']:
                return current_file
            # If the current file exceeds max lines, increment the index and try again.
            name_without_ext = base_filename.replace('.log', '')
            current_file = self.log_dir / f'{name_without_ext}_{file_index}.log'
            file_index += 1
        return current_file

    def _get_caller_info(self) -> Dict[str, Any]:
        """Get the filename and line number of the caller"""
        frame = inspect.currentframe()
        # Go up the stack to find the actual caller (skip logger internal methods)
        caller_frame = frame.f_back.f_back.f_back
        # Skip one more frame if called from helper methods like log_db_operation
        if caller_frame and 'log_' in caller_frame.f_code.co_name:
            caller_frame = caller_frame.f_back
        if caller_frame:
            filename = Path(caller_frame.f_code.co_filename).name
            line_number = caller_frame.f_lineno
            return {'file': filename, 'line': line_number}
        return {'file': 'unknown', 'line': 0}

    def _format_log_entry(self, level: LogLevel, message: str, user_id: Optional[int], metadata: Optional[Dict], caller_info: Dict[str, Any]) -> str:
        timestamp = datetime.now().isoformat()
        color_code = self.color_codes[level] if self.config['enable_colors'] else ''
        reset_code = self.color_codes['RESET'] if self.config['enable_colors'] else ''
        user_info = f'[User:{user_id}]' if user_id else '[System]'
        location = f"[{caller_info['file']}:{caller_info['line']}]"
        metadata_str = f' | {json.dumps(metadata)}' if metadata else ''
        # add additional formatting for better readability
        return f'{color_code}[{timestamp}] [{level.value}] {user_info} {location} {message}{metadata_str}{reset_code}'

    def _write_log(self, level: LogLevel, message: str, user_id: Optional[int], metadata: Optional[Dict]):
        log_file = self._get_next_log_file(user_id)
        caller_info = self._get_caller_info()
        formatted_entry = self._format_log_entry(level, message, user_id, metadata, caller_info)
        # open the log file in append mode and write the log entry
        with open(log_file, 'a') as f:
            f.write(formatted_entry + '\n')
        # Also log to console for development
        print(formatted_entry)

    def info(self, message: str, user_id: Optional[int] = None, metadata: Optional[Dict] = None):
        self._write_log(LogLevel.INFO, message, user_id, metadata)

    def debug(self, message: str, user_id: Optional[int] = None, metadata: Optional[Dict] = None):
        self._write_log(LogLevel.DEBUG, message, user_id, metadata)

    def error(self, message: str, user_id: Optional[int] = None, metadata: Optional[Dict] = None):
        self._write_log(LogLevel.ERROR, message, user_id, metadata)

    def critical(self, message: str, user_id: Optional[int] = None, metadata: Optional[Dict] = None):
        self._write_log(LogLevel.CRITICAL, message, user_id, metadata)

    # Database operation logging helpers
    def log_db_operation(self, operation: str, table: str, user_id: Optional[int] = None, data: Optional[Dict] = None):
        self.info(f'DB Operation: {operation} on {table}', user_id, {'table': table, 'operation': operation, 'data': data})

    def log_db_error(self, operation: str, table: str, error: Exception, user_id: Optional[int] = None):
        self.error(f'DB Error: {operation} on {table} failed', user_id, {'table': table, 'operation': operation, 'error': str(error)})

    # LLM operation logging helpers
    def log_llm_call(self, model: str, prompt: str, user_id: Optional[int] = None, metadata: Optional[Dict] = None):
        meta = {'model': model, 'prompt_length': len(prompt)}
        if metadata:
            meta.update(metadata)
        self.info(f'LLM Call: {model}', user_id, meta)

    def log_llm_response(self, model: str, response_length: int, user_id: Optional[int] = None, metadata: Optional[Dict] = None):
        meta = {'model': model, 'response_length': response_length}
        if metadata:
            meta.update(metadata)
        self.info(f'LLM Response: {model}', user_id, meta)

    def log_llm_error(self, model: str, error: Exception, user_id: Optional[int] = None):
        self.error(f'LLM Error: {model} failed', user_id, {'model': model, 'error': str(error)})