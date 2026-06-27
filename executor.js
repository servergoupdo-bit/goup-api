const { buildPlan } = require("./brain/core/planner");
const { selectBestPlugin } = require("./brain/core/scoring");
const { getPlugin } = require("./brain/plugins/registry");

async function execute(input) {
  const trace = [];

  try {
    const intentObj = {
      intent: input?.intent || ""
    };

    const plan = buildPlan(intentObj);
    const results = [];

    for (const step of plan) {

      const scoring = selectBestPlugin(step.intent || intentObj.intent);
      const plugin = getPlugin(scoring.plugin);

      if (!plugin || typeof plugin.execute !== "function") {
        results.push({
          step,
          error: "plugin_not_found"
        });

        trace.push({
          step,
          error: "plugin_not_found"
        });

        continue;
      }

      const result = await plugin.execute({
        step,
        input
      });

      results.push(result);

      trace.push({
        step,
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

module.exports = { execute };
