/**
 * federationNode.js
 * Blueprint v4.0 — Distributed Cognitive Node
 */

class FederationNode {
  constructor({ id, kernel, memoryGraph }) {
    this.id = id;
    this.kernel = kernel;
    this.memoryGraph = memoryGraph;
    this.peers = new Map();
  }

  /**
   * Conecta otro nodo a la federación
   */
  connect(node) {
    this.peers.set(node.id, node);
  }

  /**
   * Envía conocimiento a otros nodos
   */
  broadcastKnowledge(pattern) {
    for (const peer of this.peers.values()) {
      peer.receiveKnowledge(pattern, this.id);
    }
  }

  /**
   * Recibe conocimiento externo
   */
  receiveKnowledge(pattern, fromNode) {
    this.memoryGraph.addNode({
      id: `shared_${Date.now()}`,
      type: "SHARED_PATTERN",
      data: pattern,
      source: fromNode
    });
  }

  /**
   * Ejecuta intent + aprende + comparte
   */
  async execute(intent) {
    const result = await this.kernel.handle(intent);

    const pattern = {
      intent,
      result,
      success: result?.success !== false
    };

    if (pattern.success) {
      this.broadcastKnowledge(pattern);
    }

    return result;
  }
}

module.exports = FederationNode;
