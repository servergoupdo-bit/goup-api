/**
 * federationCoordinator.js
 * Blueprint v4.1 — Cognitive Load Balancer
 */

class FederationCoordinator {
  constructor({ nodes, policyEngine }) {
    this.nodes = nodes; // [{ id, url, load }]
    this.policy = policyEngine;
  }

  /**
   * ⚖️ selecciona mejor nodo
   */
  selectNode(intent) {
    // estrategia simple: menor carga
    return this.nodes.sort((a, b) => a.load - b.load)[0];
  }

  /**
   * 🧠 decide ejecución
   */
  route(intent) {
    if (!this.policy.evaluate("LEARN", { errorRate: 0.1 })) {
      return this.selectNode(intent);
    }

    return this.selectNode(intent);
  }

  /**
   * 📊 actualiza carga
   */
  updateLoad(nodeId, delta = 1) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) node.load += delta;
  }

  /**
   * 🔁 registro de ejecución
   */
  registerExecution(nodeId) {
    this.updateLoad(nodeId, -1);
  }
}

module.exports = FederationCoordinator;
