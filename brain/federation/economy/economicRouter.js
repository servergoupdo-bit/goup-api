/**
 * economicRouter.js
 * Blueprint v4.3 — Value-Based Execution Routing
 */

class EconomicRouter {
  constructor({ registry, scorer }) {
    this.registry = registry;
    this.scorer = scorer;
  }

  /**
   * 🎯 selecciona mejor nodo basado en “valor”
   */
  route(intent) {
    const nodes = this.registry.activeNodes();

    if (nodes.length === 0) {
      throw new Error("NO_AVAILABLE_NODES");
    }

    const ranked = this.scorer.rank(nodes, intent);

    return ranked[0].node;
  }

  /**
   * 🔁 fallback inteligente
   */
  failover(intent, failedNodeId) {
    const nodes = this.registry.activeNodes()
      .filter(n => n.id !== failedNodeId);

    const ranked = this.scorer.rank(nodes, intent);

    if (ranked.length === 0) {
      throw new Error("NO_FAILOVER_AVAILABLE");
    }

    return ranked[0].node;
  }
}

module.exports = EconomicRouter;
