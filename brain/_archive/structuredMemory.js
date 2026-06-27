// brain/core/structuredMemory.js

const memory = {
  intents: {},
  routes: {},
  executions: {}
};

/**
 * Guarda patrón de intención
 */
function storeIntent(input, intent) {
  if (!memory.intents[input]) {
    memory.intents[input] = [];
  }

  memory.intents[input].push({
    intent,
    timestamp: Date.now()
  });
}

/**
 * Recupera intención previa
 */
function recallIntent(input) {
  const history = memory.intents[input];
  if (!history || history.length === 0) return null;

  return history[history.length - 1];
}

/**
 * Guarda rutas exitosas
 */
function storeRoute(intent, route) {
  if (!memory.routes[intent]) {
    memory.routes[intent] = [];
  }

  memory.routes[intent].push({
    route,
    timestamp: Date.now()
  });
}

/**
 * Recupera mejor ruta conocida
 */
function recallRoute(intent) {
  const history = memory.routes[intent];
  if (!history || history.length === 0) return null;

  return history[history.length - 1].route;
}

/**
 * Guarda ejecución exitosa
 */
function storeExecution(intent, result) {
  if (!memory.executions[intent]) {
    memory.executions[intent] = [];
  }

  memory.executions[intent].push({
    result,
    timestamp: Date.now()
  });
}

module.exports = {
  storeIntent,
  recallIntent,
  storeRoute,
  recallRoute,
  storeExecution
};
