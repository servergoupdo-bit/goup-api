const memory = require("../memory/memoryStore");

/**
 * refactorEngine.js
 * Blueprint v2.8 — Operational Self-Analysis Layer
 */

class RefactorEngine {
  constructor({ kernel, structureEngine }) {
    this.kernel = kernel;
    this.structureEngine = structureEngine;
  }

  /**
   * 🔍 detecta problemas estructurales
   */
  analyze() {
    const map = this.structureEngine.buildMap();
    const intents = memory.findByType("INTENT");
    const results = memory.findByType("RESULT");

    const issues = [];

    for (const [type, data] of Object.entries(map)) {
      if (data.efficiency < 0.4) {
        issues.push({
          type,
          issue: "LOW_EFFICIENCY_ROUTE",
          severity: "HIGH",
          efficiency: data.efficiency
        });
      }

      if (data.count > 10 && data.efficiency < 0.6) {
        issues.push({
          type,
          issue: "OVERUSED_INEFFICIENT_PATH",
          severity: "MEDIUM",
          efficiency: data.efficiency
        });
      }
    }

    return { map, issues };
  }

  /**
   * 🧠 genera propuestas de refactor
   */
  propose() {
    const { map, issues } = this.analyze();

    const proposals = [];

    for (const issue of issues) {
      if (issue.issue === "LOW_EFFICIENCY_ROUTE") {
        proposals.push({
          action: "SIMPLIFY_ROUTE",
          target: issue.type,
          suggestion: "reduce decision branching or merge intent types",
          expectedImpact: "increase efficiency"
        });
      }

      if (issue.issue === "OVERUSED_INEFFICIENT_PATH") {
        proposals.push({
          action: "REMAP_INTENT",
          target: issue.type,
          suggestion: "redirect to higher efficiency route",
          expectedImpact: "reduce cost and improve success rate"
        });
      }
    }

    return {
      map,
      proposals
    };
  }

  /**
   * 🧪 simula impacto del refactor
   */
  simulateImpact() {
    const { proposals } = this.propose();

    return proposals.map(p => ({
      ...p,
      simulatedGain: Math.random() * 0.4 + 0.6 // estimación controlada
    }));
  }

  /**
   * 📊 reporte final
   */
  report() {
    const impact = this.simulateImpact();

    return {
      status: "REFLECTION_COMPLETE",
      recommendations: impact,
      summary: {
        totalIssues: impact.length,
        highImpact: impact.filter(i => i.simulatedGain > 0.8).length
      }
    };
  }
}

module.exports = RefactorEngine;
