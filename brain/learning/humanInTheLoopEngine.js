/**
 * humanInTheLoopEngine.js
 * Blueprint v5.0 — Adaptive Learning Loop
 */

class HumanInTheLoopEngine {
  constructor({ memory, scorer, router, observer }) {
    this.memory = memory;
    this.scorer = scorer;
    this.router = router;
    this.observer = observer;
  }

  /**
   * 🧠 registra decisión humana
   */
  recordDecision({ intent, options, selected }) {
    this.memory.add({
      type: "HUMAN_DECISION",
      intent,
      options,
      selected,
      timestamp: Date.now()
    });
  }

  /**
   * 📊 compara decisión vs alternativas
   */
  analyzeDecision(intent) {
    const decisions = this.memory.getAll()
      .filter(d => d.type === "HUMAN_DECISION" && d.intent === intent);

    return decisions.map(d => {
      const regret = d.options.filter(o => o !== d.selected);

      return {
        intent,
        selected: d.selected,
        alternatives: regret
      };
    });
  }

  /**
   * 🧠 ajusta scoring basado en comportamiento humano
   */
  adaptScoring() {
    const decisions = this.memory.getAll()
      .filter(d => d.type === "HUMAN_DECISION");

    for (const d of decisions) {
      // refuerzo simple: lo seleccionado gana peso
      this._reinforce(d.selected);
      this._penalize(d.options.filter(o => o !== d.selected));
    }
  }

  /**
   * 📈 refuerzo de nodo elegido
   */
  _reinforce(node) {
    if (!node) return;
    node.reliability = (node.reliability || 0.5) + 0.05;
  }

  /**
   * 📉 penalización de alternativas no elegidas
   */
  _penalize(nodes) {
    for (const node of nodes) {
      node.reliability = Math.max((node.reliability || 0.5) - 0.02, 0);
    }
  }

  /**
   * 🔁 ciclo completo de aprendizaje
   */
  runLearningCycle() {
    this.adaptScoring();

    return {
      status: "LEARNING_UPDATED",
      timestamp: Date.now()
    };
  }
}

module.exports = HumanInTheLoopEngine;
