/**
 * metaPolicyEngine.js
 * Blueprint v3.6 — System Governance Layer
 */

class MetaPolicyEngine {
  constructor({ memoryGraph }) {
    this.graph = memoryGraph;

    this.policies = {
      allowLearning: true,
      allowOptimization: true,
      allowAutoRewrite: false,
      stabilityMode: false
    };
  }

  /**
   * 🧠 evalúa si el sistema puede aprender de un evento
   */
  canLearn(context) {
    if (this.policies.stabilityMode) return false;

    if (context.errorRate > 0.6) return false;

    return this.policies.allowLearning;
  }

  /**
   * 🔁 evalúa si se puede optimizar un workflow
   */
  canOptimize(workflowStats) {
    if (!this.policies.allowOptimization) return false;

    // demasiado inestable → no tocar
    if (workflowStats.failureRate > 0.4) return false;

    // demasiado crítico → congelar
    if (workflowStats.isCoreSystem) return false;

    return true;
  }

  /**
   * 🧱 evalúa si se permite reescritura automática
   */
  canRewrite(workflow) {
    return (
      this.policies.allowAutoRewrite &&
      !this.policies.stabilityMode &&
      workflow.trustScore > 0.8
    );
  }

  /**
   * ⚖️ modo estabilidad global
   */
  setStabilityMode(value) {
    this.policies.stabilityMode = value;
  }

  /**
   * 📊 decisión global del sistema
   */
  evaluate(action, context = {}) {
    switch (action) {
      case "LEARN":
        return this.canLearn(context);

      case "OPTIMIZE":
        return this.canOptimize(context);

      case "REWRITE":
        return this.canRewrite(context);

      default:
        return true;
    }
  }
}

module.exports = MetaPolicyEngine;
