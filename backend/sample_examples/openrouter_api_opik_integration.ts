/*
 * File Name: openrouter_api_opik_integration.ts
 * Description: This file contains the code for calling the openrouter api
 * Author Name: The Open Router Team
 * Creation Date: 19-Jan-2024
 * Modified Date: 24-Jan-2026
 * Version: 1.0
 *
 * Instructions to run:
 * Follow the command sequence below in the terminal:
 * 1. Install the required dependencies:
 * npm install @types/node
 * 2. Install typescript
 * npm install typescript
 * 3. Initialize typescript
 * npx tsc --init
 * 4. Compile the script:
 * tsc openrouter_api_opik_integration.ts
 * 5. Run the compiled JavaScript file:
 * node openrouter_api_opik_integration.js
 *
 * File Execution State: Not as intended
 * 
 * Note: Make sure you update the API key with yours. If you don't have one, then
 * please feel to create one from the website below.
 * https://openrouter.ai/settings/keys
 */

import OpenAI from "openai";
import { trackOpenAI } from "opik-openai";

(async() => {

    try
    {
        // Initialize the original OpenAI client
        const open_ai = new OpenAI({
            apiKey: '<API_KEY>'
        });

        // Wrap the client with opik tracking
        const trackedOpenAI = trackOpenAI(open_ai);

        // Use the tracked client just like the original
        const completion = await trackedOpenAI.chat.completions.create({
            model: "xiaomi/mimo-v2-flash:free",
            messages: [
                {
                    role: "user",
                    content: "Hello, how can you help me today?"
                }
            ]
        });

        console.log(completion.choices[0].message.content);

        // Ensure all traces are sent before your app terminates
        await trackedOpenAI.flush();
    }
    catch(error)
    {
        console.error('Error:', error);
    }
})();