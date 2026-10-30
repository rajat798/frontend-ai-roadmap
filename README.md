# Frontend + AI Engineering Roadmap

I’m a frontend engineer exploring what happens when strong product engineering, React architecture, and modern AI application patterns come together.

This repository documents that journey — from small focused experiments to complete, deployed AI-native applications.

The goal isn’t to collect framework names.

It’s to learn how to build AI features that are **useful, understandable, and safe enough to put in front of real users**.

---

## 🚀 Flagship Project

### Restaurant Operations Agent

A deployed React + TypeScript AI application that helps a restaurant manager answer a simple operational question:

> **“Are we ready for tonight’s dinner rush?”**

Rather than letting an LLM invent restaurant state, the application grounds its reasoning in deterministic tools for forecasting, inventory, shortages, and operational actions.

And when the model wants to change something?

A human stays in control.

**Live Demo:**  
https://frontend-ai-roadmap.vercel.app/

**Project README:**  
[restaurant-operations-agent](./restaurant-operations-agent/README.md)

![Restaurant Operations Agent demo](restaurant-operations-agent/docs/media/demo.gif)

---

## 🏗️ How the System Fits Together

![Restaurant Operations Agent architecture](restaurant-operations-agent/docs/media/restaurant_operations_agent_architecture.png)

The system deliberately separates:

- the React product experience
- the Node/Express application boundary
- LLM reasoning
- deterministic restaurant tools
- human approval
- state-changing execution

The model can reason and propose.

The application remains responsible for trusted business logic and execution.

---

## 🍗 A Small Example

Imagine the restaurant needs **30 kg of chicken**, but only **18 kg** is available.

The system detects:

```text id="gj3n1f"
Required       30 kg
Available      18 kg
-------------------
Shortage       12 kg
```

The agent proposes:

> Procure 12 kg of chicken breast.

But it does **not** execute that action directly.

The manager can:

✅ Approve  
✏️ Edit + approve  
❌ Reject

If the manager changes the proposal from **12 kg → 10 kg**, the system executes the approved 10 kg task.

The agent then resumes with the real result and correctly reports:

> **2 kg is still unaddressed.**

That interaction is the core idea behind the project:

**AI can recommend.  
Application code validates.  
Humans decide.  
The system executes.**

---

## 🧠 What the Flagship Project Explores

- React + TypeScript AI UX
- LLM tool/function calling
- Deterministic business tools
- Bounded agent execution
- Human-in-the-loop workflows
- Approve / edit / reject patterns
- Structured execution events
- Runtime validation
- Server-side provider isolation
- Rate limiting
- Restricted CORS
- Responsive UI
- Automated tests
- Vercel + Render deployment

---

## 🧪 AI Labs

Before building the flagship project, I used smaller experiments to understand individual AI application concepts in isolation.

You can find them under:

```text id="cl92e0"
javascript-ai-labs/
```

These experiments cover areas such as:

- model API fundamentals
- tokens and context
- concurrent LLM requests
- Structured Outputs
- JSON Schema
- runtime validation
- tool calling
- multi-tool execution
- agent loops
- grounding
- deterministic vs probabilistic logic
- failure handling

The labs are intentionally smaller.

The flagship project is where those ideas are combined into a complete application.

---

## 🗺️ The Progression

```text id="f1kprp"
Small experiments
      ↓
Understand individual AI patterns
      ↓
Tool calling + deterministic tools
      ↓
Multi-step agent loop
      ↓
Human-in-the-loop actions
      ↓
React product experience
      ↓
Testing + safety boundaries
      ↓
Deployment
      ↓
Restaurant Operations Agent
```

---

## 📁 Repository Structure

```text id="duvj85"
frontend-ai-roadmap/
│
├── javascript-ai-labs/
│   └── focused AI engineering experiments
│
└── restaurant-operations-agent/
    ├── client/
    │   └── React + TypeScript
    │
    ├── server/
    │   └── Node.js + Express + agent orchestration
    │
    ├── docs/
    │   └── media/
    │
    └── README.md
```

---

## 🛠️ Current Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript

### AI

- OpenAI Responses API
- Tool/function calling
- Structured Outputs
- Bounded agent orchestration
- Human-in-the-loop execution

### Deployment

- Vercel
- Render

---

## 💡 Engineering Principles I’m Exploring

### 1. Ground before generating

If the application already knows a fact, the model should receive that fact instead of inventing it.

### 2. Keep business rules deterministic

Calculations, validation, permissions, and state mutation belong in application code.

The LLM is better used for:

- interpretation
- planning
- tool selection
- explanation

### 3. Separate proposal from execution

A model requesting a write operation is not the same as the application executing one.

That boundary matters.

### 4. Humans remain part of high-impact workflows

For trusted operations:

```text id="mflc55"
AI proposal
    ↓
Human review
    ↓
Application validation
    ↓
Execution
```

### 5. Build the simplest architecture that solves the problem

This project intentionally does **not** add technologies such as LangGraph, RAG, MCP, or multi-agent orchestration unless the product actually needs them.

The architecture should follow the problem — not the other way around.

---

## 🎯 Current Direction

My background is primarily in frontend engineering, React, TypeScript, UI architecture, and product development.

I’m extending that experience into **AI-native product engineering** — building applications where AI is part of the product architecture rather than a separate chatbot bolted onto the UI.

The focus remains practical:

> **Frontend engineering + product thinking + reliable AI application design.**