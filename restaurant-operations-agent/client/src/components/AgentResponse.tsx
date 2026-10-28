import Markdown from "react-markdown";
export function AgentResponse({ message }: { message: string }) {
  return (
    <section className="panel response" aria-labelledby="response-title">
      <p className="eyebrow">Operations brief</p>
      <h2 id="response-title">Your readiness report</h2>
      <div className="markdown">
        <Markdown skipHtml disallowedElements={["img"]}>
          {message}
        </Markdown>
      </div>
    </section>
  );
}
