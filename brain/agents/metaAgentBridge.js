const BaseAgent = require("./baseAgent");
const { observeExecution } = require("../core/metaAgent");

/**
 * 🧠 META AGENT BRIDGE
 */

class MetaAgentBridge extends BaseAgent {
  init() {
    this.on("execution_complete", (e) => {
      observeExecution(e.payload);
    });
  }
}

module.exports = MetaAgentBridge;
