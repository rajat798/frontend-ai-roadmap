export type TaskArguments = {
  title: string;
  quantity: number | null;
  unit: string | null;
};

export type PendingApproval = {
  approvalId: string;
  toolName: "create_task";
  arguments: TaskArguments;
};

export type CompletedAgentResponse = {
  status: "completed";
  events: ExecutionEvent[];
  message: string;
};

export type PendingApprovalResponse = {
  status: "pending_approval";
  events: ExecutionEvent[];
  approval: PendingApproval;
};

export type AgentResponse = CompletedAgentResponse | PendingApprovalResponse;
export type ExecutionEvent = {
  id: string;
  type:
    | "tool_started"
    | "tool_completed"
    | "approval_required"
    | "decision"
    | "completed"
    | "error";
  timestamp: string;
  label: string;
  tool?: string;
  data?: unknown;
};
