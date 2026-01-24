import express from 'express';
import { generateInsightWithReasonAct } from '../utils/reactAgent';

const router = express.Router();

router.post('/generate-insight', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await generateInsightWithReasonAct(query);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('ReAct agent error:', error);
    res.status(500).json({ 
      error: 'Failed to generate insight',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;