const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../meta-agent.json");

/**
 * 🧠 9900 — META-AGENT CORE
 * Observa sistema completo y propone evolución
 */

function load() {
  try {
    if (!fs.existsSync(FILE)) return [];
    const raw = fs.readFileSync(FILE, "utf8");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("[META LOAD ERROR]", err.message);
    return [];
  }
}

function save(data) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[META SAVE ERROR]", err.message);
  }
}

/**
 * 🧠 Registra ejecución completa del sistema
 */
function observeExecution(trace) {
  const history = load();

  history.push({
    timestamp: Date.now(),
    trace
  });

  save(history);
}

/**
 * 📊 Analiza comportamiento global del sistema
 */
function analyze() {
  const history = load();

  const stats = {
    total: history.length,
    success: 0,
    failures: 0,
    pluginUsage: {}
  };

  for (const h of history) {
    const results = h.trace?.results || [];

    for (const r of results) {
      const plugin = r.plugin;

      if (!plugin) continue;

      if (!stats.pluginUsage[plugin]) {
        stats.pluginUsage[plugin] = { success: 0, fail: 0 };
      }

      if (r.success) {
        stats.success++;
        stats.pluginUsage[plugin].success++;
      } else {
        stats.failures++;
        stats.pluginUsage[plugin].fail++;
      }
    }
  }

  return stats;
}

/**
 * 🔍 Detecta plugins problemáticos o sobresalientes
 */
function detectPatterns(stats) {
  const proposals = [];

  for (const [plugin, data] of Object.entries(stats.pluginUsage)) {
    const total = data.success + data.fail;
    const rate = total > 0 ? data.success / total : 0;

    if (total >= 3 && rate < 0.3) {
      proposals.push({
        plugin,
        action: "candidate_deprecation",
        reason: "low_success_rate",
        rate
      });
    }

    if (total >= 3 && rate > 0.85) {
      proposals.push({
        plugin,
        action: "candidate_optimization",
        reason: "high_success_rate",
        rate
      });
    }
  }

  return proposals;
}

/**
 * 🧠 PROPUESTA DE EVOLUCIÓN GLOBAL
 */
function proposeEvolution() {
  const stats = analyze();
  const proposals = detectPatterns(stats);

  return {
    stats,
    proposals
  };
}

module.exports = {
  observeExecution,
  analyze,
  proposeEvolution
};
