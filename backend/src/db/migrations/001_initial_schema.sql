-- Migration: 001_initial_schema
-- Description: Initial database schema with all base tables

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
);

CREATE TABLE IF NOT EXISTS user_investments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  investment_type TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS user_objectives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  objective TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
