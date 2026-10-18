import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ticketSchema = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: ["billing", "bug", "account", "other"],
    },
    priority: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
    summary: {
      type: "string",
    },
    needsHuman: {
      type: "boolean",
    },
  },
  required: [
    "category",
    "priority",
    "summary",
    "needsHuman",
  ],
  additionalProperties: false,
};

async function extractTicket(ticketText) {
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL,

    instructions: [
      "Extract a support-ticket classification.",
      "Use only the supplied ticket text.",
      "Set needsHuman=true for ambiguous or risky cases.",
    ].join(" "),

    input: ticketText,

    text: {
      format: {
        type: "json_schema",
        name: "support_ticket",
        strict: true,
        schema: ticketSchema,
      },
    },
  });

  return JSON.parse(response.output_text);
}

async function main() {
  const ticketText = process.argv.slice(2).join(" ").trim();

  if (!ticketText) {
    console.error(
      'Usage: node index.mjs "Describe the support issue here"'
    );
    process.exitCode = 1;
    return;
  }

  try {
    const ticket = await extractTicket(ticketText);

    console.log("\nStructured ticket:");
    console.log(JSON.stringify(ticket, null, 2));
  } catch (error) {
    console.error("\nSomething went wrong:");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error");
    }

    process.exitCode = 1;
  }
}

main();