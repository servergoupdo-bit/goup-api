const eventBus = require("./core/eventBus");

const { attachEventBus } = require("./core/feedback");
const { initAgents } = require("./agents");
const { initLearningLoop } = require("./core/learningLoop");
const { trace } = require("./core/observability");

const registry = require("./plugins/registry");

/**
 * ==========================================
 * GoUP Bootstrap
 * ==========================================
 * Punto único de inicialización del Kernel.
 */

let initialized = false;

function bootstrap() {

  if (initialized) {
    return { ok: true, initialized: true };
  }

  try {

    // Plugins
    if (typeof registry.loadPlugins === "function") {
      registry.loadPlugins();
    }
    trace("bootstrap.plugins", { status: "loaded" });

    // Feedback
    attachEventBus(eventBus);
    trace("bootstrap.feedback", { status: "attached" });

    // Learning Loop
    if (typeof initLearningLoop === "function") {
      initLearningLoop();
    }
    trace("bootstrap.learningLoop", { status: "initialized" });

    // Agents
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
