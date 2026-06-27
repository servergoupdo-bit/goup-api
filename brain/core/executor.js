const { buildPlan } = require("./planner");
const { selectBestPlugin } = require("./scoring");
const { getPlugin } = require("../plugins/registry");

async function execute(input) {
  const trace = [];

  try {
    const intentObj = {
      intent: input?.intent || ""
    };

    trace.push({ stage: "input", data: intentObj });

    // 1. PLAN
    const plan = buildPlan(intentObj);
    trace.push({ stage: "plan", data: plan });

    const results = [];

    // 2. EXECUTION LOOP
    for (const step of plan) {

      // 2.1 SCORING (decision only)
      const scoring = selectBestPlugin(step.intent || intentObj.intent);

      const plugin = getPlugin(scoring.plugin);

      if (!plugin || typeof plugin.execute !== "function") {
        const error = { step, error: "plugin_not_found" };

        results.push(error);
        trace.push(error);
        continue;
      }

      // 2.2 EXECUTE ONLY
      const result = await plugin.execute({
        step,
        input
      });

      results.push(result);

      trace.push({
        stage: "execution",
        plugin: scoring.plugin,
        result
      });
    }

    return {
      status: "ok",
      result: results,
      trace
    };

  } catch (error) {
    return {
      status: "error",
      result: null,
      trace,
      error: error.message
    };
  }
}

module.exports = {
  execute
};
