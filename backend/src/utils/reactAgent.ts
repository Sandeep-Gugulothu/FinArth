/*
 * File Name: reactAgent.ts
 * Description: This file contains the code for calling the LLM using
 *              Reason+Act framework to generate financial insights.
 *              This file can consider user preferences if userId is provided.
 * Author Name: The FinArth Team
 * Creation Date: 24-Jan-2026
 * Modified Date: 27-Jan-2026
 * Version: 1.1
 *
 * Instructions to run: This module can be imported from other backend system
 *                      files to invoke the generateInsightWithReasonAct
 *                      function.
 *
 * File Execution State: Validation is in progress
 * 
 * Note: Make sure you update the API key with yours and defined in .env file.
 *       If you don't have one, then please feel to create one from the website
 *       below.
 *       https://openrouter.ai/settings/keys
 */

import OpenAI from 'openai';
import { trackOpenAI } from 'opik-openai';
import Logger from './Logger';

const logger = Logger.getInstance();
const MODEL_NAME = 'nvidia/nemotron-3-nano-30b-a3b:free';
interface ReActStep {
  thought: string;
  action?: string;
  observation?: string;
}

interface ReActResult {
  steps: ReActStep[];
  finalAnswer: string;
}

// Mock tool functions
const mockTools = {
  fetchProjectData: async (): Promise<string> => {
    return "Project data: Budget ₹50L, Timeline: 7 years, Risk tolerance: Moderate, Current savings: ₹12L";
  },

  calculateRisk: async (data: string): Promise<string> => {
    return "Risk analysis: Market volatility 15%, Inflation risk 6%, Liquidity risk 3%";
  },

  getMarketData: async (): Promise<string> => {
    return "Market data: Equity returns 12%, Debt returns 7%, Real estate 9%";
  }
};

export async function generateInsightWithReasonAct(query: string, userId?: number): Promise<ReActResult> {
  logger.info('Starting ReAct agent process', userId, { user_Id:userId, query, model: MODEL_NAME });
  
  // Initialize the original Open AI client
  const open_ai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  });

  // Wrap the client with opik tracking
  const trackedOpenAI = trackOpenAI(open_ai);

  const steps: ReActStep[] = [];
  let userContext = '';
  
  // Get user preferences if userId provided
  if (userId) {
    try {
      logger.info('Fetching user preferences for LLM context', userId);
      const response = await fetch(`http://localhost:8000/api/users/${userId}/preferences`);
      if (response.ok) {
        const data = await response.json();
        const prefs = data.preferences;
        userContext = `\nUser Context:
- Name: ${prefs.name}
- Country: ${prefs.country}
- Age: ${prefs.age}
- Risk Preference: ${prefs.riskPreference}
- Familiar Investments: ${prefs.familiarInvestments?.join(', ')}
- Investment Objectives: ${prefs.selectedOptions?.join(', ')}
`;
        logger.info('User preferences loaded for LLM context', userId, { preferencesLoaded: true });
      }
    } catch (error) {
      logger.logLLMError('preferences-fetch', error, userId);
    }
  }
  
  let context = `User Query: ${query}${userContext}\n\n`;

  for (let i = 0; i < 3; i++)
  {
    logger.debug(`ReAct step ${i + 1} starting`, userId, { step: i + 1, context: context.substring(0, 100) });
    
    // Thought step
    const thoughtPrompt = `${context}
Think step by step about this financial query. What do you need to analyze or what tool should you use?

Available tools:
- fetchProjectData: Get project financial details
- calculateRisk: Analyze risk factors
- getMarketData: Get current market information

Respond with your reasoning in this format:
Thought: [your reasoning]
Action: [tool_name] (if needed, otherwise say "none")`;

    logger.logLLMCall(MODEL_NAME, thoughtPrompt, userId, { step: i + 1, type: 'thought' });
    
    const thoughtResponse = await trackedOpenAI.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: thoughtPrompt }],
      max_tokens: 200
    });

    const thoughtContent = thoughtResponse.choices[0].message.content || "";
    logger.logLLMResponse(MODEL_NAME, thoughtContent.length, userId, { step: i + 1, type: 'thought' });
    
    const thoughtMatch = thoughtContent.match(/Thought: (.*?)(?:\nAction:|$)/s);
    const actionMatch = thoughtContent.match(/Action: (.*?)$/m);

    const thought = thoughtMatch?.[1]?.trim() || thoughtContent;
    const action = actionMatch?.[1]?.trim();

    const step: ReActStep = { thought };

    // Action step (if needed)
    if (action && action !== "none" && action in mockTools) {
      logger.debug(`Executing tool: ${action}`, userId, { step: i + 1, tool: action });
      step.action = action;
      const toolResult = await mockTools[action as keyof typeof mockTools]();
      step.observation = toolResult;
      context += `Step ${i + 1}:\nThought: ${thought}\nAction: ${action}\nObservation: ${toolResult}\n\n`;
      logger.debug(`Tool execution completed: ${action}`, userId, { step: i + 1, tool: action, resultLength: toolResult.length });
    } else {
      context += `Step ${i + 1}:\nThought: ${thought}\n\n`;
    }

    steps.push(step);
  }

  // Final answer
  const finalPrompt = `${context}
Based on your analysis above, provide a comprehensive final answer to the user's query: "${query}"

Focus on actionable insights and specific recommendations.`;

  logger.logLLMCall(MODEL_NAME, finalPrompt, userId, { type: 'final_answer' });
  
  const finalResponse = await trackedOpenAI.chat.completions.create({
    model: MODEL_NAME,
    messages: [{ role: "user", content: finalPrompt }],
    max_tokens: 300
  });

  const finalAnswer = finalResponse.choices[0].message.content || "Unable to generate final answer.";
  logger.logLLMResponse(MODEL_NAME, finalAnswer.length, userId, { type: 'final_answer' });

  // Ensure all traces are sent before sending the response to user
  await trackedOpenAI.flush();
  
  logger.info('ReAct agent process completed', userId, { 
    stepsCount: steps.length, 
    finalAnswerLength: finalAnswer.length 
  });

  return { steps, finalAnswer };
}