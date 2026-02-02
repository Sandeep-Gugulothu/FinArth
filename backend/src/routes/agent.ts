/*
 * File Name: agent.ts
 * Description: This file contains the code for invoking custom function call
 *              that triggers the LLM call for the user's query.
 * Author Name: Sandeep Gugulothu
 * Creation Date: 25-Jan-2026
 * Modified Date: 27-Jan-2026
 * Changes:
 * Version 1.0: Initial creation with agent functionality.
 * Version 1.1: Added userId support for personalized insights.
 *
 * Instructions to run: This module can be imported from other backend system
 *                      files to expose agent functionality via backend server.
 *
 * File Execution State: Validation is in progress
 */

import express from 'express';
import { generateInsightWithReasonAct } from '../utils/reactAgent';
import Logger from '../utils/Logger';

const router = express.Router();
const logger = Logger.getInstance();

router.post('/generate-insight', async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    logger.info('ReAct agent insight request received', userId, { query, hasUserId: !!userId });
    
    if (!query) {
      logger.error('ReAct agent request missing query', userId);
      return res.status(400).json({ error: 'Query is required' });
    }

    const result = await generateInsightWithReasonAct(query, userId);
    
    logger.info('ReAct agent insight generated successfully', userId, { 
      stepsGenerated: result.steps.length,
      finalAnswerLength: result.finalAnswer.length
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.critical('ReAct agent failed to generate insight', req.body.userId, { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    res.status(500).json({ 
      error: 'Failed to generate insight',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;