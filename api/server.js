const express = require("express");

const { bootstrap } = require("../brain/bootstrap");
const { orchestrate } = require("../brain/core/orchestrator");

const app = express();

app.use(express.json());

/**
 * ==========================================
 * BOOTSTRAP DEL KERNEL
 * ==========================================
 */

const boot = bootstrap();

if (!boot.ok) {
  console.error("[BOOTSTRAP FAILED]", boot.error);
  process.exit(1);
}

/**
 * ==========================================
 * HEALTH CHECK
 * ==========================================
 */

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    platform: "GoUP",
    kernel: "v2",
    uptime: process.uptime()
  });
});

/**
 * ==========================================
 * COMMAND ENDPOINT
 * ==========================================
 */

app.post("/command", async (req, res) => {

  const command = req.body?.command;

  if (typeof command !== "string" || command.trim() === "") {
    return res.status(400).json({
      success: false,
      error: "no_command_provided"
    });
  }

  try {

    const result = await orchestrate({
      intent: command,
      raw: command,
      traceId: Date.now().toString(36)
    });

    return res.json(result);

  } catch (err) {

    console.error("[COMMAND ERROR]", err);

    return res.status(500).json({
      success: false,
      error: "kernel_execution_failed",
      message: err.message
    });

  }

});

/**
 * ==========================================
 * GLOBAL ERROR HANDLER
 * ==========================================
 */

app.use((err, req, res, next) => {

  console.error("[UNHANDLED ERROR]", err);

  res.status(500).json({
    success: false,
    error: "unhandled_error",
    message: err.message
  });

});

/**
 * ==========================================
 * SERVER START
 * ==========================================
 */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 GoUP Platform listening on port ${PORT}`);
});
