/**
 * nodeRegistry.js
 * Blueprint v4.2 — Dynamic Node Discovery
 */

class NodeRegistry {
  constructor() {
    this.nodes = new Map();
  }

  /**
   * ➕ registrar nodo vivo
   */
  register(node) {
    this.nodes.set(node.id, {
      ...node,
      lastSeen: Date.now(),
      status: "alive"
    });
  }

  /**
   * ❌ eliminar nodo
   */
  remove(nodeId) {
    this.nodes.delete(nodeId);
  }

  /**
   * 📡 actualizar heartbeat
   */
  heartbeat(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.lastSeen = Date.now();
      node.status = "alive";
    }
  }

  /**
   * ☠️ detectar nodos caídos
   */
  prune(timeout = 10000) {
    const now = Date.now();

    for (const [id, node] of this.nodes.entries()) {
      if (now - node.lastSeen > timeout) {
        node.status = "dead";
      }
    }
  }

  /**
   * 📊 nodos activos
   */
  activeNodes() {
    return [...this.nodes.values()].filter(n => n.status === "alive");
  }
}

module.exports = NodeRegistry;
