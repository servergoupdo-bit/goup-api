/**
 * systemIdentity.js
 * Blueprint v5.3 — System Identity Layer
 */

class SystemIdentity {
  constructor({ memory }) {
    this.memory = memory;

    /**
     * 🧭 identidad central del sistema
     */
    this.identity = {
      name: "GoUP Cognitive OS",
      version: "v5.x",

      purpose: [
        "orchestrate distributed automation systems",
        "translate natural language into executable workflows",
        "optimize execution reliability and cost"
      ],

      principles: [
        "stability over novelty",
        "traceability over autonomy",
        "controlled evolution over unrestricted mutation",
        "human-in-the-loop precedence",
        "fail-safe execution first"
      ],

      constraints: [
        "never execute destructive actions without validation",
        "never self-modify without governance approval",
        "never bypass memory logging",
        "never override human decision signals"
      ]
    };
  }

  /**
   * 🧠 consulta de identidad global
   */
  getIdentity() {
    return this.identity;
  }

  /**
   * ⚖️ validación de acción contra identidad
   */
  validateAction(action) {
    const violations = [];

    for (const rule of this.identity.constraints) {
      if (this._violates(rule, action)) {
        violations.push(rule);
      }
    }

    return {
      allowed: violations.length === 0,
      violations
    };
  }

  /**
   * 🔍 verificación simple de violaciones
   */
  _violates(rule, action) {
    const text = JSON.stringify(action).toLowerCase();
    return text.includes("delete") && rule.includes("destructive")
      || text.includes("override") && rule.includes("override");
  }

  /**
   * 🧭 evolución controlada de identidad (solo vía governance)
   */
  evolveIdentity(changeRequest) {
    this.memory.add({
      type: "IDENTITY_CHANGE_REQUEST",
      changeRequest,
      timestamp: Date.now()
    });

    return {
      status: "PENDING_GOVERNANCE_APPROVAL"
    };
  }
}

module.exports = SystemIdentity;
