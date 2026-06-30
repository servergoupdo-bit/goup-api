const eventBus = require("./core/eventBus");
const { attachEventBus } = require("./core/feedback");
const { initAgents } = require("./agents");
const { initLearningLoop } = require("./core/learningLoop");
const { trace } = require("./core/observability");
const registry = require("./plugins/registry");

// IO LAYERS
const IOGuardian = require("./core/ioGuardian");
const IOKernelGuardian = require("./core/ioKernelGuardian");
const { initIOGateway } = require("./core/ioGatewaySingleton");

let initialized = false;

function bootstrap() {
  if (initialized) return { ok: true, initialized: true };

  try {
    // =========================
    // PLUGINS
    // =========================
    registry.loadPlugins?.();
    trace("bootstrap.plugins", { status: "loaded" });

    // =========================
    // EVENT BUS
    // =========================
    attachEventBus(eventBus);
    trace("bootstrap.feedback", { status: "attached" });

    // =========================
    // IO GUARDIAN (observabilidad)
    // =========================
    const ioGuardian = new IOGuardian({
      eventBus,
      memory: require("./core/memoryStore"),
      mode: "observe"
    });

    ioGuardian.scanSourceTree("./brain");
    trace("bootstrap.ioGuardian", { status: "initialized" });

    // =========================
    // IO KERNEL GUARDIAN (ENFORCEMENT)
    // =========================
    const ioKernelGuardian = new IOKernelGuardian({
      eventBus,
      mode: "observe"
    });

    ioKernelGuardian.scanSourceTree("./brain");

    trace("bootstrap.ioKernelGuardian", { status: "scan_complete" });

    // =========================
    // IO GATEWAY (SINGLETON AUTHORITY)
    // =========================
    initIOGateway({
      policyEngine: require("./core/policyEngine"),
      eventBus,
      memory: require("./core/memoryStore")
    });

    trace("bootstrap.ioGateway", { status: "initialized" });

    // =========================
    // LEARNING LOOP
    // =========================
    initLearningLoop?.();
    trace("bootstrap.learningLoop", { status: "initialized" });

    // =========================
    // AGENTS
    // =========================
    initAgents(eventBus);
    trace("bootstrap.agents", { status: "initialized" });

    initialized = true;

    trace("bootstrap.complete", { status: "ok" });

    console.log("✅ Bootstrap initialized");

    return { ok: true, initialized: true };

  } catch (err) {
    trace("bootstrap.error", { error: err.message });
    console.error("[BOOTSTRAP ERROR]", err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = { bootstrap };
