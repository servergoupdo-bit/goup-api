/**
 * metaCognitiveGovernor.js
 * Blueprint v5.2 — Self-Governance Layer
 */

class MetaCognitiveGovernor {
  constructor({ memory, observer }) {
    this.memory = memory;
    this.observer = observer;

    // reglas base de estabilidad del sistema
    this.policies = {
      maxFailureRate: 0.4,
      allowSelfModification: true,
      allowRoutingChanges: true,
      allowScoringDrift: false
    };
  }

  /**
   * 🧠 evalúa propuesta de cambio del sistema
   */
  evaluate(proposal) {
    const risk = this._assessRisk(proposal);
    const allowed = this._applyPolicies(proposal, risk);

    const decision = {
      approved: allowed,
      risk,
      reason: allowed ? "APPROVED_BY_GOVERNOR" : "REJECTED_BY_POLICY"
    };

    this.memory.add({
      type: "GOVERNANCE_DECISION",
      proposal,
      decision,
      timestamp: Date.now()
    });

    return decision;
  }

  /**
   * ⚖️ evaluación de riesgo estructural
   */
  _assessRisk(proposal) {
    let risk = 0;

    if (proposal.type === "ROUTING_ADJUSTMENT") risk += 0.2;
    if (proposal.type === "SCORING_ADJUSTMENT") risk += 0.5;
    if (proposal.type === "SYSTEM_REWRITE") risk += 0.8;

    if (proposal.action?.includes("increase complexity")) risk += 0.2;
    if (proposal.action?.includes("reduce stability")) risk += 0.4;

    return Math.min(risk, 1);
  }

  /**
   * 🧱 aplicación de políticas globales
   */
  _applyPolicies(proposal, risk) {
    if (risk > 0.7) return false;

    if (proposal.type === "SCORING_ADJUSTMENT" &&
        !this.policies.allowScoringDrift) {
      return false;
    }

    if (!this.policies.allowSelfModification &&
        proposal.type === "SYSTEM_REWRITE") {
      return false;
    }

    return true;
  }

  /**
   * 🔁 actualización de políticas internas (meta-evolución controlada)
   */
  updatePolicies(newPolicies) {
    this.policies = {
      ...this.policies,
      ...newPolicies
    };

    this.memory.add({
      type: "GOVERNANCE_POLICY_UPDATE",
      policies: this.policies
    });

    return this.policies;
  }

  /**
   * 📊 estado del sistema de gobernanza
   */
  status() {
    return {
      policies: this.policies,
      memoryEvents: this.memory.getAll()
        .filter(e => e.type.startsWith("GOVERNANCE"))
        .length
    };
  }
}

module.exports = MetaCognitiveGovernor;
