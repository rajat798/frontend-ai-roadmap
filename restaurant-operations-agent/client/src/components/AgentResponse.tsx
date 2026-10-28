type AgentResponseProps = {
  message: string;
};

export function AgentResponse({
  message,
}: AgentResponseProps) {
  return (
    <section>
      <h2>Agent Response</h2>

      <p
        style={{
          whiteSpace: "pre-wrap",
        }}
      >
        {message}
      </p>
    </section>
  );
}