const express = require("express");

const { bootstrap } = require("../brain/bootstrap");
const { orchestrate } = require("../brain/core/orchestrator");

// 🧠 IO SELF-POLICING LAYER
const IOGuardian = require("../brain/core/ioGuardian");

const app = express();

app.use(express.json());

/**
 * ==========================================
 * BOOTSTRAP DEL KERNEL
 * ==========================================
 */

const boot = bootstrap();

if (!boot || !boot.ok) {
  console.error("[BOOTSTRAP FAILED]", boot?.error || "unknown_error");
  process.exit(1);
}

/**
 * 🧠 IO GUARDIAN INIT (SELF-POLICING LAYER)
 */

const ioGuardian = new IOGuardian({
  eventBus: boot.eventBus,
  memory: boot.memory
});

// 🔍 Optional: scan inicial del kernel (no bloqueante)
try {
  ioGuardian.scanSource("./brain");
} catch (err) {
  console.warn("[IO_GUARDIAN_SCAN_WARN]", err.message);
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
 * KERNEL ENTRY ROUTE (EJECUCIÓN)
 * ==========================================
 */

app.post("/intent", async (req, res) => {
  const trace = [];

  try {
    const intent = req.body?.intent;

    trace.push({ stage: "input", intent });

    const result = await orchestrate({
      intent,
      context: {
        source: "api/server"
      }
    });

    trace.push({ stage: "result", result });

    return res.json({
      ok: true,
      result,
      trace
    });

  } catch (err) {
    try {
      console.error(
        "[KERNEL_ERROR]",
        err?.message || err
      );
    } catch (e) {}

    return res.status(500).json({
      ok: false,
      error: "runtime_error",
      message: err?.message || "unknown_error",
      trace
    });
  }
});

/**
 * ==========================================
 * START SERVER
 * ==========================================
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[GoUP Kernel] running on port ${PORT}`);
});
