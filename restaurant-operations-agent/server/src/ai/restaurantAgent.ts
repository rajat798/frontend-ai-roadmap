import "dotenv/config";
import OpenAI from "openai";
import { restaurantTools } from "./toolDefinitions";
import { executeTool } from "./toolExecutor";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function askRestaurantAgent(userMessage: string) {
    const model = process.env.OPENAI_MODEL;

    if (!model) {
        throw new Error("Open AI model not configured");
    }

    let response = await client.responses.create({
        model,
        instructions: `
You are a restaurant operations assistant.

Help restaurant managers understand whether they are prepared
for service.

Important rules:
- Use the available tools when restaurant data is required.
- Do not invent inventory quantities.
- Do not invent demand forecasts.
- Do not invent recipe information.
- Base operational conclusions on tool results.
    `.trim(),
        input: userMessage,
        tools: restaurantTools,
    });

    // const toolOutputs = [];

    const MAX_STEPS = 5;


    for(let step = 0; step < MAX_STEPS; step++) {
        const functionCalls = response.output.filter(
            item => item.type === "function_call"
        )

        if(functionCalls.length === 0) {
            return response;
        }

        const toolOutputs = [];

        for (const call of functionCalls) {
            const args = JSON.parse(call.arguments);

            console.log(
                `Executing tool: ${call.name}`, args
            )

            const result = executeTool(call.name, args);

            console.log(`Tool Result: `, result);

            toolOutputs.push({
                type: "function_call_output" as const,
                call_id: call.call_id,
                output: JSON.stringify(result),
            });
        }

        response = await client.responses.create({
            model,
            previous_response_id: response.id,
            input: toolOutputs,
            tools: restaurantTools,
        });
    }


    // for (const item of firstResponse.output) {
    //     if (item.type !== "function_call") {
    //         continue;
    //     }

    //     const args = JSON.parse(item.arguments);

    //     const result = executeTool(item.name, args);

    //     toolOutputs.push({
    //         type: "function_call_output" as const,
    //         call_id: item.call_id,
    //         output: JSON.stringify(result),
    //     })


    // }
    // const finalResponse = await client.responses.create({
    //     model,
    //     previous_response_id: firstResponse.id,
    //     input: toolOutputs,
    //     tools: restaurantTools,
    // });

    // return finalResponse;
    throw new Error(
        `Agent exceeded maximum step limit of ${MAX_STEPS}`
    );
}