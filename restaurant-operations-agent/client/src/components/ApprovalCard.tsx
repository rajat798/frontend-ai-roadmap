import { useState } from "react";

import type { PendingApproval, TaskArguments } from "../types/agent";

type ApprovalCardProps = {
  approval: PendingApproval;
  isLoading: boolean;

  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;

  onEditAndApprove: (arguments_: TaskArguments) => Promise<void>;
};

export function ApprovalCard({
  approval,
  isLoading,
  onApprove,
  onReject,
  onEditAndApprove,
}: ApprovalCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(approval.arguments.title);

  const [quantity, setQuantity] = useState(
    approval.arguments.quantity?.toString() ?? "",
  );

  const [unit, setUnit] = useState(approval.arguments.unit ?? "");

  async function handleSaveAndApprove() {
    const parsedQuantity = quantity.trim() === "" ? null : Number(quantity);

    if (
      parsedQuantity !== null &&
      (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0)
    ) {
      return;
    }

    await onEditAndApprove({
      title: title.trim(),
      quantity: parsedQuantity,
      unit: unit.trim() === "" ? null : unit.trim(),
    });
  }

  return (
    <section className="panel approval" aria-labelledby="approval-title">
      <p className="eyebrow">02 / Manager decision</p>
      <h2 id="approval-title">Review proposed task</h2>

      <p>
        No task has been created yet. Approve, adjust, or reject this proposal.
      </p>

      {!isEditing ? (
        <>
          <dl>
            <dt>Task</dt>
            <dd>{approval.arguments.title}</dd>

            <dt>Quantity</dt>
            <dd>{approval.arguments.quantity ?? "Not specified"}</dd>

            <dt>Unit</dt>
            <dd>{approval.arguments.unit ?? "Not specified"}</dd>
          </dl>

          <div className="actions">
            <button type="button" disabled={isLoading} onClick={onApprove}>
              Approve
            </button>

            <button
              type="button"
              disabled={isLoading}
              className="secondary"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <button
              type="button"
              disabled={isLoading}
              className="danger"
              onClick={onReject}
            >
              Reject
            </button>
          </div>
        </>
      ) : (
        <div>
          <label>
            Task
            <input
              disabled={isLoading}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            Quantity
            <input
              type="number"
              min="0.01"
              step="any"
              disabled={isLoading}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>

          <label>
            Unit
            <input
              disabled={isLoading}
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
            />
          </label>

          <div className="actions">
            <button
              type="button"
              disabled={
                isLoading ||
                !title.trim() ||
                (quantity.trim() !== "" &&
                  (!Number.isFinite(Number(quantity)) || Number(quantity) <= 0))
              }
              onClick={handleSaveAndApprove}
            >
              Save & Approve
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
