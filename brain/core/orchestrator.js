const eventBus = require("./eventBus");
const { buildPlan } = require("./planner");
const { execute } = require("./executor");
const { selectBestPlugin } = require("./scoring");
const { detectIntent } = require("../intent/detector");
const { trace } = require("./observability");

async function orchestrate(intentObj = {}) {
  const startTime = Date.now();
  const traceId = intentObj.traceId || `trace_${startTime}`;

  const raw = intentObj.intent || "";
  const detected = detectIntent(raw);

  const enrichedIntent = {
    ...intentObj,
    intent: detected.intent !== "unknown" ? detected.intent : raw,
    confidence: detected.confidence,
    intentRaw: raw
  };

  trace("orchestrator.intent_detected", {
    traceId,
    raw,
    detected: detected.intent,
    confidence: detected.confidence
  });

  const plan = buildPlan(enrichedIntent);

  const steps = [];
  let successCount = 0;
  let errorCount = 0;

  eventBus.emit("workflow_started", { traceId, plan });

  for (let i = 0; i < plan.length; i++) {
    const step = plan[i];
    const stepStart = Date.now();

    eventBus.emit("step_start", { traceId, step });

    const scoring = selectBestPlugin(step.intent || enrichedIntent.intent);
    const plugin = scoring.plugin;

    eventBus.emit("plugin_selected", { traceId, step, plugin, score: scoring.score });

    let result = null;
    let success = true;

    try {
      result = await execute({
        intent: step.intent || enrichedIntent.intent,
        step,
        traceId
      });
      successCount++;
    } catch (err) {
      success = false;
      errorCount++;
      result = { error: err.message };
    }

    const stepRecord = {
      step: step.step || i + 1,
      intent: step.intent,
      plugin,
      score: scoring.score,
      result,
      success,
      timestamp: Date.now() - stepStart
    };

    steps.push(stepRecord);

    trace("orchestrator.step_complete", { traceId, step: stepRecord.step, success });
    eventBus.emit("step_complete", { traceId, step: stepRecord });
  }

  const executionTimeMs = Date.now() - startTime;
  const summary = { totalSteps: steps.length, successCount, errorCount, executionTimeMs };

  const finalResult = {
    traceId,
    status: errorCount > 0 ? "partial_success" : "ok",
    intent: enrichedIntent.intent,
    confidence: enrichedIntent.confidence,
    steps,
    summary
  };

  trace("orchestrator.finished", { traceId, status: finalResult.status, executionTimeMs });
  eventBus.emit("workflow_finished", finalResult);

  return finalResult;
}

module.exports = { orchestrate };
