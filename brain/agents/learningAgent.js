const BaseAgent = require("./baseAgent");
const { updateWeights } = require("../core/scoring");

/**
 * 🧠 LEARNING AGENT
 * Ajusta scoring basado en resultados
 */

class LearningAgent extends BaseAgent {
  init() {
    this.on("execution_complete", (e) => {
      const { result } = e.payload;

      if (!result) return;

      updateWeights({
        selected: result.plugin,
        success: result.success
      });
    });
  }
}

module.exports = LearningAgent;
