/**
 * workflowDialogEngine.js
 * Blueprint v3.3 — Conversational Workflow Builder
 */

class WorkflowDialogEngine {
  constructor({ compiler }) {
    this.compiler = compiler;
  }

  /**
   * 🧠 detecta si falta información
   */
  detectMissingInfo(intent) {
    const missing = [];

    if (!intent.payload?.goal) missing.push("goal");
    if (!intent.payload?.trigger) missing.push("trigger");
    if (!intent.payload?.output) missing.push("output");

    return missing;
  }

  /**
   * 💬 genera pregunta contextual
   */
  askQuestion(field) {
    const questions = {
      goal: "¿Qué quieres automatizar exactamente?",
      trigger: "¿Qué debería iniciar este flujo? (tiempo, evento, mensaje, API)",
      output: "¿Qué resultado esperas? (email, reporte, webhook, archivo)"
    };

    return questions[field];
  }

  /**
   * 🧠 construye workflow progresivamente
   */
  async build(intent, userAnswer = null) {
    const missing = this.detectMissingInfo(intent);

    if (missing.length > 0 && !userAnswer) {
      return {
        type: "QUESTION",
        question: this.askQuestion(missing[0]),
        missingField: missing[0],
        partialIntent: intent
      };
    }

    if (userAnswer && intent._pendingField) {
      intent.payload = intent.payload || {};
      intent.payload[intent._pendingField] = userAnswer;
    }

    const stillMissing = this.detectMissingInfo(intent);

    if (stillMissing.length > 0) {
      return {
        type: "QUESTION",
        question: this.askQuestion(stillMissing[0]),
        missingField: stillMissing[0],
        partialIntent: intent
      };
    }

    // 🧠 workflow completo → compilar
    const compiled = this.compiler.compile(intent);

    return {
      type: "WORKFLOW_READY",
      workflow: compiled
    };
  }
}

module.exports = WorkflowDialogEngine;
