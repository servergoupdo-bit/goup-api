const { buildPlan } = require("./planner");
const { selectBestPlugin } = require("./scoring");
const { getPlugin } = require("../plugins/registry");
const { getIOGateway } = require("./ioGatewaySingleton");

async function execute(input, context = {}) {
  const trace = [];

  // 🔧 Kernel services (solo runtime, no IO ownership)
  const policyEngine = require("./policyEngine");
  const eventBus = require("./eventBus");
  const memory = require("./memoryStore");

  // 🧠 SINGLETON IO GATEWAY (autoridad global del Kernel)
  const ioGateway = getIOGateway();

  try {
    const intentObj = {
      intent: input?.intent || "unknown"
    };

    trace.push({ stage: "input", data: intentObj });

    // 1. PLAN
    const plan = buildPlan(intentObj);
    trace.push({ stage: "plan", data: plan });

    const results = [];

    // 2. EXECUTION LOOP
    for (const step of plan) {

      // 2.1 SCORING
      const scoring = selectBestPlugin(step.intent || intentObj.intent);

      const plugin = getPlugin(scoring.plugin);

      if (!plugin || typeof plugin.execute !== "function") {
        const error = { step, error: "plugin_not_found" };

        results.push(error);
        trace.push(error);
        continue;
      }

      // 2.2 EXECUTE
      const result = await plugin.execute({
        step,
        context,
        ioGateway // 🧠 injected but controlled by singleton
      });

      results.push(result);

      trace.push({
        stage: "step_complete",
        step,
        result
      });
    }

    // 3. RETURN RESULT
    return {
      ok: true,
      results,
      trace
    };

  } catch (err) {

    const error = {
      stage: "executor_error",
      message: err?.message || "unknown_error"
    };

    trace.push(error);

    eventBus?.emit?.("execution_error", error);

    return {
      ok: false,
      error: error.message,
      trace
    };
  }
}

module.exports = { execute };
