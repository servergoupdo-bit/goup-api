const logs = [];

/**
 * 🧠 OBSERVABILITY KERNEL 8000
 * Captura decisiones internas del sistema
 */

function trace(event, data = {}) {

  const entry = {
    event,
    data,
    timestamp: Date.now()
  };

  logs.push(entry);

  // opcional: salida consola estructurada
  console.log("[TRACE]", event, JSON.stringify(data));

  return entry;
}

/**
 * obtiene trazas recientes
 */
function getTraces(limit = 50) {
  return logs.slice(-limit);
}

/**
 * limpia observabilidad
 */
function clearTraces() {
  logs.length = 0;
}

module.exports = {
  trace,
  getTraces,
  clearTraces
};
