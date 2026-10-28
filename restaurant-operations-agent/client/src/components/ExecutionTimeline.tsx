import type { ExecutionEvent } from "../types/agent";
export function ExecutionTimeline({
  events,
  busy,
}: {
  events: ExecutionEvent[];
  busy: boolean;
}) {
  return (
    <section className="panel timeline" aria-labelledby="timeline-title">
      <p className="eyebrow">Execution log</p>
      <h2 id="timeline-title">From evidence to action</h2>
      <p className="muted">Events appear after each request completes.</p>
      {events.length ? (
        <ol>
          {events.map((event) => (
            <li key={event.id}>
              <span className={`event-dot ${event.type}`} aria-hidden="true" />
              <div>
                <strong>{event.label}</strong>
                <time dateTime={event.timestamp}>
                  {new Date(event.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </time>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="empty">
          Run a check to see the agent’s tool activity and approval decisions.
        </p>
      )}
      <p role="status" className="muted">
        {busy
          ? "Working on your request…"
          : events.length
            ? "Latest request finished."
            : "Ready when you are."}
      </p>
    </section>
  );
}

export function EvidenceSummary({ events }: { events: ExecutionEvent[] }) {
  // Read only explicit tool results, never model prose or proposed task quantities.
  const completed = events.filter((e) => e.type === "tool_completed");
  const forecast = completed.findLast((e) => e.tool === "get_forecast")
    ?.data as
    { expectedCovers?: number; confidence?: number; date?: string } | undefined;
  const inventory = completed.findLast((e) => e.tool === "check_inventory")
    ?.data as
    | {
        name?: string;
        available?: number;
        required?: number;
        shortage?: number;
        unit?: string;
      }
    | undefined;
  return (
    <section className="summary" aria-label="Verified tool evidence">
      <article>
        <p>Forecast covers</p>
        <strong>{forecast?.expectedCovers ?? "—"}</strong>
        <small>
          {forecast
            ? `${Math.round((forecast.confidence ?? 0) * 100)}% confidence · ${forecast.date}`
            : "Awaiting forecast check"}
        </small>
      </article>
      <article>
        <p>{inventory?.name ?? "Inventory"}</p>
        <strong>
          {inventory ? `${inventory.available} ${inventory.unit}` : "—"}
        </strong>
        <small>
          {inventory
            ? `${inventory.required} ${inventory.unit} required`
            : "Awaiting inventory check"}
        </small>
      </article>
      <article>
        <p>Inventory shortage</p>
        <strong>
          {inventory ? `${inventory.shortage} ${inventory.unit}` : "—"}
        </strong>
        <small>Task creation does not replenish stock</small>
      </article>
    </section>
  );
}
