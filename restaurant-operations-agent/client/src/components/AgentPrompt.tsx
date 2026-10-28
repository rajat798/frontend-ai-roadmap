import { useState } from "react";

type AgentPromptProps = {
  onSubmit: (
    message: string
  ) => Promise<void>;

  isLoading: boolean;
};

export function AgentPrompt({
  onSubmit,
  isLoading,
}: AgentPromptProps) {
  const [message, setMessage] =
    useState(
      "Are we ready for tonight's dinner rush? Check the forecast and chicken inventory. If there is a shortage, propose a task."
    );

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const trimmed =
      message.trim();

    if (!trimmed) {
      return;
    }

    await onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="agent-message">
        Ask the operations agent
      </label>

      <textarea
        id="agent-message"
        value={message}
        onChange={event =>
          setMessage(
            event.target.value
          )
        }
        rows={5}
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={
          isLoading ||
          !message.trim()
        }
      >
        {isLoading
          ? "Running..."
          : "Run Agent"}
      </button>
    </form>
  );
}