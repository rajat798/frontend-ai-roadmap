```md
# Structured Support Ticket Extractor

A small AI engineering lab that converts free-form support tickets into structured, machine-readable data using the OpenAI Responses API and JSON Schema.

## What This Project Demonstrates

This project focuses on using an LLM as a structured application component instead of treating it only as a text generator.

The model extracts:

- `category`
- `priority`
- `summary`
- `needsHuman`

Example output:

```json
{
  "category": "billing",
  "priority": "high",
  "summary": "Customer reports a duplicate subscription charge.",
  "needsHuman": true
}
```

## AI Concepts Practiced

- LLM inference
- Structured Outputs
- JSON Schema
- Strict schema adherence
- Enums for controlled model outputs
- Prompt instructions vs user input
- Runtime parsing of model responses
- Schema correctness vs business correctness
- AI failure handling
- Model output as an application contract

## JavaScript Concepts Practiced

- `async` / `await`
- `try` / `catch`
- Environment variables
- ES modules
- CLI arguments with `process.argv`
- `JSON.parse`
- `JSON.stringify`

## Why Structured Outputs Matter

Free-form model responses are easy for humans to understand but harder for application code to consume reliably.

Instead of:

```text
"This looks urgent and seems related to billing."
```

the application receives a predictable structure:

```json
{
  "category": "billing",
  "priority": "high",
  "summary": "...",
  "needsHuman": true
}
```

This reduces fragile parsing logic and makes downstream application code easier to reason about.

## Important Engineering Lesson

Schema-valid output does not automatically mean the model's decision is correct.

A response may satisfy the JSON Schema while still containing an incorrect category or priority.

Production AI systems still need:

- validation
- testing
- evals
- observability
- human review for sensitive decisions

## Run Locally

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=your_model_here
```

Run:

```bash
node index.mjs "I was charged twice for my subscription and need help today."
```

## Security

Never commit the real `.env` file or API key.

Only `.env.example` should be tracked in Git.
```