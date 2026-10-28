import { test } from "node:test";
import assert from "node:assert/strict";
import { checkInventory } from "../tools/checkInventory";
import { getForecast } from "../tools/getForecast";
import { createTask } from "../tools/createTask";
import { recordEvent, type ExecutionEvent } from "../ai/events";
import { tasks } from "../data/tasks";
test("inventory evidence remains unchanged by a restock task", () => {
  const before = checkInventory("chicken");
  assert.equal(before?.shortage, 12);
  assert.equal(before?.available, 18);
  const task = createTask({ title: "Restock", quantity: 10, unit: "kg" });
  assert.equal(task.quantity, 10);
  assert.equal(task.status, "open");
  assert.deepEqual(checkInventory("chicken"), before);
  tasks.splice(tasks.indexOf(task), 1);
});
test("unknown inventory is not fabricated", () =>
  assert.equal(checkInventory("missing"), null));
test("domain events retain structured evidence with app identifiers", () => {
  const events: ExecutionEvent[] = [];
  recordEvent(events, "tool_started", "Checking forecast", "get_forecast");
  recordEvent(
    events,
    "tool_completed",
    "Forecast checked",
    "get_forecast",
    getForecast(),
  );
  assert.equal(events.length, 2);
  assert.notEqual(events[0].id, events[1].id);
  assert.deepEqual(events[1].data, getForecast());
  assert.equal("responseId" in events[1], false);
});
