const { proposeEvolution } = require("./metaAgent");
const { updateWeights } = require("./scoring");
const fs = require("fs");
const path = require("path");

const STATE_FILE = path.join(__dirname, "../loop-state.json");

/**
 * 🧠 11000 — SELF-IMPROVING LOOP (CONTROLLED)
 * Optimiza comportamiento sin modificar código base
 */

function loadState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return {};
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * Ejecuta ciclo de mejora
 */
function runLoop() {
  const state = loadState();

  const evolution = proposeEvolution();

  const actions = evolution.proposals || [];

  const applied = [];

  for (const p of actions) {

    // 🔥 SOLO AJUSTES DE PESO, NO REWRITE DE CÓDIGO
    if (p.action === "candidate_deprecation") {
      updateWeights({
        selected: p.plugin,
        success: false,
        penalty: 0.2
      });

      applied.push({
        plugin: p.plugin,
        action: "penalized"
      });
    }

    if (p.action === "candidate_optimization") {
      updateWeights({
        selected: p.plugin,
        success: true,
        boost: 0.1
      });

      applied.push({
        plugin: p.plugin,
        action: "boosted"
      });
    }
  }

  const newState = {
    lastRun: Date.now(),
    applied,
    summary: {
      total: applied.length
    }
  };

  saveState(newState);

  return newState;
}

module.exports = {
  runLoop
};
