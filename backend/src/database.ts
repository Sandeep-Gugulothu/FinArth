import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

export default db;