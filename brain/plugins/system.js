module.exports = {
  name: "system",

  /**
   * SCORE REAL (7000 COMPATIBLE)
   */
  score(intent) {
    const normalized = (intent || "").toLowerCase();

    let score = 0;

    if (normalized.includes("status")) score += 0.4;
    if (normalized.includes("estado")) score += 0.4;
    if (normalized.includes("system")) score += 0.3;
    if (normalized.includes("sistema")) score += 0.3;

    return score;
  },

  execute({ intent }) {
    const normalized = (intent || "").toLowerCase();

    return {
      ok: true,
      message: "system running",
      services: ["api", "executor", "eventBus", "feedback"],
      intent: normalized
    };
  }
};
