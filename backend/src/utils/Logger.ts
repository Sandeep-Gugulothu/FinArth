import fs from 'fs';
import path from 'path';

export enum LogLevel {
  INFO = 'INFO',
  DEBUG = 'DEBUG', 
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

interface LogConfig {
  maxLinesPerFile: number;
  logLevel: LogLevel;
  enableColors: boolean;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  userId?: number;
  message: string;
  metadata?: any;
}

class Logger {
  private static instance: Logger;
  private config: LogConfig;
  private logDir: string;
  private colorCodes = {
    [LogLevel.INFO]: '\x1b[32m',     // Green
    [LogLevel.DEBUG]: '\x1b[34m',    // Blue  
    [LogLevel.ERROR]: '\x1b[33m',    // Orange/Yellow
    [LogLevel.CRITICAL]: '\x1b[31m', // Red
    RESET: '\x1b[0m'
  };

  private constructor() {
    this.config = {
      maxLinesPerFile: 1000,
      logLevel: LogLevel.INFO,
      enableColors: true
    };
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogFileName(userId?: number): string {
    const date = new Date().toISOString().split('T')[0];
    const userPrefix = userId ? `user_${userId}` : 'system';
    return `${userPrefix}_${date}.log`;
  }

  private getCurrentFileLineCount(filePath: string): number {
    if (!fs.existsSync(filePath)) return 0;
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').filter(line => line.trim()).length;
  }

  private getNextLogFile(userId?: number): string {
    const baseFileName = this.getLogFileName(userId);
    const basePath = path.join(this.logDir, baseFileName);
    
    let fileIndex = 1;
    let currentFile = basePath;
    
    while (fs.existsSync(currentFile)) {
      const lineCount = this.getCurrentFileLineCount(currentFile);
      if (lineCount < this.config.maxLinesPerFile) {
        return currentFile;
      }
      
      const nameWithoutExt = baseFileName.replace('.log', '');
      currentFile = path.join(this.logDir, `${nameWithoutExt}_${fileIndex}.log`);
      fileIndex++;
    }
    
    return currentFile;
  }

  private formatLogEntry(entry: LogEntry): string {
    const colorCode = this.config.enableColors ? this.colorCodes[entry.level] : '';
    const resetCode = this.config.enableColors ? this.colorCodes.RESET : '';
    const userInfo = entry.userId ? `[User:${entry.userId}]` : '[System]';
    const metadata = entry.metadata ? ` | ${JSON.stringify(entry.metadata)}` : '';
    
    return `${colorCode}[${entry.timestamp}] [${entry.level}] ${userInfo} ${entry.message}${metadata}${resetCode}`;
  }

  private writeLog(entry: LogEntry): void {
    const logFile = this.getNextLogFile(entry.userId);
    const formattedEntry = this.formatLogEntry(entry);
    
    fs.appendFileSync(logFile, formattedEntry + '\n');
    
    // Also log to console for development
    console.log(formattedEntry);
  }

  public info(message: string, userId?: number, metadata?: any): void {
    this.log(LogLevel.INFO, message, userId, metadata);
  }

  public debug(message: string, userId?: number, metadata?: any): void {
    this.log(LogLevel.DEBUG, message, userId, metadata);
  }

  public error(message: string, userId?: number, metadata?: any): void {
    this.log(LogLevel.ERROR, message, userId, metadata);
  }

  public critical(message: string, userId?: number, metadata?: any): void {
    this.log(LogLevel.CRITICAL, message, userId, metadata);
  }

  private log(level: LogLevel, message: string, userId?: number, metadata?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      userId,
      message,
      metadata
    };

    this.writeLog(entry);
  }

  // Database operation logging helpers
  public logDbOperation(operation: string, table: string, userId?: number, data?: any): void {
    this.info(`DB Operation: ${operation} on ${table}`, userId, { table, operation, data });
  }

  public logDbError(operation: string, table: string, error: any, userId?: number): void {
    this.error(`DB Error: ${operation} on ${table} failed`, userId, { table, operation, error: error.message });
  }

  // LLM operation logging helpers
  public logLLMCall(model: string, prompt: string, userId?: number, metadata?: any): void {
    this.info(`LLM Call: ${model}`, userId, { model, promptLength: prompt.length, ...metadata });
  }

  public logLLMResponse(model: string, responseLength: number, userId?: number, metadata?: any): void {
    this.info(`LLM Response: ${model}`, userId, { model, responseLength, ...metadata });
  }

  public logLLMError(model: string, error: any, userId?: number): void {
    this.error(`LLM Error: ${model} failed`, userId, { model, error: error.message });
  }
}

export default Logger;