const { listPlugins, getPlugin } = require("../plugins/registry");
const { selectBestPlugin } = require("./scoring");

/**
 * 🧠 12000 — COUNTERFACTUAL ENGINE
 * simula qué habría pasado con otros plugins
 */

function simulatePlugin(intent, pluginName) {
  const plugin = getPlugin(pluginName);

  if (!plugin) {
    return { plugin: pluginName, score: 0, successLikelihood: 0 };
  }

  let score = 0;

  try {
    if (typeof plugin.score === "function") {
      score = plugin.score(intent);
    }

    if (score === 0 && plugin.capabilities) {
      score = plugin.capabilities.includes(intent) ? 1 : 0;
    }

  } catch {
    score = 0;
  }

  // probabilidad simulada de éxito (heurística simple)
  const successLikelihood = Math.max(0, Math.min(1, score / 3));

  return {
    plugin: pluginName,
    score,
    successLikelihood
  };
}

/**
 * 🔁 genera escenarios alternativos
 */
function runCounterfactual(intent, chosenPlugin) {
  const plugins = listPlugins();

  const baseline = simulatePlugin(intent, chosenPlugin);

  const alternatives = [];

  for (const p of plugins) {
    if (p === chosenPlugin) continue;

    const sim = simulatePlugin(intent, p);

    alternatives.push(sim);
  }

  // ordena mejores alternativas
  alternatives.sort((a, b) => b.successLikelihood - a.successLikelihood);

  return {
    chosen: baseline,
    bestAlternative: alternatives[0] || null,
    regretSignal:
      alternatives.length && alternatives[0]
        ? alternatives[0].successLikelihood - baseline.successLikelihood
        : 0
  };
}

module.exports = {
  runCounterfactual
};
