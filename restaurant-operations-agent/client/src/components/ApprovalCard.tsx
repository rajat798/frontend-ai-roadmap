import { useState } from "react";

import type {
  PendingApproval,
  TaskArguments,
} from "../types/agent";

type ApprovalCardProps = {
  approval: PendingApproval;
  isLoading: boolean;

  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;

  onEditAndApprove: (
    arguments_: TaskArguments
  ) => Promise<void>;
};

export function ApprovalCard({
  approval,
  isLoading,
  onApprove,
  onReject,
  onEditAndApprove,
}: ApprovalCardProps) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [title, setTitle] = useState(
    approval.arguments.title
  );

  const [quantity, setQuantity] = useState(
    approval.arguments.quantity?.toString() ?? ""
  );

  const [unit, setUnit] = useState(
    approval.arguments.unit ?? ""
  );

  async function handleSaveAndApprove() {
    const parsedQuantity =
      quantity.trim() === ""
        ? null
        : Number(quantity);

    if (
      parsedQuantity !== null &&
      Number.isNaN(parsedQuantity)
    ) {
      return;
    }

    await onEditAndApprove({
      title: title.trim(),
      quantity: parsedQuantity,
      unit:
        unit.trim() === ""
          ? null
          : unit.trim(),
    });
  }

  return (
    <section>
      <h2>Approval Required</h2>

      <p>
        The agent wants to execute:
        <strong> {approval.toolName}</strong>
      </p>

      {!isEditing ? (
        <>
          <dl>
            <dt>Task</dt>
            <dd>{approval.arguments.title}</dd>

            <dt>Quantity</dt>
            <dd>
              {approval.arguments.quantity ??
                "Not specified"}
            </dd>

            <dt>Unit</dt>
            <dd>
              {approval.arguments.unit ??
                "Not specified"}
            </dd>
          </dl>

          <div>
            <button
              type="button"
              disabled={isLoading}
              onClick={onApprove}
            >
              Approve
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <button
              type="button"
              disabled={isLoading}
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
              value={title}
              onChange={event =>
                setTitle(event.target.value)
              }
            />
          </label>

          <label>
            Quantity
            <input
              type="number"
              value={quantity}
              onChange={event =>
                setQuantity(event.target.value)
              }
            />
          </label>

          <label>
            Unit
            <input
              value={unit}
              onChange={event =>
                setUnit(event.target.value)
              }
            />
          </label>

          <div>
            <button
              type="button"
              disabled={
                isLoading ||
                !title.trim()
              }
              onClick={
                handleSaveAndApprove
              }
            >
              Save & Approve
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                setIsEditing(false)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}