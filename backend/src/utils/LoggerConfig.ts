import { LogLevel } from './Logger';

export const LoggerConfig = {
  // Maximum lines per log file (configurable)
  MAX_LINES_PER_FILE: 1000,
  
  // Default log level (configurable)
  DEFAULT_LOG_LEVEL: LogLevel.DEBUG,
  
  // Enable/disable colors in logs
  ENABLE_COLORS: true,
  
  // Log directory path
  LOG_DIR: 'logs',
  
  // File naming patterns
  USER_LOG_PREFIX: 'user_',
  SYSTEM_LOG_PREFIX: 'system_',
  
  // Log levels hierarchy (for filtering)
  LOG_LEVELS: {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.ERROR]: 2,
    [LogLevel.CRITICAL]: 3
  }
};

export default LoggerConfig;