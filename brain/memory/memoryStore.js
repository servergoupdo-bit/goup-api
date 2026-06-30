/**
 * memoryStore.js
 * Blueprint v2.2 — Evolutionary Memory Layer
 */

class MemoryStore {
  constructor() {
    this.memories = [];
  }

  add(entry) {
    const record = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...entry
    };

    this.memories.push(record);
    return record;
  }

  getAll() {
    return this.memories;
  }

  findByType(type) {
    return this.memories.filter(m => m.type === type);
  }

  last(n = 10) {
    return this.memories.slice(-n);
  }

  /**
   * 🔥 NUEVO: Detecta patrones de intents repetidos
   */
  detectPatterns() {
    const intents = this.memories.filter(m => m.type === "INTENT");

    const map = {};

    for (const i of intents) {
      const key = i.intent?.type || "UNKNOWN";
      map[key] = (map[key] || 0) + 1;
    }

    return map;
  }

  /**
   * 🔥 NUEVO: Evalúa frecuencia de errores vs éxito
   */
  successRate() {
    const results = this.memories.filter(m => m.type === "RESULT");

    const success = results.filter(r =>
      r.result && r.result.success === true
    ).length;

    return results.length === 0
      ? 1
      : success / results.length;
  }
}

module.exports = new MemoryStore();
