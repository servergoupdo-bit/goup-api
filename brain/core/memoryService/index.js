const { getMemoryInsights } = require("../memoryStore");
const { getGlobalInsight } = require("../globalMemory");
const { getSemanticInsight } = require("../semanticMemory");

/**
 * 🧠 MEMORY SERVICE v1
 * Unifica acceso a memoria sin romper kernel
 */

function getInsights(intent) {
  return getMemoryInsights(intent) || {};
}

function getGlobal(intent) {
  return getGlobalInsight(intent) || {};
}

function getSemantic(intent) {
  return getSemanticInsight(intent) || null;
}

function stats(intent) {
  const local = getInsights(intent);
  const global = getGlobal(intent);

  return {
    local,
    global
  };
}

/**
 * FUTURO: event recorder (no activo aún)
 */
function record(event) {
  // placeholder controlado
  return true;
}

module.exports = {
  getInsights,
  getGlobal,
  getSemantic,
  stats,
  record
};
