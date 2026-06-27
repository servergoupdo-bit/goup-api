const memoryStore = new Map();

/**
 * 🧠 STORE CONTEXT
 */
function saveContext(input, intent) {

  if (!input || !intent) return;

  const id = Date.now();

  memoryStore.set(id, {
    input,
    intent,
    timestamp: id
  });

  return id;
}

/**
 * 🧠 GET RECENT CONTEXT (CORE FOR SCORING)
 */
function getRecentMemory(limit = 10) {
  return Array.from(memoryStore.values())
    .slice(-limit);
}

/**
 * 🧠 MEMORY-INFLUENCED SIGNAL
 * convierte memoria en “bias de scoring”
 */
function getMemorySignal(intentName) {

  const recent = getRecentMemory(20);

  const hits = recent.filter(m =>
    m.intent?.intent === intentName
  ).length;

  return {
    intent: intentName,
    weight: hits > 0 ? Math.min(1, hits * 0.2) : 0
  };
}

module.exports = {
  saveContext,
  getRecentMemory,
  getMemorySignal
};
