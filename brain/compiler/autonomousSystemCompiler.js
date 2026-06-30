/**
 * autonomousSystemCompiler.js
 * Blueprint v5.1 — Self-Modifying Orchestration Layer
 */

class AutonomousSystemCompiler {
  constructor({ memory, scorer, router, observer }) {
    this.memory = memory;
    this.scorer = scorer;
    this.router = router;
    this.observer = observer;
  }

  /**
   * 🧠 analiza comportamiento global del sistema
   */
  analyzeSystem() {
    const logs = this.memory.getAll();

    const failures = logs.filter(l => l.type === "EXECUTION_FAILURE");
    const successes = logs.filter(l => l.type === "EXECUTION_SUCCESS");

    return {
      failureRate: failures.length / (logs.length || 1),
      successRate: successes.length / (logs.length || 1),
      hotspots: this._detectHotspots(logs)
    };
  }

  /**
   * 🔍 detecta zonas problemáticas del sistema
   */
  _detectHotspots(logs) {
    const map = new Map();

    for (const log of logs) {
      if (!log.intent?.type) continue;

      const key = log.intent.type;

      if (!map.has(key)) {
        map.set(key, { failures: 0, successes: 0 });
      }

      const entry = map.get(key);

      if (log.type === "EXECUTION_FAILURE") entry.failures++;
      if (log.type === "EXECUTION_SUCCESS") entry.successes++;
    }

    return [...map.entries()].map(([type, data]) => ({
      type,
      ...data,
      instability: data.failures / (data.successes + 1)
    }));
  }

  /**
   * 🧠 genera propuesta de mejora estructural
   */
  generatePatch() {
    const analysis = this.analyzeSystem();

    const patches = [];

    for (const hotspot of analysis.hotspots) {
      if (hotspot.instability > 0.5) {
        patches.push({
          type: "ROUTING_ADJUSTMENT",
          target: hotspot.type,
          action: "increase redundancy",
          reason: "high failure ratio detected"
        });
      }

      if (hotspot.failures > hotspot.successes) {
        patches.push({
          type: "SCORING_ADJUSTMENT",
          target: hotspot.type,
          action: "reduce priority weight",
          reason: "low success reliability"
        });
      }
    }

    this.observer?.record?.({
      type: "SYSTEM_PATCH_GENERATED",
      patches
    });

    return {
      analysis,
      patches
    };
  }

  /**
   * ⚙️ aplica cambios controlados (NO destructivo)
   */
  applyPatch(patch) {
    this.memory.add({
      type: "SYSTEM_PATCH_APPLIED",
      patch,
      timestamp: Date.now()
    });

    return {
      success: true,
      applied: patch.type
    };
  }
}

module.exports = AutonomousSystemCompiler;
