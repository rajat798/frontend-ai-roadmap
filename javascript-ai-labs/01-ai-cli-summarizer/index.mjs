import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarize(text) {
  const response = await client.responses.create({
    model: "gpt-6-luna",
    instructions:
      "Summarize the supplied text in at most three concise bullet points.",
    input: text,
  });

  return response.output_text;
}

async function main() {
  const text = process.argv
    .slice(2)
    .join(" ")
    .trim();

  if (!text) {
    console.error(
      'Usage: node index.mjs "Text to summarize"'
    );

    process.exitCode = 1;
    return;
  }

  try {
    const summary = await summarize(text);

    console.log("\nSummary:\n");
    console.log(summary);
  } catch (error) {
    console.error("\nSomething went wrong:");
    console.error(error.message);

    process.exitCode = 1;
  }
}

main();