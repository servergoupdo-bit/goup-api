const memory = require("../memory/memoryStore");

class IntentKernel {
  constructor(bridge, options = {}) {
    this.bridge = bridge;

    // 🧠 adaptive behavior
    this.strictMode = options.strictMode || false;

    // 🧠 learning memory
    this.patternMemory = options.patternMemory || {};

    // 🧠 emergent structure map
    this.structureMap = options.structureMap || {};

    // 🧠 simulation layer
    this.simulationEngine = options.simulationEngine || null;

    // 🧠 planning layer (recursive cognition)
    this.planningEngine = options.planningEngine || null;
  }

  /**
   * 🧠 SINGLE ENTRY POINT (DECISION GATE)
   */
  async handle(input) {
    const intent = this._classify(input);

    const traceId = Date.now().toString();

    memory.add({
      type: "INTENT",
      traceId,
      input,
      intent
    });

    // 🧠 DECISION LOGIC CORE
    const mode = this._decideMode(intent);

    let result;

    switch (mode) {
      case "DIRECT":
        result = await this._executeDirect(intent);
        break;

      case "SIMULATE":
        result = await this._executeSimulated(intent);
        break;

      case "PLAN":
        result = await this._executePlanned(intent);
        break;

      default:
        result = await this._executeDirect(intent);
    }

    memory.add({
      type: "RESULT",
      traceId,
      intent,
      result
    });

    return result;
  }

  /**
   * 🧠 DECIDE EXECUTION MODE
   */
  _decideMode(intent) {
    // 🔥 si hay planning engine → usar planificación para acciones complejas
    if (this.planningEngine && intent.type === "RUN_COMMAND") {
      return "PLAN";
    }

    // 🧠 si hay simulation engine → usar simulación en operaciones sensibles
    if (this.simulationEngine && intent.type === "SYSTEM_CHECK") {
      return "SIMULATE";
    }

    // ⚙️ fallback
    return "DIRECT";
  }

  /**
   * ⚡ ejecución directa
   */
  async _executeDirect(intent) {
    return this.bridge.executeIntent(intent);
  }

  /**
   * 🧪 ejecución simulada
   */
  async _executeSimulated(intent) {
    const simulations = await this.simulationEngine.evaluateOptions([
      intent
    ]);

    const best = simulations[0];

    return this.bridge.executeIntent(best.intent);
  }

  /**
   * 🧠 planificación recursiva
   */
  async _executePlanned(intent) {
    const plans = await this.planningEngine.evaluate(intent);

    const bestPlan = plans[0];

    let lastResult;

    for (const step of bestPlan.plan) {
      lastResult = await this.bridge.executeIntent(step);
    }

    return {
      plan: bestPlan,
      result: lastResult
    };
  }

  /**
   * 🧠 CLASSIFIER (estable + emergente)
   */
  _classify(input) {
    if (!input || typeof input !== "string") {
      return { type: "ERROR", payload: { reason: "INVALID_INPUT" } };
    }

    const normalized = input.toLowerCase();

    if (normalized.includes("status") || normalized.includes("system")) {
      return { type: "SYSTEM_CHECK", payload: {} };
    }

    if (
      normalized.includes("ls") ||
      normalized.includes("files") ||
      normalized.includes("dir")
    ) {
      return { type: "LIST_FILES", payload: { path: "." } };
    }

    if (normalized.startsWith("run ")) {
      return {
        type: "RUN_COMMAND",
        payload: { command: input.slice(4) }
      };
    }

    if (this.strictMode) {
      return {
        type: "UNKNOWN_STRICT",
        payload: { raw: input }
      };
    }

    return {
      type: "UNKNOWN",
      payload: { raw: input }
    };
  }

  /**
   * 🧠 actualización externa (learning + emergence + planning)
   */
  updateContext({ strictMode, patternMemory, structureMap }) {
    if (typeof strictMode === "boolean") {
      this.strictMode = strictMode;
    }

    if (patternMemory) {
      this.patternMemory = patternMemory;
    }

    if (structureMap) {
      this.structureMap = structureMap;
    }
  }
}

module.exports = IntentKernel;
