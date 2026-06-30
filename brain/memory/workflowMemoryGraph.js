/**
 * workflowMemoryGraph.js
 * Blueprint v3.5 — Structural Memory System
 */

class WorkflowMemoryGraph {
  constructor() {
    this.nodes = new Map();   // workflows, intents, executions
    this.edges = new Map();   // relaciones
  }

  /**
   * ➕ añade nodo al grafo
   */
  addNode(node) {
    this.nodes.set(node.id, {
      ...node,
      createdAt: Date.now()
    });
  }

  /**
   * 🔗 conecta nodos
   */
  addEdge(from, to, type) {
    const key = `${from}->${to}`;

    this.edges.set(key, {
      from,
      to,
      type, // "generated", "executed", "failed", "optimized"
      timestamp: Date.now()
    });
  }

  /**
   * 🧠 registra workflow completo
   */
  registerWorkflowLifecycle({ intent, workflow, execution }) {
    const intentId = `intent_${Date.now()}`;
    const workflowId = `workflow_${Date.now()}`;
    const execId = `exec_${Date.now()}`;

    this.addNode({ id: intentId, type: "INTENT", data: intent });
    this.addNode({ id: workflowId, type: "WORKFLOW", data: workflow });
    this.addNode({ id: execId, type: "EXECUTION", data: execution });

    this.addEdge(intentId, workflowId, "generated");
    this.addEdge(workflowId, execId, "executed");

    if (execution?.status === "failed") {
      this.addEdge(execId, workflowId, "failed");
    }

    return {
      intentId,
      workflowId,
      execId
    };
  }

  /**
   * 📊 obtiene evolución de un workflow
   */
  getWorkflowHistory(workflowId) {
    const history = [];

    for (const edge of this.edges.values()) {
      if (edge.from === workflowId || edge.to === workflowId) {
        history.push(edge);
      }
    }

    return history;
  }
}

module.exports = WorkflowMemoryGraph;
