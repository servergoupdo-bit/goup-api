/**
 * n8nWorkflowCompiler.js
 * Blueprint v3.2 — Intent → Workflow translator
 */

class N8NWorkflowCompiler {
  /**
   * convierte intent en payload n8n
   */
  compile(intent) {
    switch (intent.type) {
      case "SYSTEM_CHECK":
        return {
          workflow: "system-report",
          payload: {}
        };

      case "LIST_FILES":
        return {
          workflow: "file-inspector",
          payload: intent.payload
        };

      case "RUN_COMMAND":
        return {
          workflow: "command-executor",
          payload: intent.payload
        };

      case "SEND_REPORT":
        return {
          workflow: "report-generator",
          payload: intent.payload
        };

      default:
        return {
          workflow: "generic-handler",
          payload: intent
        };
    }
  }
}

module.exports = N8NWorkflowCompiler;
