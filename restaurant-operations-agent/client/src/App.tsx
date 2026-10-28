import {
  ExecutionTimeline,
  EvidenceSummary,
} from "./components/ExecutionTimeline";
import "./App.css";
import { useState } from "react";

import {
  runAgent,
  approveAction,
  rejectAction,
  editAndApproveAction,
} from "./api/agentApi";

import { AgentPrompt } from "./components/AgentPrompt";

import { ApprovalCard } from "./components/ApprovalCard";

import { AgentResponse } from "./components/AgentResponse";

import type {
  AgentResponse as AgentResponseType,
  PendingApproval,
  TaskArguments,
  ExecutionEvent,
} from "./types/agent";

function App() {
  const [result, setResult] = useState<AgentResponseType | null>(null);

  const [failureEvents, setFailureEvents] = useState<ExecutionEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function execute(operation: () => Promise<AgentResponseType>) {
    try {
      setIsLoading(true);
      setError(null);
      setFailureEvents([]);

      const response = await operation();

      setResult(response);
    } catch (error) {
      setFailureEvents([
        {
          id: crypto.randomUUID(),
          type: "error",
          timestamp: new Date().toISOString(),
          label: "Request failed. Review the error before continuing.",
        },
      ]);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRun(message: string) {
    setResult(null);

    await execute(() => runAgent(message));
  }

  async function handleApprove(approval: PendingApproval) {
    await execute(() => approveAction(approval.approvalId));
  }

  async function handleReject(approval: PendingApproval) {
    await execute(() => rejectAction(approval.approvalId));
  }

  async function handleEditAndApprove(
    approval: PendingApproval,
    arguments_: TaskArguments,
  ) {
    await execute(() => editAndApproveAction(approval.approvalId, arguments_));
  }

  return (
    <main>
      <header>
        <a className="brand" href="#">
          RO / Operations desk
        </a>
        <span className="badge">Demo workspace · Human approval</span>
      </header>
      <div className="hero-copy">
        <p className="eyebrow">Service readiness, with oversight</p>
        <h1>Restaurant Operations Agent</h1>

        <p>
          Check operational readiness and review AI-proposed actions before
          execution.
        </p>
      </div>
      <EvidenceSummary events={result?.events ?? []} />
      <div className="workspace">
        <div className="primary-column">
          <AgentPrompt
            onSubmit={handleRun}
            isLoading={isLoading || result?.status === "pending_approval"}
          />

          {isLoading && <p>Agent is working...</p>}

          {error && <p role="alert">{error}</p>}

          {result?.status === "pending_approval" && (
            <ApprovalCard
              key={result.approval.approvalId}
              approval={result.approval}
              isLoading={isLoading}
              onApprove={() => handleApprove(result.approval)}
              onReject={() => handleReject(result.approval)}
              onEditAndApprove={(args) =>
                handleEditAndApprove(result.approval, args)
              }
            />
          )}

          {result?.status === "completed" && (
            <AgentResponse message={result.message} />
          )}
        </div>
        <ExecutionTimeline
          events={[...(result?.events ?? []), ...failureEvents]}
          busy={isLoading}
        />
      </div>
      <footer>
        Evidence first. Manager controlled actions. Built for the dinner rush.
      </footer>
    </main>
  );
}

export default App;
