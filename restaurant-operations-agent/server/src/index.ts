import "dotenv/config";

import express from "express";
import cors from "cors";

import {
  askRestaurantAgent,
  approveTask,
  rejectTask,
  editAndApproveTask,
  type RestaurantAgentResult,
} from "./ai/restaurantAgent";

import {
  savePendingApproval,
  getPendingApproval,
  removePendingApproval,
} from "./approvals/pendingApprovalStore";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 3001;

function serializeAgentResult(result: RestaurantAgentResult) {
  if (result.type === "completed") {
    return {
      status: "completed" as const,
      message: result.response.output_text,
      events: result.events,
    };
  }

  const approvalId = savePendingApproval(result);

  return {
    status: "pending_approval" as const,
    events: result.events,

    approval: {
      approvalId,
      toolName: result.toolName,
      arguments: result.arguments,
    },
  };
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.post("/api/agent/run", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        error: "message is required",
      });

      return;
    }

    const result = await askRestaurantAgent(message.trim());

    res.json(serializeAgentResult(result));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Agent execution failed",
    });
  }
});

app.post("/api/approvals/:approvalId/approve", async (req, res) => {
  try {
    const { approvalId } = req.params;

    const stored = getPendingApproval(approvalId);

    if (!stored) {
      res.status(404).json({
        error: "Approval not found",
      });

      return;
    }

    const result = await approveTask(stored.pending);

    removePendingApproval(approvalId);

    res.json(serializeAgentResult(result));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Approval failed",
    });
  }
});

app.post("/api/approvals/:approvalId/reject", async (req, res) => {
  try {
    const { approvalId } = req.params;

    const stored = getPendingApproval(approvalId);

    if (!stored) {
      res.status(404).json({
        error: "Approval not found",
      });

      return;
    }

    const result = await rejectTask(stored.pending);

    removePendingApproval(approvalId);

    res.json(serializeAgentResult(result));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Rejection failed",
    });
  }
});

app.post("/api/approvals/:approvalId/edit", async (req, res) => {
  try {
    const { approvalId } = req.params;

    const stored = getPendingApproval(approvalId);

    if (!stored) {
      res.status(404).json({
        error: "Approval not found",
      });

      return;
    }

    const { title, quantity, unit } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        error: "Valid title is required",
      });

      return;
    }

    if (
      quantity !== null &&
      (typeof quantity !== "number" ||
        !Number.isFinite(quantity) ||
        quantity <= 0)
    ) {
      res
        .status(400)
        .json({ error: "Quantity must be a positive number or null" });
      return;
    }
    const result = await editAndApproveTask(stored.pending, {
      title: title.trim(),

      quantity: typeof quantity === "number" ? quantity : null,

      unit: typeof unit === "string" ? unit : null,
    });

    removePendingApproval(approvalId);

    res.json(serializeAgentResult(result));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Edit and approval failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Restaurant Operations API running on http://localhost:${PORT}`);
});
