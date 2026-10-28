import type {
  AgentResponse,
  TaskArguments
} from "../types/agent";

const API_URL = "http://localhost:3001";

async function handleResponse(
  response: Response
): Promise<AgentResponse> {
  if (!response.ok) {
    const data = await response
      .json()
      .catch(() => null);

    throw new Error(
      data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return response.json();
}

export async function runAgent(
  message: string
): Promise<AgentResponse> {
  const response = await fetch(
    `${API_URL}/api/agent/run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  return handleResponse(response);
}

export async function approveAction(
  approvalId: string
): Promise<AgentResponse> {
  const response = await fetch(
    `${API_URL}/api/approvals/${approvalId}/approve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse(response);
}

export async function rejectAction(
  approvalId: string
): Promise<AgentResponse> {
  const response = await fetch(
    `${API_URL}/api/approvals/${approvalId}/reject`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse(response);
}

export async function editAndApproveAction(
  approvalId: string,
  arguments_: TaskArguments
): Promise<AgentResponse> {
  const response = await fetch(
    `${API_URL}/api/approvals/${approvalId}/edit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arguments_),
    }
  );

  return handleResponse(response);
}