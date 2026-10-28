/// <reference types="node" />
import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentResponse } from "../components/AgentResponse";
import {
  EvidenceSummary,
  ExecutionTimeline,
} from "../components/ExecutionTimeline";
import type { ExecutionEvent } from "../types/agent";

test("model markdown formats emphasis and excludes raw HTML/images", () => {
  const html = renderToStaticMarkup(
    <AgentResponse
      message={
        "**12 kg** shortage\n\n<script>alert(1)</script>\n\n![tracking](https://example.com/pixel.png)"
      }
    />,
  );
  assert.match(html, /<strong>12 kg<\/strong>/);
  assert.doesNotMatch(html, /<script|<img/);
});
test("summary uses tool evidence, not task quantities", () => {
  const events: ExecutionEvent[] = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      type: "tool_completed",
      label: "Inventory",
      tool: "check_inventory",
      data: {
        name: "Chicken",
        available: 18,
        required: 30,
        shortage: 12,
        unit: "kg",
      },
    },
    {
      id: "2",
      timestamp: new Date().toISOString(),
      type: "tool_completed",
      label: "Created",
      tool: "create_task",
      data: { quantity: 10, unit: "kg" },
    },
  ];
  const html = renderToStaticMarkup(<EvidenceSummary events={events} />);
  assert.match(html, /12 kg/);
  assert.match(html, /18 kg/);
  assert.doesNotMatch(html, /10 kg/);
});
test("timeline includes errors and pending requests have an accessible status", () => {
  const html = renderToStaticMarkup(
    <ExecutionTimeline
      busy
      events={[
        {
          id: "1",
          type: "error",
          timestamp: new Date().toISOString(),
          label: "Request failed",
        },
      ]}
    />,
  );
  assert.match(html, /Request failed/);
  assert.match(html, /role="status"/);
  assert.match(html, /Working on your request/);
});
