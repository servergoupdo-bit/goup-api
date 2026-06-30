/**
 * cognitiveObserver.js
 * Blueprint v4.5 — Cognitive Observability Layer
 */

class CognitiveObserver {
  constructor({ memory, graph }) {
    this.memory = memory;
    this.graph = graph;
  }

  /**
   * 📡 registra evento del sistema en tiempo real
   */
  record(event) {
    this.memory.add({
      type: "OBS_EVENT",
      timestamp: Date.now(),
      ...event
    });
  }

  /**
   * 🔍 reconstruye ejecución completa de un intent
   */
  traceIntent(intentId) {
    const logs = this.memory.getAll()
      .filter(e =>
        e.intent?.id === intentId ||
        e.linkedTo === intentId
      );

    return {
      intentId,
      events: logs,
      summary: this._summarize(logs)
    };
  }

  /**
   * 🧠 detección simple de anomalías
   */
  detectAnomalies() {
    const logs = this.memory.getAll();

    const failures = logs.filter(l => l.type === "EXECUTION_FAILURE");
    const successes = logs.filter(l => l.type === "EXECUTION_SUCCESS");

    return {
      failureRate: failures.length / (logs.length || 1),
      successRate: successes.length / (logs.length || 1),
      unstable: failures.length > successes.length
    };
  }

  /**
   * 🧩 explicación causal básica
   */
  explainFailure(intentId) {
    const trace = this.traceIntent(intentId);

    const failures = trace.events.filter(e => e.type === "EXECUTION_FAILURE");

    return {
      intentId,
      possibleCauses: [
        failures.some(f => f.error?.includes("timeout")) && "High latency in execution path",
        failures.some(f => f.error?.includes("connection")) && "Node connectivity instability",
        trace.events.length > 5 && "Repeated retries without route change"
      ].filter(Boolean)
    };
  }

  /**
   * 📊 resumen del comportamiento
   */
  _summarize(events) {
    return {
      totalEvents: events.length,
      types: [...new Set(events.map(e => e.type))]
    };
  }
}

module.exports = CognitiveObserver;
