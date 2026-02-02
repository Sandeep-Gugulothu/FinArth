# FinArth Centralized Logging System

## Overview
A centralized distributed logging system that collects logs from all components with user-based log segregation, configurable log levels, and color-coded output.

## Features

### **Requirements Implemented**

1. **User-based Logging**: Logs created based on login userID
2. **External File Storage**: Logs stored in dedicated `logs/` folder
3. **Configurable File Size**: 1000 lines per file (configurable)
4. **Log Levels with Colors**:
   - INFO (Green)
   - DEBUG (Blue) 
   - ERROR (Orange)
   - CRITICAL (Red)
5. **Backend Integration**: Logs sit under backend system
6. **Singleton Pattern**: Single logger instance throughout system
7. **Business Logic Coverage**: Database operations and LLM calls

## Usage Examples

### Basic Logging
```typescript
import Logger from '../utils/Logger';

const logger = Logger.getInstance();

// User-specific logs
logger.info('User action completed', userId, { action: 'login' });
logger.error('User operation failed', userId, { error: 'Invalid data' });

// System logs
logger.debug('System process started');
logger.critical('System failure detected');
```

### Database Operation Logging
```typescript
// Automatic DB logging
logger.logDbOperation('INSERT', 'users', userId, { email: 'user@example.com' });
logger.logDbError('UPDATE', 'users', error, userId);
```

### LLM Operation Logging
```typescript
// LLM call logging
logger.logLLMCall('nvidia/nemotron-3-nano-30b-a3b:free', prompt, userId);
logger.logLLMResponse('nvidia/nemotron-3-nano-30b-a3b:free', responseLength, userId);
logger.logLLMError('nvidia/nemotron-3-nano-30b-a3b:free', error, userId);
```

### Configuration
```typescript
import Logger, { LogLevel } from '../utils/Logger';

const logger = Logger.getInstance();

// Configure logger
logger.configure({
  maxLinesPerFile: 2000,        // Change file size limit
  logLevel: LogLevel.DEBUG,     // Set minimum log level
  enableColors: false           // Disable colors
});
```

## File Structure

```
backend/
├── logs/                     # Log files directory
│   ├── user_1_2024-01-19.log       # User-specific logs
│   ├── user_1_2024-01-19_1.log     # Overflow files
│   ├── user_2_2024-01-19.log       # Another user's logs
│   └── system_2024-01-19.log       # System logs
├── src/
│   └── utils/
│       ├── Logger.ts         # Main logger class
│       └── LoggerConfig.ts   # Configuration
```

## Log Format

```
[2024-01-19T10:30:45.123Z] [INFO] [User:123] User login successful | {"email":"user@example.com"}
[2024-01-19T10:30:46.456Z] [DEBUG] [User:123] ReAct step 1 starting | {"step":1,"context":"User Query: What..."}
[2024-01-19T10:30:47.789Z] [ERROR] [System] DB Error: INSERT on users failed | {"table":"users","error":"UNIQUE constraint failed"}
```

## Integration Points

### 1. Database Operations
- User registration/login
- Onboarding data saving
- Preference loading
- Backup operations

### 2. LLM Operations
- ReAct agent calls
- User preference fetching
- Model responses
- Error handling

### 3. API Routes
- Request logging
- Response logging
- Error tracking
- Performance monitoring

## Configuration Options

### LoggerConfig.ts
```typescript
export const LoggerConfig = {
  MAX_LINES_PER_FILE: 1000,           // Configurable file size
  DEFAULT_LOG_LEVEL: LogLevel.INFO,   // Configurable log level
  ENABLE_COLORS: true,                // Color toggle
  LOG_DIR: 'logs',                    // Log directory
};
```

## Benefits

1. **User Segregation**: Each user's logs in separate files
2. **Scalability**: Automatic file rotation when size limit reached
3. **Debugging**: Comprehensive coverage of DB and LLM operations
4. **Performance**: Singleton pattern ensures single instance
5. **Flexibility**: Configurable log levels and file sizes
6. **Visibility**: Color-coded console output for development

## Production Considerations

- Log rotation and archival
- Log level filtering in production
- Performance impact monitoring
- Storage management
- Log aggregation for analytics