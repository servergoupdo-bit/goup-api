/**
 * cognitiveScorer.js
 * Blueprint v4.3 — Economic Routing Model
 */

class CognitiveScorer {
  constructor() {}

  /**
   * 💰 calcula “costo cognitivo” del nodo
   */
  cost(node) {
    return (
      node.load * 0.4 +
      (node.latency || 1) * 0.3 +
      (1 - (node.successRate || 1)) * 0.3
    );
  }

  /**
   * 📈 calcula “valor de ejecución”
   */
  value(node, intent) {
    const priorityWeight = intent.priority || 1;

    return (
      priorityWeight * 0.5 +
      node.reliability * 0.3 +
      (1 / (node.load + 1)) * 0.2
    );
  }

  /**
   * ⚖️ score final (optimización global)
   */
  score(node, intent) {
    return this.value(node, intent) - this.cost(node);
  }

  /**
   * 🧠 ranking de nodos
   */
  rank(nodes, intent) {
    return nodes
      .map(node => ({
        node,
        score: this.score(node, intent)
      }))
      .sort((a, b) => b.score - a.score);
  }
}

module.exports = CognitiveScorer;
