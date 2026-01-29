import express from 'express';
import db from '../database';

const router = express.Router();

// Get user portfolio
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.all(
    'SELECT * FROM portfolio_holdings WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ holdings: rows });
    }
  );
});

// Add new holding
router.post('/:userId/holdings', (req, res) => {
  const { userId } = req.params;
  const { name, category, amount, date, symbol = '' } = req.body;
  
  db.run(
    'INSERT INTO portfolio_holdings (user_id, name, category, amount, date, symbol) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, name, category, amount, date, symbol],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Holding added successfully' });
    }
  );
});

// Update holding
router.put('/:userId/holdings/:holdingId', (req, res) => {
  const { userId, holdingId } = req.params;
  const { name, category, amount, date, symbol = '' } = req.body;
  
  db.run(
    'UPDATE portfolio_holdings SET name = ?, category = ?, amount = ?, date = ?, symbol = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [name, category, amount, date, symbol, holdingId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Holding updated successfully' });
    }
  );
});

// Delete holding
router.delete('/:userId/holdings/:holdingId', (req, res) => {
  const { userId, holdingId } = req.params;
  
  db.run(
    'DELETE FROM portfolio_holdings WHERE id = ? AND user_id = ?',
    [holdingId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Holding deleted successfully' });
    }
  );
});

export default router;