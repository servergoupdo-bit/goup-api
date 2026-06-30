const memory = require("../memory/memoryStore");

/**
 * planningEngine.js
 * Blueprint v2.7 — Recursive Planning System
 */

class PlanningEngine {
  constructor(simulationEngine) {
    this.simulationEngine = simulationEngine;
  }

  /**
   * genera posibles planes (secuencias de intents)
   */
  generatePlans(intent) {
    return [
      [intent],
      [
        intent,
        { ...intent, meta: "step_2_variation" }
      ],
      [
        intent,
        { type: "SYSTEM_CHECK", payload: {} },
        intent
      ]
    ];
  }

  /**
   * simula un plan completo (multi-step)
   */
  async simulatePlan(plan) {
    let score = 0;
    let cost = 0;
    let confidence = 1;

    for (const step of plan) {
      const sim = await this.simulationEngine.simulate(step);

      score += sim.simulatedResult.confidence;
      cost += sim.simulatedResult.cost;

      confidence *= sim.simulatedResult.confidence;
    }

    return {
      plan,
      score,
      cost,
      confidence: confidence / plan.length
    };
  }

  /**
   * evalúa múltiples planes
   */
  async evaluate(intent) {
    const plans = this.generatePlans(intent);

    const simulations = [];

    for (const plan of plans) {
      const result = await this.simulatePlan(plan);
      simulations.push(result);
    }

    // 🧠 mejor plan = mayor score - costo
    simulations.sort((a, b) =>
      (b.score - b.cost) - (a.score - a.cost)
    );

    return simulations;
  }
}

module.exports = PlanningEngine;
