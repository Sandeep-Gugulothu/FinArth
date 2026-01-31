/*
 * File Name: database.ts
 * Description: This file contains the code for initialising database tables.
 * Author Name: Sandeep Gugulothu
 * Creation Date: 19-Jan-2026
 * Modified Date: 27-Jan-2026
 * Changes:
 * Version 1.0: Initial database creation.
 * Version 1.1: Added backup and sync functionality.
 *
 * Instructions to run: This module can be imported from other backend system
 *                      files to perform database operations.
 *
 * File Execution State: Validation is in progress
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import Logger from './utils/Logger';

const logger = Logger.getInstance();

const dbPath = path.join(__dirname, '../database.sqlite');
const backupPath = path.join(__dirname, '../database_backup.sqlite');

// Create backup database
const createBackup = () => {
  if (fs.existsSync(dbPath)) {
    fs.copyFileSync(dbPath, backupPath);
    logger.info('Database backup created successfully');
  } else {
    logger.error('Primary database not found for backup');
  }
};

// Sync primary to backup
const syncToBackup = () => {
  try {
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath);
      logger.info('Database synced to backup successfully');
    }
  } catch (error) {
    logger.error('Failed to sync database to backup', undefined, { error });
  }
};

const db = new sqlite3.Database(dbPath);
const backupDb = new sqlite3.Database(backupPath);

// Initialize database tables
db.serialize(() => {
  db.run(`
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
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      investment_type TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS user_objectives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      objective TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  db.run(`
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
  `);
});

// Create backup tables
backupDb.serialize(() => {
  backupDb.run(`
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
  `);

  backupDb.run(`
    CREATE TABLE IF NOT EXISTS user_investments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      investment_type TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  backupDb.run(`
    CREATE TABLE IF NOT EXISTS user_objectives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      objective TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  backupDb.run(`
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
  `);
});

// Auto-sync every 5 minutes
setInterval(syncToBackup, 5 * 60 * 1000);

export { syncToBackup, backupDb };
export default db;