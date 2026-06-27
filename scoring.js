const { listPlugins, getPlugin } = require("../plugins/registry");
const { getMemoryInsights } = require("./memoryStore");
const { getGlobalInsight } = require("./globalMemory");
const { normalize, getSemanticInsight } = require("./semanticMemory");
const fs = require("fs");
const path = require("path");

const WEIGHTS_FILE = path.join(__dirname, "../plugin-weights.json");

/**
 * =========================
 * WEIGHTS
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
    fs.writeFileSync(WEIGHTS_FILE, JSON.stringify(weights, null, 2));
  } catch {}
}

/**
 * =========================
 * BASE SCORE
 * =========================
 */
function baseScore(plugin, intentName) {
  if (typeof plugin.score === "function") {
    return plugin.score(intentName);
  }

  if (Array.isArray(plugin.capabilities)) {
    return plugin.capabilities.includes(intentName) ? 1 : 0;
  }

  return 0;
}

/**
 * =========================
 * CONTEXT BOOST
 * =========================
 */
function contextBoost(intentName) {
  let boost = 0;

  const local = getMemoryInsights(intentName) || {};
  const global = getGlobalInsight(intentName) || {};
  const semantic = getSemanticInsight
    ? getSemanticInsight(normalize ? normalize(intentName) : intentName)
    : null;

  if (local.total > 0) {
    boost += ((local.success || 0) / local.total) * 5;
  }

  if (global.total > 0) {
    boost += ((global.success || 0) / global.total) * 3;
  }

  return { boost, semantic };
}

/**
 * =========================
 * WEIGHT BOOST
 * =========================
 */
function weightBoost(weights, pluginName) {
  return weights[pluginName] || 0;
}

/**
 * =========================
 * MAIN ENGINE
 * =========================
 */
function selectBestPlugin(intentName) {
  if (!intentName || typeof intentName !== "string") {
    return {
      plugin: null,
      score: 0,
      error: "invalid_intent"
    };
  }

  const plugins = listPlugins();
  const weights = loadWeights();

  let bestPlugin = null;
  let bestScore = -Infinity;
  const ranking = [];

  for (const name of plugins) {
    const plugin = getPlugin(name);
    if (!plugin) continue;

    let score = 0;

    try {
      // 1. base
      score = baseScore(plugin, intentName);

      // 2. context
      const { boost } = contextBoost(intentName);
      score += boost;

      // 3. weights
      score += weightBoost(weights, name);

      // safety
      if (!isFinite(score) || isNaN(score)) score = 0;

    } catch {
      score = 0;
    }

    ranking.push({ plugin: name, score });

    if (score > bestScore) {
      bestScore = score;
      bestPlugin = name;
    }
  }

  return {
    plugin: bestPlugin,
    score: bestScore,
    ranking
  };
}

/**
 * =========================
 * LEARNING LOOP
 * =========================
 */
function updateWeights({ plugin, success }) {
  try {
    const weights = loadWeights();

    if (!plugin) return;

    if (!weights[plugin]) weights[plugin] = 0;

    weights[plugin] += success ? 0.1 : -0.05;

    weights[plugin] = Math.max(-2, Math.min(2, weights[plugin]));

    saveWeights(weights);

  } catch {}
}

module.exports = {
  selectBestPlugin,
  updateWeights
};
