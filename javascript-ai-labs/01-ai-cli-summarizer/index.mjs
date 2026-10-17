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

async function summarizeBatch(texts) {
  return Promise.all(texts.map(text => summarize(text)));
}

async function summarizeBatchSettled(texts) {
  const results = await Promise.allSettled(texts.map(text => summarize(text)));

  return results.map((result, index) => {
    if(result.status === "fulfilled") {
      return {
        index,
        status: "success",
        summary: result.value
      }
    }
    return {
      index,
      status: "error",
      error: result.reason instanceof Error ? result.reason.message : "Unknown Error"
    }
  })
}

// async function main() {
//   const text = process.argv
//     .slice(2)
//     .join(" ")
//     .trim();

//   if (!text) {
//     console.error(
//       'Usage: node index.mjs "Text to summarize"'
//     );

//     process.exitCode = 1;
//     return;
//   }

//   try {
//     const summary = await summarize(text);

//     console.log("\nSummary:\n");
//     console.log(summary);
//   } catch (error) {
//     console.error("\nSomething went wrong:");
//     console.error(error.message);

//     process.exitCode = 1;
//   }
// }

async function main() {
  const texts = process.argv
    .slice(2)
    .map((text) => text.trim())
    .filter(Boolean);

  if (texts.length === 0) {
    console.error(
      'Usage: node index.mjs "Text one" "Text two" "Text three"'
    );
    process.exitCode = 1;
    return;
  }

  const results = await summarizeBatchSettled(texts);

  results.forEach((result) => {
    console.log(`\nInput ${result.index + 1}:`);

    if (result.status === "success") {
      console.log(result.summary);
    } else {
      console.error(`Failed: ${result.error}`);
    }
  });
}

main();

main();