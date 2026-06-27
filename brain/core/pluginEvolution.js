const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../plugin-evolution.json");

/**
 * 🧠 9800 — PLUGIN EVOLUTION ENGINE
 * NO modifica código. Solo evalúa y propone.
 */

function load() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/**
 * Registra performance por plugin
 */
function recordPluginPerformance(plugin, success) {
  const db = load();

  if (!db[plugin]) {
    db[plugin] = {
      total: 0,
      success: 0,
      failure: 0,
      score: 0
    };
  }

  db[plugin].total++;

  if (success) {
    db[plugin].success++;
    db[plugin].score += 1;
  } else {
    db[plugin].failure++;
    db[plugin].score -= 0.5;
  }

  save(db);
}

/**
 * Detecta plugins candidatos a mejora
 */
function getEvolutionReport() {
  const db = load();

  const ranking = Object.entries(db)
    .map(([plugin, data]) => {
      const successRate =
        data.total > 0 ? data.success / data.total : 0;

      return {
        plugin,
        successRate,
        score: data.score,
        total: data.total
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranking[0];
  const worst = ranking[ranking.length - 1];

  return {
    best,
    worst,
    ranking
  };
}

/**
 * Genera sugerencia de mejora (NO ejecuta cambios)
 */
function suggestImprovement(plugin) {
  const db = load();
  const data = db[plugin];

  if (!data) return null;

  const successRate =
    data.total > 0 ? data.success / data.total : 0;

  if (successRate > 0.8) {
    return {
      plugin,
      suggestion: "consider_split_optimization",
      reason: "high_performance"
    };
  }

  if (successRate < 0.3) {
    return {
      plugin,
      suggestion: "needs_refactor_or_replacement",
      reason: "low_performance"
    };
  }

  return {
    plugin,
    suggestion: "stable",
    reason: "acceptable"
  };
}

module.exports = {
  recordPluginPerformance,
  getEvolutionReport,
  suggestImprovement
};
