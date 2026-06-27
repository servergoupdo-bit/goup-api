const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../causal-memory.json");

function load() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/**
 * 🧠 Registra relaciones causales simples
 */
function recordCausal(event) {
  const memory = load();

  const entry = {
    timestamp: Date.now(),
    intent: event.intent,
    plugin: event.plugin,
    success: event.success,

    // 🔥 factores causales
    score: event.score || 0,
    previousUsage: event.previousUsage || 0,
    semanticMatch: event.semanticMatch || false
  };

  memory.push(entry);

  // evitar crecimiento infinito
  if (memory.length > 5000) {
    memory.shift();
  }

  save(memory);
}

/**
 * 📊 extrae patrones causales simples
 */
function getCausalInsight(intent) {
  const memory = load().filter(m => m.intent === intent);

  if (memory.length === 0) {
    return {
      successRate: 0,
      patterns: []
    };
  }

  const success = memory.filter(m => m.success).length;

  return {
    successRate: success / memory.length,
    patterns: memory.slice(-10)
  };
}

module.exports = {
  recordCausal,
  getCausalInsight
};
