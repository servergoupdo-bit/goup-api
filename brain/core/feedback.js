const fs = require("fs");
const path = require("path");
const { saveMemory } = require("./memoryStore");

const FILE = path.join(__dirname, "../memory-feedback.json");

/**
 * Cargar feedback histórico
 */
function loadFeedback() {
  try {
    if (!fs.existsSync(FILE)) return [];

    const raw = fs.readFileSync(FILE, "utf8");
    if (!raw) return [];

    return JSON.parse(raw);
  } catch (err) {
    console.error("[FEEDBACK LOAD ERROR]", err.message);
    return [];
  }
}

/**
 * Guardar feedback + puente a memory system (7000)
 */
function saveFeedback(entry = {}) {
  try {
    const data = loadFeedback();

    const enriched = {
      timestamp: Date.now(),

      // INPUT
      input: entry.input ?? null,
      intent: entry.intent ?? null,
      plugin: entry.plugin ?? null,

      // RESULT
      success: entry.success ?? false,
      error: entry.error ?? null,

      // OBSERVABILITY (8000-B)
      traceId: entry.traceId ?? null,
      executionTime: entry.executionTime ?? null
    };

    // guardar observabilidad
    data.push(enriched);

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    // 🔥 PUENTE CONTROLADO HACIA 7000 (MEMORY)
    saveMemory({
      intent: enriched.intent,
      plugin: enriched.plugin,
      success: enriched.success,
      raw: enriched.input
    });

  } catch (err) {
    console.error("[FEEDBACK SAVE ERROR]", err.message);
  }
}

/**
 * Hook opcional con EventBus
 */
function attachEventBus(eventBus) {
  if (!eventBus || !eventBus.on) return;

  eventBus.on("execution_complete", (payload) => {
    saveFeedback({
      input: payload.input,
      intent: payload.intent,
      plugin: payload.plugin,
      success: payload.success,
      error: payload.error,
      traceId: payload.traceId,
      executionTime: payload.executionTime
    });
  });
}

module.exports = {
  loadFeedback,
  saveFeedback,
  attachEventBus
};
