import express from 'express';
import db from '../database';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth';

const router = express.Router();

// Register new user
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  console.log('Registration attempt:', { email, password: password ? '***' : 'missing' });

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashedPassword = hashPassword(password);
  const verificationToken = generateToken();

  db.run(
    `INSERT INTO users (email, password, verification_token) VALUES (?, ?, ?)`,
    [email, hashedPassword, verificationToken],
    function(err) {
      if (err) {
        console.error('Registration error:', err);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'User already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      console.log('User registered successfully:', email, 'with ID:', this.lastID);
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
  
  console.log('Login attempt:', { 
    email, 
    password: password ? '***' : 'missing',
    bodyKeys: Object.keys(req.body),
    body: req.body
  });
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  db.get(
    `SELECT id, email, password, name, email_verified FROM users WHERE email = ?`,
    [email],
    (err, user: any) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({ 
          error: 'User not found', 
          needsSignup: true 
        });
      }
      
      if (!verifyPassword(password, user.password)) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ error: 'Invalid password' });
      }
      
      console.log('Login successful for user:', email);
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.email_verified
        },
        needsOnboarding: !user.name
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

  // Update user profile
  db.run(
    `UPDATE users SET name = ?, country = ?, age = ?, risk_preference = ?, return_estimate = ? WHERE id = ?`,
    [name, country, age, riskPreference, returnEstimate, userId],
    function(err) {
      if (err) {
        console.error('Error updating user profile:', err);
        return res.status(500).json({ error: err.message });
      }

      console.log('User profile updated, affected rows:', this.changes);

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

// Get user profile by ID
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
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