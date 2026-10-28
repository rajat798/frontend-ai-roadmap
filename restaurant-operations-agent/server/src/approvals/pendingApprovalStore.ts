import type {
  PendingApproval,
} from "../ai/restaurantAgent";

type StoredApproval = {
  approvalId: string;
  pending: PendingApproval;
  createdAt: number;
};

const approvals =
  new Map<string, StoredApproval>();

export function savePendingApproval(
  pending: PendingApproval
) {
  const approvalId =
    crypto.randomUUID();

  approvals.set(approvalId, {
    approvalId,
    pending,
    createdAt: Date.now(),
  });

  console.log(
    "[approval-store] saved:",
    approvalId
  );

  console.log(
    "[approval-store] current:",
    [...approvals.keys()]
  );

  return approvalId;
}

export function getPendingApproval(
  approvalId: string
) {
  console.log(
    "[approval-store] looking for:",
    approvalId
  );

  console.log(
    "[approval-store] available:",
    [...approvals.keys()]
  );

  return approvals.get(approvalId) ?? null;
}

export function removePendingApproval(
  approvalId: string
) {
  console.log(
    "[approval-store] removing:",
    approvalId
  );

  approvals.delete(approvalId);
}