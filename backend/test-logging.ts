import Logger, { LogLevel } from '../src/utils/Logger';

// Test the logging system
const testLoggingSystem = () => {
  console.log('🧪 Testing FinArth Logging System...\n');
  
  const logger = Logger.getInstance();
  
  // Test configuration
  logger.configure({
    maxLinesPerFile: 10, // Small for testing
    logLevel: LogLevel.DEBUG,
    enableColors: true
  });
  
  // Test different log levels
  console.log('Testing log levels:');
  logger.info('System startup completed');
  logger.debug('Debug information for development');
  logger.error('Non-critical error occurred');
  logger.critical('Critical system failure!');
  
  // Test user-specific logging
  console.log('\nTesting user-specific logging:');
  const userId = 123;
  logger.info('User logged in successfully', userId, { email: 'test@example.com' });
  logger.debug('User preferences loaded', userId, { preferences: ['stocks', 'bonds'] });
  
  // Test database operation logging
  console.log('\nTesting database operation logging:');
  logger.logDbOperation('INSERT', 'users', userId, { name: 'Test User' });
  logger.logDbError('UPDATE', 'users', new Error('Connection timeout'), userId);
  
  // Test LLM operation logging
  console.log('\nTesting LLM operation logging:');
  logger.logLLMCall('test-model', 'What is the best investment?', userId, { temperature: 0.7 });
  logger.logLLMResponse('test-model', 150, userId, { tokens: 150 });
  logger.logLLMError('test-model', new Error('API rate limit exceeded'), userId);
  
  // Test file rotation by generating many logs
  console.log('\nTesting file rotation:');
  for (let i = 0; i < 15; i++) {
    logger.info(`Test log entry ${i + 1}`, userId, { iteration: i + 1 });
  }
  
  console.log('\nLogging system test completed!');
  console.log('Check the backend/logs/ directory for generated log files.');
};

// Run the test
testLoggingSystem();