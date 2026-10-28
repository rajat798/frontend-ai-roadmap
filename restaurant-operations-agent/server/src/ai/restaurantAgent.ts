import "dotenv/config";
import OpenAI from "openai";
import { restaurantTools } from "./toolDefinitions";
import { executeTool } from "./toolExecutor";
import { createTask } from "../tools/createTask";

export type PendingApproval = {
    type: "pending_approval";
    responseId: string;
    callId: string;
    toolName: "create_task";
    arguments: {
        title: string;
        quantity: number | null;
        unit: string | null;
    };
};

type CompletedAgentResult = {
    type: "completed",
    response: OpenAI.Responses.Response
};

export type RestaurantAgentResult = PendingApproval | CompletedAgentResult;

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function askRestaurantAgent(userMessage: string): Promise<RestaurantAgentResult> {
    const model = process.env.OPENAI_MODEL;

    if (!model) {
        throw new Error("Open AI model not configured");
    }

    const response = await client.responses.create({
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

    // const MAX_STEPS = 5;


    // for(let step = 0; step < MAX_STEPS; step++) {
    //     const functionCalls = response.output.filter(
    //         item => item.type === "function_call"
    //     )

    //     if(functionCalls.length === 0) {
    //         return {
    //             type: "completed",
    //             response,
    //         };
    //     }

    //     const toolOutputs = [];

    //     for (const call of functionCalls) {
    //         const args = JSON.parse(call.arguments);

    //         if (call.name === "create_task") {
    //             return {
    //                 type: "pending_approval",
    //                 responseId: response.id,
    //                 callId: call.call_id,
    //                 toolName: "create_task",
    //                 arguments: args,
    //             };
    //         }

    //         console.log(
    //             `Executing tool: ${call.name}`, args
    //         )

    //         const result = executeTool(call.name, args);

    //         console.log(`Tool Result: `, result);

    //         toolOutputs.push({
    //             type: "function_call_output" as const,
    //             call_id: call.call_id,
    //             output: JSON.stringify(result),
    //         });
    //     }

    //     response = await client.responses.create({
    //         model,
    //         previous_response_id: response.id,
    //         input: toolOutputs,
    //         tools: restaurantTools,
    //     });
    // }


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
    // throw new Error(
    //     `Agent exceeded maximum step limit of ${MAX_STEPS}`
    // );

    return runAgentLoop(response, model);
}

export async function approveTask(pending: PendingApproval) {
    const model = process.env.OPENAI_MODEL;
    if(!model) {
        throw new Error("Open AI model not configured");
    }

    const { title, quantity, unit } = pending.arguments;

    if(!title.trim()) throw new Error("Task title is required");

    const createdTask = createTask({
        title,
        quantity: quantity ?? undefined,
        unit: unit ?? undefined,
    });
    
    const response = await client.responses.create({
        model,
        previous_response_id: pending.responseId,
        input: [
            {
                type: "function_call_output",
                call_id: pending.callId,
                output: JSON.stringify({
  status: "approved_and_executed",
  message:
    "The manager approved this action and the task has already been created. No further approval is required.",
  executedTask: createdTask,
}),
            }
        ],
        tools: restaurantTools
    })
    
    return runAgentLoop(response, model);
}

export async function rejectTask(
  pending: PendingApproval
): Promise<RestaurantAgentResult> {
  const model = process.env.OPENAI_MODEL;

  if (!model) {
    throw new Error("OpenAI model not configured");
  }

  const response = await client.responses.create({
    model,
    previous_response_id: pending.responseId,

    input: [
      {
        type: "function_call_output",
        call_id: pending.callId,
        output: JSON.stringify({
          status: "rejected",
          message: "The manager rejected this proposed action.",
        }),
      },
    ],

    tools: restaurantTools,
  });

  return runAgentLoop(response, model);
}

export async function editAndApproveTask(
  pending: PendingApproval,
  editedArguments: {
    title: string;
    quantity: number | null;
    unit: string | null;
  }
): Promise<RestaurantAgentResult> {
  const model = process.env.OPENAI_MODEL;

  if (!model) {
    throw new Error("OpenAI model not configured");
  }

  if (!editedArguments.title.trim()) {
    throw new Error("Task title is required");
  }

  const createdTask = createTask({
    title: editedArguments.title,
    quantity: editedArguments.quantity ?? undefined,
    unit: editedArguments.unit ?? undefined,
  });

  const response = await client.responses.create({
    model,
    previous_response_id: pending.responseId,

    input: [
      {
        type: "function_call_output",
        call_id: pending.callId,
        output: JSON.stringify({
          status: "approved_after_edit",
          originalProposal: pending.arguments,
          executedTask: createdTask,
        }),
      },
    ],

    tools: restaurantTools,
  });

  return runAgentLoop(response, model);
}

async function runAgentLoop(
  response: OpenAI.Responses.Response,
  model: string
): Promise<RestaurantAgentResult> {
  const MAX_STEPS = 5;

  for (let step = 0; step < MAX_STEPS; step++) {
    const functionCalls = response.output.filter(
      item => item.type === "function_call"
    );

    if (functionCalls.length === 0) {
      return {
        type: "completed",
        response,
      };
    }

    const toolOutputs = [];

    for (const call of functionCalls) {
      const args = JSON.parse(call.arguments);

      if (call.name === "create_task") {
        return {
          type: "pending_approval",
          responseId: response.id,
          callId: call.call_id,
          toolName: "create_task",
          arguments: args,
        };
      }

      console.log(
        `Executing tool: ${call.name}`,
        args
      );

      const result = executeTool(
        call.name,
        args
      );

      console.log("Tool Result:", result);

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

  throw new Error(
    `Agent exceeded maximum step limit of ${MAX_STEPS}`
  );
}