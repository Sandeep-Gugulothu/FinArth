import OpenAI from 'openai';

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

export async function generateInsightWithReasonAct(query: string): Promise<ReActResult> {
  const open_ai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  });

  const steps: ReActStep[] = [];
  let context = `User Query: ${query}\n\n`;

  for (let i = 0; i < 3; i++) {
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

    const thoughtResponse = await open_ai.chat.completions.create({
      model: "xiaomi/mimo-v2-flash:free",
      messages: [{ role: "user", content: thoughtPrompt }],
      max_tokens: 200
    });

    const thoughtContent = thoughtResponse.choices[0].message.content || "";
    const thoughtMatch = thoughtContent.match(/Thought: (.*?)(?:\nAction:|$)/s);
    const actionMatch = thoughtContent.match(/Action: (.*?)$/m);

    const thought = thoughtMatch?.[1]?.trim() || thoughtContent;
    const action = actionMatch?.[1]?.trim();

    const step: ReActStep = { thought };

    // Action step (if needed)
    if (action && action !== "none" && action in mockTools) {
      step.action = action;
      const toolResult = await mockTools[action as keyof typeof mockTools]();
      step.observation = toolResult;
      context += `Step ${i + 1}:\nThought: ${thought}\nAction: ${action}\nObservation: ${toolResult}\n\n`;
    } else {
      context += `Step ${i + 1}:\nThought: ${thought}\n\n`;
    }

    steps.push(step);
  }

  // Final answer
  const finalPrompt = `${context}
Based on your analysis above, provide a comprehensive final answer to the user's query: "${query}"

Focus on actionable insights and specific recommendations.`;

  const finalResponse = await open_ai.chat.completions.create({
    model: "xiaomi/mimo-v2-flash:free",
    messages: [{ role: "user", content: finalPrompt }],
    max_tokens: 300
  });

  const finalAnswer = finalResponse.choices[0].message.content || "Unable to generate final answer.";

  return { steps, finalAnswer };
}