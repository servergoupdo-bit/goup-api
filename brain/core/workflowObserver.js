/**
 * workflowObserver.js
 * Blueprint v3.4 — Execution Feedback Layer
 */

class WorkflowObserver {
  constructor({ memory }) {
    this.memory = memory;
  }

  /**
   * 📥 registra ejecución real
   */
  recordExecution(execution) {
    this.memory.add({
      type: "WORKFLOW_EXECUTION",
      timestamp: Date.now(),
      workflowId: execution.workflowId,
      status: execution.status,
      duration: execution.duration,
      steps: execution.steps,
      error: execution.error || null
    });
  }

  /**
   * 📊 detecta problemas en workflows
   */
  analyzeWorkflow(workflowId) {
    const logs = this.memory.getAll()
      .filter(m => m.type === "WORKFLOW_EXECUTION" && m.workflowId === workflowId);

    const failures = logs.filter(l => l.status === "failed");
    const avgTime = logs.reduce((a, b) => a + (b.duration || 0), 0) / (logs.length || 1);

    return {
      workflowId,
      totalRuns: logs.length,
      failureRate: failures.length / (logs.length || 1),
      avgTime,
      unstable: failures.length > 2 || avgTime > 5000
    };
  }
}

module.exports = WorkflowObserver;
