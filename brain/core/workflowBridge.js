/**
 * workflowBridge.js
 * Blueprint v2.0 — Kernel → Workflow connector
 */

class WorkflowBridge {
  constructor(workflow) {
    this.workflow = workflow;
  }

  /**
   * Recibe intent del kernel y lo ejecuta vía workflow
   */
  async executeIntent(intent) {
    const { type, payload } = intent;

    switch (type) {

      case "SYSTEM_CHECK":
        return await this.workflow.systemCheck();

      case "RUN_COMMAND":
        return await this.workflow.execSafe(payload.command);

      case "RUN_PROCESS":
        return await this.workflow.runProcess(payload.command);

      case "LIST_FILES":
        return await this.workflow.fs.listDir(payload.path || ".");

      default:
        return {
          error: "UNKNOWN_INTENT",
          intent
        };
    }
  }
}

module.exports = WorkflowBridge;
