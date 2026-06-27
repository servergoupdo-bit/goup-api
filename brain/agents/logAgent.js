const BaseAgent = require("./baseAgent");

/**
 * 🧠 LOG AGENT
 * Observa todo el sistema sin modificar nada
 */

class LogAgent extends BaseAgent {
  init() {
    this.on("execution_complete", (e) => {
      console.log("📊 LOG AGENT:", e.payload.traceId);
    });

    this.on("plan_created", (e) => {
      console.log("🧠 PLAN:", e.payload.traceId);
    });
  }
}

module.exports = LogAgent;
