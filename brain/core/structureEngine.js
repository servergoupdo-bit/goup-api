const memory = require("../memory/memoryStore");

/**
 * structureEngine.js
 * Blueprint v2.4 — Emergent Decision Structure
 */

class StructureEngine {
  constructor(kernel) {
    this.kernel = kernel;
  }

  /**
   * Construye mapa estructural del sistema
   */
  buildMap() {
    const intents = memory.findByType("INTENT");
    const results = memory.findByType("RESULT");

    const map = {};

    for (let i = 0; i < intents.length; i++) {
      const intent = intents[i];
      const result = results.find(r => r.traceId === intent.traceId);

      if (!intent || !result) continue;

      const type = intent.intent?.type || "UNKNOWN";

      if (!map[type]) {
        map[type] = {
          count: 0,
          success: 0
        };
      }

      map[type].count++;

      if (result.result?.success !== false) {
        map[type].success++;
      }
    }

    // calcular eficiencia
    for (const key of Object.keys(map)) {
      map[key].efficiency =
        map[key].count === 0
          ? 0
          : map[key].success / map[key].count;
    }

    return map;
  }

  /**
   * genera recomendaciones estructurales
   */
  recommend() {
    const map = this.buildMap();

    const recommendations = [];

    for (const [type, data] of Object.entries(map)) {
      if (data.efficiency < 0.5) {
        recommendations.push({
          type,
          action: "OPTIMIZE_ROUTE",
          reason: "low efficiency",
          efficiency: data.efficiency
        });
      }

      if (data.count > 3 && data.efficiency > 0.8) {
        recommendations.push({
          type,
          action: "PRIORITIZE_ROUTE",
          reason: "high efficiency",
          efficiency: data.efficiency
        });
      }
    }

    return {
      map,
      recommendations
    };
  }

  /**
   * aplica cambios al kernel (estructura emergente)
   */
  evolveKernel() {
    const { map } = this.recommend();

    this.kernel.structureMap = map;

    return {
      evolved: true,
      structureMap: map
    };
  }
}

module.exports = StructureEngine;
