const memory = require("../memory/memoryStore");

class LearningEngine {
  constructor(kernel) {
    this.kernel = kernel;
  }

  /**
   * Analiza comportamiento completo del sistema
   */
  analyze() {
    const patterns = memory.detectPatterns();
    const successRate = memory.successRate();
    const last = memory.last(10);

    return {
      patterns,
      successRate,
      last
    };
  }

  /**
   * 🔥 AUTONOMÍA REAL: ajusta comportamiento del kernel
   */
  adapt() {
    const analysis = this.analyze();

    // 🧠 Regla 1: si falla mucho → más conservador
    if (analysis.successRate < 0.4) {
      this.kernel.strictMode = true;
    }

    // 🧠 Regla 2: si sistema es estable → más flexible
    if (analysis.successRate > 0.8) {
      this.kernel.strictMode = false;
    }

    // 🧠 Regla 3: patrones dominantes afectan clasificación futura
    this.kernel.patternMemory = analysis.patterns;

    return {
      success: true,
      adaptation: {
        strictMode: this.kernel.strictMode,
        patterns: analysis.patterns,
        successRate: analysis.successRate
      }
    };
  }
}

module.exports = LearningEngine;
