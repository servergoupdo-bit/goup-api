let instance = null;
let initialized = false;

/**
 * 🧱 Init ONLY from bootstrap
 */
function initIOGateway(deps = {}) {
  if (initialized) {
    throw new Error("[IO_GATEWAY] Already initialized");
  }

  const IOGateway = require("./ioGateway");

  instance = new IOGateway(deps);
  initialized = true;

  return instance;
}

/**
 * 🔒 Runtime access only
 */
function getIOGateway() {
  if (!initialized || !instance) {
    throw new Error(
      "[IO_GATEWAY] Not initialized. Call initIOGateway() in bootstrap first."
    );
  }

  return instance;
}

/**
 * 🧪 Status check (optional observability)
 */
function getIOGatewayStatus() {
  return {
    initialized,
    hasInstance: !!instance
  };
}

module.exports = {
  initIOGateway,
  getIOGateway,
  getIOGatewayStatus
};
