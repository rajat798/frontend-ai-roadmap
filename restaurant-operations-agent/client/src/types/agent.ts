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
  message: string;
};

export type PendingApprovalResponse = {
  status: "pending_approval";
  approval: PendingApproval;
};

export type AgentResponse =
  | CompletedAgentResponse
  | PendingApprovalResponse;