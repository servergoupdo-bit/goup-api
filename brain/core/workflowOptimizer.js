/**
 * workflowOptimizer.js
 * Blueprint v3.4 — Cognitive Improvement Engine
 */

class WorkflowOptimizer {
  constructor({ observer, compiler }) {
    this.observer = observer;
    this.compiler = compiler;
  }

  /**
   * 🧠 genera mejora del workflow
   */
  optimize(workflowId, originalIntent) {
    const analysis = this.observer.analyzeWorkflow(workflowId);

    const improvements = [];

    if (analysis.failureRate > 0.3) {
      improvements.push("add_retry_logic");
    }

    if (analysis.avgTime > 5000) {
      improvements.push("parallelize_steps");
    }

    if (analysis.unstable) {
      improvements.push("add_fallback_path");
    }

    return {
      workflowId,
      improvements,
      suggestedVersion: this.compiler.compile({
        ...originalIntent,
        _optimizations: improvements
      })
    };
  }
}

module.exports = WorkflowOptimizer;
