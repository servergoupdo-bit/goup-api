/**
 * predictiveExecutionEngine.js
 * Blueprint v4.6 — Probabilistic Execution Layer
 */

class PredictiveExecutionEngine {
  constructor({ observer, scorer, registry }) {
    this.observer = observer;
    this.scorer = scorer;
    this.registry = registry;
  }

  /**
   * 🧠 predice éxito de ejecución por nodo
   */
  predictNodeSuccess(node, intent) {
    const failureRate = node.failureRate || 0.1;
    const load = node.load || 1;

    const risk = failureRate * 0.6 + load * 0.4;

    return 1 - Math.min(risk, 1);
  }

  /**
   * 📊 simula todos los nodos disponibles
   */
  simulate(intent) {
    const nodes = this.registry.activeNodes();

    return nodes.map(node => {
      const successProb = this.predictNodeSuccess(node, intent);

      return {
        node,
        successProbability: successProb,
        risk: 1 - successProb
      };
    }).sort((a, b) => b.successProbability - a.successProbability);
  }

  /**
   * 🎯 selecciona mejor ejecución ANTES de correr
   */
  selectBestExecution(intent) {
    const simulations = this.simulate(intent);

    const best = simulations[0];

    return {
      node: best.node,
      confidence: best.successProbability,
      strategy: best.successProbability > 0.8
        ? "DIRECT_EXECUTION"
        : "SAFE_ROUTING"
    };
  }

  /**
   * 🔮 predice si un intent fallará
   */
  willFail(intent) {
    const simulations = this.simulate(intent);

    const best = simulations[0];

    return best.successProbability < 0.5;
  }
}

module.exports = PredictiveExecutionEngine;
