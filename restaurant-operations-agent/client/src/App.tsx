import { useState } from "react";

import {
  runAgent,
  approveAction,
  rejectAction,
  editAndApproveAction,
} from "./api/agentApi";

import {
  AgentPrompt,
} from "./components/AgentPrompt";

import {
  ApprovalCard,
} from "./components/ApprovalCard";

import {
  AgentResponse,
} from "./components/AgentResponse";

import type {
  AgentResponse as AgentResponseType,
  PendingApproval,
  TaskArguments,
} from "./types/agent";

function App() {
  const [result, setResult] =
    useState<AgentResponseType | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function execute(
    operation: () =>
      Promise<AgentResponseType>
  ) {
    try {
      setIsLoading(true);
      setError(null);

      const response =
        await operation();

      setResult(response);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRun(
    message: string
  ) {
    setResult(null);

    await execute(() =>
      runAgent(message)
    );
  }

  async function handleApprove(
    approval: PendingApproval
  ) {
    await execute(() =>
      approveAction(
        approval.approvalId
      )
    );
  }

  async function handleReject(
    approval: PendingApproval
  ) {
    await execute(() =>
      rejectAction(
        approval.approvalId
      )
    );
  }

  async function handleEditAndApprove(
    approval: PendingApproval,
    arguments_: TaskArguments
  ) {
    await execute(() =>
      editAndApproveAction(
        approval.approvalId,
        arguments_
      )
    );
  }

  return (
    <main>
      <h1>
        Restaurant Operations Agent
      </h1>

      <p>
        Check operational readiness and
        review AI-proposed actions before
        execution.
      </p>

      <AgentPrompt
        onSubmit={handleRun}
        isLoading={isLoading}
      />

      {isLoading && (
        <p>Agent is working...</p>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {result?.status ===
        "pending_approval" && (
        <ApprovalCard
          approval={
            result.approval
          }
          isLoading={isLoading}
          onApprove={() =>
            handleApprove(
              result.approval
            )
          }
          onReject={() =>
            handleReject(
              result.approval
            )
          }
          onEditAndApprove={args =>
            handleEditAndApprove(
              result.approval,
              args
            )
          }
        />
      )}

      {result?.status ===
        "completed" && (
        <AgentResponse
          message={result.message}
        />
      )}
    </main>
  );
}

export default App;