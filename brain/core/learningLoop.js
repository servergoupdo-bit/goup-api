const eventBus = require("./eventBus");
const { recordExecution } = require("./globalMemory");
const { updateWeights } = require("./scoring");
const { runCounterfactual } = require("./counterfactualEngine");
const { recordPolicy } = require("./policyEngine");

/**
 * 🔁 LEARNING LOOP CERRADO (9000–13000)
 * execution → memory → scoring → counterfactual → policy
 */

function initLearningLoop() {

  eventBus.on("execution_complete", (event) => {
    const p = event?.payload;

    if (!p) return;

    // =========================
    // 1. GLOBAL MEMORY WRITE
    // =========================
    try {
      recordExecution({
        intent: p.intent,
        plugin: p.plugin,
        success: p.success
      });
    } catch (err) {
      console.error("[MEMORY ERROR]", err.message);
    }

    // =========================
    // 2. SCORING UPDATE (LEARNING)
    // =========================
    try {
      if (p.plugin) {
        updateWeights({
          intent: p.intent,
          plugin: p.plugin,
          success: p.success
        });
      }
    } catch (err) {
      console.error("[SCORING ERROR]", err.message);
    }

    // =========================
    // 3. COUNTERFACTUAL ANALYSIS (12000)
    // =========================
    let cf = null;

    try {
      cf = runCounterfactual(p.intent, p.plugin);

      if (cf?.regretSignal > 0.3) {
        console.log(
          "⚠️ counterfactual regret:",
          cf.regretSignal,
          "| best:",
          cf.bestAlternative?.plugin
        );
      }
    } catch (err) {
      console.error("[COUNTERFACTUAL ERROR]", err.message);
    }

    // =========================
    // 4. POLICY LEARNING (13000)
    // =========================
    try {
      recordPolicy({
        intent: p.intent,
        plugin: p.plugin,
        success: p.success,
        score: p.score || 0,
        alternatives: cf?.bestAlternative ? 1 : 0,
        regret: cf?.regretSignal || 0
      });
    } catch (err) {
      console.error("[POLICY ERROR]", err.message);
    }

    // =========================
    // 5. LOG FINAL STATE
    // =========================
    console.log(
      "🧠 learning loop updated:",
      p.intent,
      "→",
      p.plugin,
      "| success:",
      p.success
    );
  });

}

module.exports = {
  initLearningLoop
};
