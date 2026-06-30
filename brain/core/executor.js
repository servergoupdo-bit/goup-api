const { buildPlan } = require("./planner");
const { selectBestPlugin } = require("./scoring");
const { getPlugin } = require("../plugins/registry");
const { getIOGateway } = require("./ioGatewaySingleton");

async function execute(input = {}, context = {}) {
  const trace = [];

  // 🧠 IO Gateway Singleton (única autoridad del sistema)
  const ioGateway = getIOGateway();

  try {
    const intentObj = {
      intent: input?.intent || "unknown",
      payload: input?.payload || {},
      context
    };

    trace.push({
      stage: "input",
      data: intentObj
    });

    // 1. PLAN (sin IO aún)
    const plan = buildPlan(intentObj);

    trace.push({
      stage: "plan",
      data: plan
    });

    // 2. SELECCIÓN DE PLUGIN
    const pluginMeta = selectBestPlugin(plan);

    const plugin = getPlugin(pluginMeta?.name);

    if (!plugin) {
      throw new Error(`[EXECUTOR] Plugin not found: ${pluginMeta?.name}`);
    }

    trace.push({
      stage: "plugin_selected",
      data: pluginMeta
    });

    // 3. EJECUCIÓN CONTROLADA (a través del IO Gateway)
    const executionResult = await ioGateway.request({
      intent: intentObj.intent,
      target: pluginMeta?.name,
      payload: plan,
      context
    });

    trace.push({
      stage: "execution",
      data: executionResult
    });

    // 4. RESPUESTA FINAL DEL KERNEL
    return {
      ok: true,
      trace,
      result: executionResult
    };

  } catch (err) {
    trace.push({
      stage: "error",
      error: err.message
    });

    return {
      ok: false,
      error: err.message,
      trace
    };
  }
}

module.exports = { execute };
