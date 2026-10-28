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

// A transport-independent event log. A future SSE sink can subscribe here.
export function recordEvent(
  events: ExecutionEvent[],
  type: ExecutionEvent["type"],
  label: string,
  tool?: string,
  data?: unknown,
) {
  const event: ExecutionEvent = {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    label,
    tool,
    data,
  };
  events.push(event);
  return event;
}
