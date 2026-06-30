/**
 * selfHealingEngine.js
 * Blueprint v4.4 — Resilient Execution Layer
 */

class SelfHealingEngine {
  constructor({ router, registry, memory }) {
    this.router = router;
    this.registry = registry;
    this.memory = memory;
  }

  /**
   * Ejecuta intent con recuperación automática
   */
  async execute(intent, executorFn) {
    let attempt = 0;
    let lastError = null;

    while (attempt < 3) {
      try {
        const node = this.router.route(intent);

        const result = await executorFn(node, intent);

        this.memory.add({
          type: "EXECUTION_SUCCESS",
          intent,
          node: node.id,
          attempt
        });

        return result;

      } catch (error) {
        lastError = error;

        this.memory.add({
          type: "EXECUTION_FAILURE",
          intent,
          error: error.message,
          attempt
        });

        await this._handleFailure(error);

        attempt++;
      }
    }

    return {
      success: false,
      error: "SELF_HEALING_FAILED",
      lastError: lastError?.message
    };
  }

  /**
   * Estrategia de recuperación
   */
  async _handleFailure(error) {
    const msg = error.message?.toLowerCase() || "";

    if (msg.includes("timeout")) return "ROUTE_ALTERNATIVE";
    if (msg.includes("connection")) return "ROUTE_ALTERNATIVE";
    if (msg.includes("crash")) return "ESCALATE";

    return "RETRY";
  }
}

module.exports = SelfHealingEngine;
