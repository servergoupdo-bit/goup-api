const memory = require("../memory/memoryStore");

/**
 * metaOrchestrator.js
 * Blueprint v2.5 — System-Level Controller
 */

class MetaOrchestrator {
  constructor({ kernel, workflow, structureEngine }) {
    this.kernel = kernel;
    this.workflow = workflow;
    this.structureEngine = structureEngine;

    this.config = {
      routingMode: "balanced", // balanced | strict | adaptive
      disabledRoutes: new Set()
    };
  }

  /**
   * Analiza sistema completo y decide reconfiguración
   */
  evaluate() {
    const map = this.structureEngine.buildMap();

    const decisions = [];

    for (const [type, data] of Object.entries(map)) {
      // 🔴 ruta problemática → desactivar parcial
      if (data.efficiency < 0.3) {
        this.config.disabledRoutes.add(type);

        decisions.push({
          type,
          action: "DISABLE_ROUTE",
          reason: "low efficiency",
          efficiency: data.efficiency
        });
      }

      // 🟡 ruta inestable → modo estricto
      if (data.efficiency >= 0.3 && data.efficiency < 0.7) {
        decisions.push({
          type,
          action: "RESTRICT_ROUTE",
          reason: "unstable efficiency",
          efficiency: data.efficiency
        });
      }

      // 🟢 ruta óptima → priorizar
      if (data.efficiency >= 0.7) {
        decisions.push({
          type,
          action: "PRIORITIZE_ROUTE",
          reason: "high efficiency",
          efficiency: data.efficiency
        });
      }
    }

    return { map, decisions };
  }

  /**
   * Aplica cambios globales al sistema
   */
  apply() {
    const { map, decisions } = this.evaluate();

    // 🧠 1. actualizar estructura del kernel
    this.kernel.updateContext({
      structureMap: map
    });

    // 🧠 2. ajustar modo global del kernel
    const avgEfficiency =
      Object.values(map).reduce((a, b) => a + b.efficiency, 0) /
      Object.keys(map).length;

    if (avgEfficiency < 0.4) {
      this.kernel.strictMode = true;
      this.config.routingMode = "strict";
    } else if (avgEfficiency > 0.8) {
      this.kernel.strictMode = false;
      this.config.routingMode = "adaptive";
    } else {
      this.config.routingMode = "balanced";
    }

    // 🧠 3. log de evolución
    memory.add({
      type: "META_ORCHESTRATION",
      map,
      decisions,
      config: this.config
    });

    return {
      success: true,
      config: this.config,
      decisions
    };
  }

  /**
   * Estado del sistema
   */
  status() {
    return {
      config: this.config,
      disabledRoutes: Array.from(this.config.disabledRoutes)
    };
  }
}

module.exports = MetaOrchestrator;
