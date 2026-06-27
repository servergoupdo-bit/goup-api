const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../policy-memory.json");

/**
 * 🧠 13000 — POLICY OPTIMIZATION LAYER
 * aprende qué tipo de decisiones funcionan mejor
 */

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
 * 📊 registra decisión completa
 */
function recordPolicy(event) {
  const memory = load();

  memory.push({
    timestamp: Date.now(),
    intent: event.intent,
    plugin: event.plugin,
    success: event.success,

    // contexto estratégico
    score: event.score || 0,
    alternatives: event.alternatives || 0,
    regret: event.regret || 0
  });

  if (memory.length > 10000) {
    memory.shift();
  }

  save(memory);
}

/**
 * 🧠 calcula qué políticas funcionan mejor
 */
function getPolicyInsight(intent) {
  const memory = load().filter(m => m.intent === intent);

  if (memory.length === 0) {
    return {
      successRate: 0,
      avgRegret: 0
    };
  }

  const success = memory.filter(m => m.success).length;
  const regret = memory.reduce((a, b) => a + (b.regret || 0), 0);

  return {
    successRate: success / memory.length,
    avgRegret: regret / memory.length
  };
}

module.exports = {
  recordPolicy,
  getPolicyInsight
};
