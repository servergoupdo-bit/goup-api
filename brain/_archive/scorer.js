// brain/router/scorer.js

const { listPlugins } = require("../plugins/registry");

function scoreIntent(intentObj, pluginName) {
  const intent = intentObj.intent;

  // scoring base (simple, controlado)
  const baseMap = {
    system: {
      "system.status": 1.0,
      "system.ping": 1.0,
      "system.docker": 1.0,
      "system.workflow": 0.9
    }
  };

  // detectar dominio
  const domain = pluginName;

  const score =
    (baseMap[domain] && baseMap[domain][intent]) || 0.2;

  return score;
}

function rankPlugins(intentObj) {
  const plugins = listPlugins();

  const ranked = plugins.map((p) => {
    return {
      plugin: p,
      score: scoreIntent(intentObj, p)
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}

module.exports = {
  scoreIntent,
  rankPlugins
};
