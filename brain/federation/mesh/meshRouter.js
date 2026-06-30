/**
 * meshRouter.js
 * Blueprint v4.2 — Intelligent Routing Layer
 */

class MeshRouter {
  constructor({ registry, coordinator }) {
    this.registry = registry;
    this.coordinator = coordinator;
  }

  /**
   * 🎯 selecciona nodo óptimo dinámicamente
   */
  route(intent) {
    const nodes = this.registry.activeNodes();

    if (nodes.length === 0) {
      throw new Error("NO_AVAILABLE_NODES");
    }

    // selección básica inicial (extensible a scoring)
    const sorted = nodes.sort((a, b) => a.load - b.load);

    return sorted[0];
  }

  /**
   * 🔁 fallback automático
   */
  failover(intent, failedNodeId) {
    const nodes = this.registry.activeNodes()
      .filter(n => n.id !== failedNodeId);

    if (nodes.length === 0) {
      throw new Error("NO_FAILOVER_AVAILABLE");
    }

    return nodes[0];
  }
}

module.exports = MeshRouter;
