/*
 * File Name: openrouter_api.ts
 * Description: This file contains the code for calling the openrouter api
 * Author Name: The Open Router Team
 * Creation Date: 19-Jan-2024
 * Modified Date: 24-Jan-2024
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
 * tsc openrouter_api.ts
 * 5. Run the compiled JavaScript file:
 * node openrouter_api.js
 *
 * Note: Make sure you update the API key with yours. If you don't have one, then
 * please feel to create one from the website below.
 * https://openrouter.ai/settings/keys
 */

(async() => {

    function print_message(message: any) {
        console.log(JSON.stringify(message, null, 2));
    }

    try {
        // First API call with reasoning
        let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "xiaomi/mimo-v2-flash:free",
                "messages": [
                    {
                        "role": "user",
                        "content": "what is the best way to invest in stocks?"
                    }
                ],
                "reasoning": {"enable": true}
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} text: ${response.statusText}`);
        }

        // Extract the assistant message with reasoning_details and save it to the response variable
        const result = await response.json();
        const assistantMessage = result.choices[0].message;
        print_message(assistantMessage);

        // Preserve the assistant message with reasoning_details
        const messages = [
            {
                role: 'user',
                content: "what is the best way to invest in stocks?"
            },
            {
                role: 'assistant',
                content: assistantMessage.content,
                reasoning_details: assistantMessage.reasoning_details // pass back unmodified
            },
            {
                role: 'user',
                content: "Are you sure? Think carefully.",
            },
        ];

        // Second API call - model continues reasoning from where it left off
        let response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer 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`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "xiaomi/mimo-v2-flash:free",
                "messages": messages  // Includes preserved reasoning_details
            })
        });

        if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status} text: ${response2.statusText}`);
        }

        // Extract the assistant message with reasoning_details and save it to the response variable
        const result2 = await response2.json();
        print_message(result2);

    } catch (error) {
        console.error('Error:', error);
    }

})();