/*
 * File Name: users.ts
 * Description: This file contains the code for user-related operations,
 *              including registration, login, and preference management.
 * Author Name: Sandeep Gugulothu
 * Creation Date: 22-Jan-2026
 * Modified Date: 27-Jan-2026
 * Changes:
 * Version 1.0: Initial creation with user details registration and data
 *              retrieval.
 * Version 1.1: Added onboarding data handling, session caching, and sync to backup
 *
 * Instructions to run: This module can be imported from other backend system
 *                      files to perform user-related operations.
 *
 * File Execution State: Validation is in progress
 */

import express from 'express';
import db, { syncToBackup } from '../database';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';
import { sessionCache } from '../utils/sessionCache';
import Logger from '../utils/Logger';

const router = express.Router();
const logger = Logger.getInstance();

// Register new user
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  logger.info('User registration attempt', undefined, { email });

  if (!email || !password) {
    logger.error('Registration failed: Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashedPassword = hashPassword(password);
  const verificationToken = generateToken();

  logger.logDbOperation('INSERT', 'users', undefined, { email });
  
  db.run(
    `INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)`,
    [email, hashedPassword, verificationToken],
    function(err) {
      if (err) {
        logger.logDbError('INSERT', 'users', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'User already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      logger.info('User registered successfully', this.lastID, { email, userId: this.lastID });
      res.json({ 
        success: true, 
        userId: this.lastID,
        message: 'User registered successfully' 
      });
    }
  );
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  logger.info('User login attempt', undefined, { email });
  
  if (!email || !password) {
    logger.error('Login failed: Missing credentials');
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  logger.logDbOperation('SELECT', 'users', undefined, { email });
  
  db.get(
    `SELECT id, email, password, name, email_verified, is_first_login FROM users WHERE email = ?`,
    [email],
    (err, user: any) => {
      if (err) {
        logger.logDbError('SELECT', 'users', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        logger.error('Login failed: User not found', undefined, { email });
        return res.status(404).json({ 
          error: 'User not found', 
          needsSignup: true 
        });
      }
      
      if (!verifyPassword(password, user.password)) {
        logger.error('Login failed: Invalid password', user.id, { email });
        return res.status(401).json({ error: 'Invalid password' });
      }
      
      // Load user preferences from database or cache
      if (user.is_first_login) {
        // First login - check session cache
        const cachedSession = sessionCache.get(user.id);
        if (cachedSession) {
          logger.info('Using cached session for first login', user.id);
        }
      } else {
        // Load from database
        logger.logDbOperation('SELECT', 'users_with_preferences', user.id);
        db.get(`
          SELECT u.*, 
                 GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
                 GROUP_CONCAT(DISTINCT uo.objective) as objectives
          FROM users u
          LEFT JOIN user_investments ui ON u.id = ui.user_id
          LEFT JOIN user_objectives uo ON u.id = uo.user_id
          WHERE u.id = ?
          GROUP BY u.id
        `, [user.id], (err, fullUser: any) => {
          if (!err && fullUser) {
            sessionCache.set(user.id, {
              name: fullUser.name,
              country: fullUser.country,
              age: fullUser.age,
              riskPreference: fullUser.risk_preference,
              familiarInvestments: fullUser.investments ? fullUser.investments.split(',') : [],
              returnEstimate: fullUser.return_estimate,
              selectedOptions: fullUser.objectives ? fullUser.objectives.split(',') : [],
              isFirstLogin: false
            });
            logger.info('User preferences loaded to cache', user.id);
          }
        });
      }
      
      logger.info('User login successful', user.id, { email });
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.email_verified
        },
        needsOnboarding: !user.name,
        isFirstLogin: user.is_first_login
      });
    }
  );
});

// Complete onboarding
router.post('/onboarding', (req, res) => {
  const {
    userId,
    name,
    country,
    age,
    riskPreference,
    familiarInvestments,
    returnEstimate,
    selectedOptions
  } = req.body;

  console.log('Onboarding data received:', {
    userId,
    name,
    country,
    age,
    riskPreference,
    familiarInvestments: familiarInvestments?.length,
    returnEstimate,
    selectedOptions: selectedOptions?.length
  });

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Save to session cache first
  sessionCache.set(userId, {
    name,
    country,
    age,
    riskPreference,
    familiarInvestments: familiarInvestments || [],
    returnEstimate,
    selectedOptions: selectedOptions || [],
    isFirstLogin: false
  });

  // Update user profile in database
  db.run(
    `UPDATE users SET name = ?, country = ?, age = ?, risk_preference = ?, return_estimate = ?, is_first_login = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [name, country, age, riskPreference, returnEstimate, userId],
    function(err) {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ error: err.message });
      }

      console.log('User profile updated, affected rows:', this.changes);

      // Clear existing investments and objectives
      db.run(`DELETE FROM user_investments WHERE user_id = ?`, [userId]);
      db.run(`DELETE FROM user_objectives WHERE user_id = ?`, [userId]);

      // Insert investments
      if (familiarInvestments && familiarInvestments.length > 0) {
        const investmentStmt = db.prepare(`INSERT INTO user_investments (user_id, investment_type) VALUES (?, ?)`);
        familiarInvestments.forEach((investment: string) => {
          investmentStmt.run(userId, investment);
        });
        investmentStmt.finalize();
        console.log('Investments saved:', familiarInvestments.length);
      }

      // Insert objectives
      if (selectedOptions && selectedOptions.length > 0) {
        const objectiveStmt = db.prepare(`INSERT INTO user_objectives (user_id, objective) VALUES (?, ?)`);
        selectedOptions.forEach((objective: string) => {
          objectiveStmt.run(userId, objective);
        });
        objectiveStmt.finalize();
        console.log('Objectives saved:', selectedOptions.length);
      }

      // Sync to backup
      syncToBackup();

      res.json({ 
        success: true, 
        message: 'Onboarding completed successfully' 
      });
    }
  );
});

// Verify email
router.get('/verify/:token', (req, res) => {
  const { token } = req.params;
  
  db.run(
    `UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = ?`,
    [token],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(400).json({ error: 'Invalid verification token' });
      }
      
      res.json({ success: true, message: 'Email verified successfully' });
    }
  );
});

// Get user preferences for LLM calls
router.get('/:userId/preferences', (req, res) => {
  const { userId } = req.params;
  const userIdNum = parseInt(userId);
  
  if (isNaN(userIdNum)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  
  // Handle demo user (ID 999)
  if (userIdNum === 999) {
    const demoPreferences = {
      userId: 999,
      name: 'Demo User',
      country: 'India',
      age: 30,
      riskPreference: 'moderate',
      familiarInvestments: ['Mutual Funds', 'Stocks'],
      returnEstimate: 'ai',
      selectedOptions: ['strategy', 'returns'],
      isFirstLogin: false
    };
    
    // Cache demo preferences
    sessionCache.set(999, demoPreferences);
    
    return res.json({
      success: true,
      source: 'demo',
      preferences: demoPreferences
    });
  }
  
  // First check session cache
  const cachedSession = sessionCache.get(userIdNum);
  if (cachedSession) {
    console.log('Returning preferences from cache for user:', userId);
    return res.json({
      success: true,
      source: 'cache',
      preferences: cachedSession
    });
  }
  
  // Fallback to database
  db.get(`
    SELECT u.*, 
           GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
           GROUP_CONCAT(DISTINCT uo.objective) as objectives
    FROM users u
    LEFT JOIN user_investments ui ON u.id = ui.user_id
    LEFT JOIN user_objectives uo ON u.id = uo.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `, [userId], (err, user: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const preferences = {
      userId: user.id,
      name: user.name,
      country: user.country,
      age: user.age,
      riskPreference: user.risk_preference,
      familiarInvestments: user.investments ? user.investments.split(',') : [],
      returnEstimate: user.return_estimate,
      selectedOptions: user.objectives ? user.objectives.split(',') : [],
      isFirstLogin: user.is_first_login
    };
    
    // Cache for future use
    sessionCache.set(userIdNum, preferences);
    
    console.log('Returning preferences from database for user:', userId);
    res.json({
      success: true,
      source: 'database',
      preferences
    });
  });
});

// Get user profile by ID
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const userIdNum = parseInt(userId);
  
  // Handle demo user (ID 999)
  if (userIdNum === 999) {
    const demoUser = {
      id: 999,
      email: 'guest@finarth.demo',
      name: 'Demo User',
      country: 'India',
      age: 30,
      risk_preference: 'moderate',
      return_estimate: 'ai',
      email_verified: true,
      is_first_login: false,
      investments: 'Mutual Funds,Stocks',
      objectives: 'strategy,returns'
    };
    
    return res.json(demoUser);
  }
  
  db.get(`
    SELECT u.*, 
           GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
           GROUP_CONCAT(DISTINCT uo.objective) as objectives
    FROM users u
    LEFT JOIN user_investments ui ON u.id = ui.user_id
    LEFT JOIN user_objectives uo ON u.id = uo.user_id
    WHERE u.id = ?
    GROUP BY u.id
  `, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Get all users with their data
router.get('/', (req, res) => {
  db.all(`
    SELECT u.*, 
           GROUP_CONCAT(DISTINCT ui.investment_type) as investments,
           GROUP_CONCAT(DISTINCT uo.objective) as objectives
    FROM users u
    LEFT JOIN user_investments ui ON u.id = ui.user_id
    LEFT JOIN user_objectives uo ON u.id = uo.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

export default router;