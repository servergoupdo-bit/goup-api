/**
 * autonomousWorkflowComposer.js
 * Blueprint v4.7 — Intent → Workflow Generator
 */

class AutonomousWorkflowComposer {
  constructor({ registry, scorer, observer }) {
    this.registry = registry;
    this.scorer = scorer;
    this.observer = observer;
  }

  /**
   * 🧠 convierte intención en workflow estructurado
   */
  compose(intentText) {
    const intent = this._parseIntent(intentText);

    const nodes = this._generateNodes(intent);

    const edges = this._generateEdges(nodes);

    const workflow = {
      id: Date.now().toString(),
      intent,
      nodes,
      edges
    };

    this.observer?.record?.({
      type: "WORKFLOW_COMPOSED",
      workflow
    });

    return workflow;
  }

  /**
   * 🧾 parsing básico de intención
   */
  _parseIntent(text) {
    return {
      raw: text,
      type: this._detectType(text),
      priority: text.includes("urgente") ? 2 : 1
    };
  }

  /**
   * 🔍 detección simple de intención
   */
  _detectType(text) {
    if (text.includes("telegram")) return "TELEGRAM_AUTOMATION";
    if (text.includes("email")) return "EMAIL_AUTOMATION";
    if (text.includes("n8n")) return "WORKFLOW_AUTOMATION";
    return "GENERIC_AUTOMATION";
  }

  /**
   * 🧱 generación de nodos de workflow
   */
  _generateNodes(intent) {
    const baseNodes = [
      { id: "trigger", type: "trigger", service: "input" },
      { id: "processor", type: "logic", service: "brain" },
      { id: "executor", type: "action", service: "n8n" }
    ];

    if (intent.type === "TELEGRAM_AUTOMATION") {
      baseNodes.push({ id: "telegram", type: "integration", service: "telegram" });
    }

    return baseNodes;
  }

  /**
   * 🔗 conexión entre nodos
   */
  _generateEdges(nodes) {
    const edges = [];

    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        from: nodes[i].id,
        to: nodes[i + 1].id
      });
    }

    return edges;
  }
}

module.exports = AutonomousWorkflowComposer;
