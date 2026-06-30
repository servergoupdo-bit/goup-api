const IOGateway = require("./ioGateway");

let instance = null;
let initialized = false;
let cachedDeps = null;

/**
 * 🧠 Inicializa el IO Gateway UNA SOLA VEZ
 * Solo permitido desde bootstrap
 */
function initIOGateway(deps) {
  if (initialized) return instance;

  if (!deps) {
    throw new Error("[IO_GATEWAY] Missing bootstrap dependencies");
  }

  cachedDeps = {
    policyEngine: deps.policyEngine,
    eventBus: deps.eventBus,
    memory: deps.memory,
    transport: deps.transport || null
  };

  instance = new IOGateway(cachedDeps);
  initialized = true;

  return instance;
}

/**
 * 🧠 Acceso seguro global
 */
function getIOGateway() {
  if (!instance) {
    throw new Error("[IO_GATEWAY] Not initialized. Call initIOGateway() in bootstrap first.");
  }

  return instance;
}

/**
 * 🧠 Estado interno (debug / observability)
 */
function getIOGatewayStatus() {
  return {
    initialized,
    hasInstance: !!instance,
    hasDeps: !!cachedDeps
  };
}

module.exports = {
  initIOGateway,
  getIOGateway,
  getIOGatewayStatus
};
