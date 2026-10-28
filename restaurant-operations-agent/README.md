# Restaurant Operations Agent

A React + TypeScript operations desk that checks restaurant evidence and pauses for manager approval before creating tasks.

## Run locally

Use Node.js 22 or newer. In two terminals:

```sh
cd server
npm ci
# Create .env with OPENAI_API_KEY and OPENAI_MODEL (a Responses API tool-capable model).
npm run dev
```

```sh
cd client
npm ci
npm run dev
```

Open the Vite URL printed in the client terminal. API defaults to http://localhost:3001. Set `VITE_API_URL` in client/.env for another API origin; `PORT` configures the server. Never put provider credentials in Vite variables.

## Architecture

React → Express app DTOs → bounded Responses API tool loop → forecast/inventory/recipe tools. A create_task call pauses the loop and stores its provider continuation server-side. Approve, reject, or edit+approve sends the actual outcome back to the model. React receives only an opaque app approval ID, proposed arguments, domain events, and final Markdown.

The responsive UI includes a prompt, tool-backed forecast/inventory/shortage cards, an editable approval card, Markdown reports, loading/error states, and a timestamped execution timeline. Summary cards use structured tool results; no model text is parsed. Inventory shortage is a stock measurement: creating an open task does not replenish it.

Events (`tool_started`, `tool_completed`, `approval_required`, `decision`, `completed`, `error`) form a transport-independent log. Server events travel with each JSON result; client request failures add a local error event. This milestone deliberately uses a non-streaming timeline. Future SSE can emit the same event DTOs as they occur, with run IDs, cancellation, reconnection and durable history added first.

## HITL trust boundary

Read tools execute automatically. Task creation occurs only on the server after manager approval. Edited title/quantity are validated. Provider response/call IDs and API keys stay server-side; app event IDs and approval IDs are opaque application identifiers. Raw model HTML and images are disabled in Markdown rendering.

## Validation

```sh
cd client
npm run build
npm run lint
npm test
cd ../server
npm run typecheck
npm run build
npm test
```

Browser acceptance: run the default prompt; verify evidence and pending approval. Approve 12 kg → open task; reject → no task; edit to 10 kg → open 10 kg task and report describing the remaining 2 kg of the proposed requirement. Also check loading, invalid quantities, API errors, keyboard focus, and a narrow viewport. Automated tests exercise domain evidence/events and client Markdown/summary/timeline rendering; live provider integration requires credentials and incurs API usage.

## Current limitations

Fixtures include a fixed forecast date and are demo data. Tasks and pending approvals live in process memory: restarting loses them. There is no authentication, authorization, expiration, durable audit history, or concurrency/idempotency protection. An approval followed by a provider failure can leave a created task without a final report; do not retry approval blindly. The tool loop is bounded to five steps; parallel write proposals and durable recovery are not supported. API CORS is permissive for local development. No RAG, LangGraph, MCP, or multi-agent orchestration is added by this milestone.

## Demo media

- [ ] Add desktop readiness screenshot to docs/screenshots/readiness.png
- [ ] Add mobile approval screenshot to docs/screenshots/approval-mobile.png
- [ ] Add GIF showing approve, reject, and edit+approve to docs/screenshots/hitl.gif

## Deployment checklist

1. Add durable approval/task storage, atomic claim/idempotency, recovery after provider errors, authentication, authorization, expiry, and rate limits before exposing writes publicly.
2. Choose hosting for the Express Node service and Vite static build. Set server secrets and model, client VITE_API_URL, restricted CORS, and HTTPS. Build both packages; run server with npm start.
3. Run the three approval acceptance paths on staging, check narrow layouts and errors, then capture screenshots/GIF. No deployment target is currently configured.
4. Add the repository and live demo links to your portfolio. Describe the evidence → proposal → manager decision → executed outcome flow and its trust boundary.
5. Resume bullet: “Built a React/TypeScript restaurant operations agent with tool-grounded reports, structured execution events, and manager approval/edit/reject controls for task creation.” Add measured results only after collecting them.
