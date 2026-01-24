# ReAct Agent Setup Instructions

## Backend Setup

1. Install OpenAI dependency:
```bash
cd backend
npm install openai@^4.0.0
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

3. Start the backend server:
```bash
npm run dev
```

## Frontend Setup

The frontend is already configured to call the ReAct agent API.

## Usage

1. Navigate to the AI Agent tab in the dashboard
2. Click the "Analyze Risks" button to trigger the ReAct pattern
3. Or type any financial query in the chat input

## ReAct Pattern Flow

1. **Thought**: AI reasons about the query
2. **Action**: AI decides which tool to use (if any)
3. **Observation**: Tool result is fed back to AI
4. **Repeat**: Up to 3 iterations
5. **Final Answer**: Comprehensive response based on reasoning

## Available Mock Tools

- `fetchProjectData`: Get project financial details
- `calculateRisk`: Analyze risk factors  
- `getMarketData`: Get current market information

## API Endpoint

`POST /api/agent/generate-insight`

Request body:
```json
{
  "query": "What are key risks in this project plan?"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "steps": [
      {
        "thought": "I need to analyze the project data first",
        "action": "fetchProjectData",
        "observation": "Project data: Budget ₹50L, Timeline: 7 years..."
      }
    ],
    "finalAnswer": "Based on my analysis, the key risks are..."
  }
}
```