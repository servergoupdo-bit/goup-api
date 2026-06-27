const { listPlugins, getPlugin } = require("../plugins/registry");
const MemoryService = require("./memoryService");

const fs = require("fs");
const path = require("path");

const WEIGHTS_FILE = path.join(__dirname, "../plugin-weights.json");

/**
 * =========================
 * WEIGHTS SYSTEM
 * =========================
 */

function loadWeights() {
  try {
    if (!fs.existsSync(WEIGHTS_FILE)) return {};
    return JSON.parse(fs.readFileSync(WEIGHTS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveWeights(weights) {
  try {
    fs.writeFileSync(
      WEIGHTS_FILE,
      JSON.stringify(weights, null, 2)
    );
  } catch (err) {
    console.error("[WEIGHTS]", err.message);
  }
}

/**
 * =========================
 * PLUGIN SELECTION
 * =========================
 */

function selectBestPlugin(intentName = "") {

  const plugins = listPlugins();

  let bestPlugin = null;
  let bestScore = -Infinity;

  const ranking = [];

  const normalizedIntent = String(intentName).toLowerCase();

  const localMemory =
    MemoryService.getInsights(normalizedIntent) || {};

  const globalMemory =
    MemoryService.getGlobal(normalizedIntent) || {};

  const semantic =
    MemoryService.getSemantic(normalizedIntent);

  const weights = loadWeights();

  for (const name of plugins) {

    const plugin = getPlugin(name);

    if (!plugin) continue;

    let score = 0;

    try {

      // -------------------------
      // Base plugin score
      // -------------------------

      if (typeof plugin.score === "function") {
        score = plugin.score(normalizedIntent);
      }

      if (
        score === 0 &&
        Array.isArray(plugin.capabilities)
      ) {
        score = plugin.capabilities.includes(normalizedIntent)
          ? 1
          : 0;
      }

      // -------------------------
      // Local Memory
      // -------------------------

      if (localMemory.total > 0) {
        score +=
          (localMemory.success / localMemory.total) * 5;
      }

      // -------------------------
      // Global Memory
      // -------------------------

      if (globalMemory.total > 0) {
        score +=
          (globalMemory.success / globalMemory.total) * 3;
      }

      // -------------------------
      // Semantic Memory
      // -------------------------

      if (
        semantic &&
        Array.isArray(semantic.relatedPlugins) &&
        semantic.relatedPlugins.includes(name)
      ) {
        score += 2;
      }

      // -------------------------
      // Closed Loop Bias
      // -------------------------

      const weight = weights[name] || 0;

      const adaptiveBias =
        Math.sign(weight) *
        Math.pow(Math.abs(weight), 1.5);

      score += adaptiveBias * 2.5;

      if (!Number.isFinite(score)) {
        score = 0;
      }

    } catch {

      score = 0;

    }

    ranking.push({
      plugin: name,
      score
    });

    if (score > bestScore) {
      bestScore = score;
      bestPlugin = name;
    }

  }

  ranking.sort((a, b) => b.score - a.score);

  return {
    plugin: bestPlugin,
    score: bestScore,
    ranking
  };
}

/**
 * =========================
 * LEARNING
 * =========================
 */

function updateWeights({
  plugin,
  success
}) {

  if (!plugin) return;

  const weights = loadWeights();

  if (weights[plugin] === undefined) {
    weights[plugin] = 0;
  }

  weights[plugin] += success ? 0.10 : -0.05;

  weights[plugin] = Math.max(
    -2,
    Math.min(2, weights[plugin])
  );

  saveWeights(weights);
}

module.exports = {
  selectBestPlugin,
  updateWeights
};
