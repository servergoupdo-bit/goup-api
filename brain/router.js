const { rankPlugins } = require("./router/scorer");

function routeIntent(intentObj) {

  if (!intentObj || typeof intentObj !== "object") {
    return {
      handlerPath: null,
      intent: null,
      error: "invalid_intent_object"
    };
  }

  const ranked = rankPlugins(intentObj);
  const best = ranked[0];

  return {
    handlerPath: `./plugins/${best.plugin}`,
    intent: intentObj,
    capability: best,
    ranking: ranked,

    // 🧠 nuevo: fallback chain listo
    fallbackChain: ranked.slice(1)
  };
}

module.exports = {
  routeIntent
};
