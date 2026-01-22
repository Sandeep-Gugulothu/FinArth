import express from 'express';

const router = express.Router();

router.post('/generate', (req, res) => {
  res.json({ message: 'Plans endpoint - coming soon' });
});

export default router;