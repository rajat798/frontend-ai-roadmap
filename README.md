# Frontend + AI Engineering Roadmap

A hands-on repository documenting my progression from focused LLM application experiments to production-style AI-native frontend applications.

My background is primarily in frontend engineering with React and TypeScript. This repository explores how those skills extend into AI product engineering through tool calling, structured outputs, agent workflows, human-in-the-loop UX, and reliable application boundaries.

## Flagship Project

### Restaurant Operations Agent

A deployed React + TypeScript AI operations application that combines deterministic restaurant data with LLM tool calling and human approval for state-changing actions.

**[Live Demo](https://frontend-ai-roadmap.vercel.app/)**

**[Project Documentation](./restaurant-operations-agent/README.md)**

Key concepts demonstrated:

- LLM tool/function calling
- Deterministic business tools
- Bounded multi-step agent execution
- Human-in-the-loop approval
- Approve / edit / reject workflows
- Structured execution events
- React AI UX
- Provider isolation behind a Node/Express API
- Runtime validation
- Responsive UI
- Rate limiting and restricted CORS

## AI Labs

`javascript-ai-labs/` contains smaller experiments used to learn and validate individual AI application concepts before applying them in the flagship project.

Topics include:

- LLM API fundamentals
- Concurrent model requests
- Structured Outputs
- Tool calling
- Agent loops
- Runtime validation
- Grounding
- AI application reliability patterns

## Repository Structure

```text
frontend-ai-roadmap/
├── javascript-ai-labs/
│   └── focused AI experiments
│
└── restaurant-operations-agent/
    ├── client/
    ├── server/
    ├── docs/
    └── README.md