let instance = null;
let locked = false;

function getIOGateway(deps = {}) {
  if (instance) return instance;

  const IOGateway = require("./ioGateway");

  instance = new IOGateway(deps);

  // 🔒 LOCK: evita re-inicialización silenciosa
  locked = true;

  return instance;
}

/**
 * 🚨 Hard protection (arquitectural integrity)
 * evita que el sistema re-cree el gateway accidentalmente
 */
function createIOGateway() {
  throw new Error(
    "[IO_GATEWAY] Direct instantiation forbidden. Use getIOGateway()."
  );
}

module.exports = {
  getIOGateway,
  createIOGateway
};
