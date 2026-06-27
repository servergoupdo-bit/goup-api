// brain/core/eventBus.js

class EventBus {
  constructor() {
    this.listeners = Object.create(null);
    this.history = [];

    // 🔥 límite para evitar crecimiento infinito (8000-ready)
    this.maxHistorySize = 5000;
  }

  on(event, handler) {
    if (typeof handler !== "function") return;

    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(handler);
  }

  emit(event, payload = {}) {
    const eventObject = {
      event,
      payload,
      timestamp: Date.now()
    };

    // =========================
    // OBSERVABILIDAD (8000 CORE)
    // =========================
    this.history.push(eventObject);

    // evitar memory leak
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    const handlers = this.listeners[event] || [];

    for (const handler of handlers) {
      try {
        handler(eventObject);
      } catch (err) {
        console.error("[EventBus handler error]", {
          event,
          message: err.message
        });
      }
    }

    return eventObject;
  }

  getHistory(filterEvent = null) {
    if (!filterEvent) return this.history;
    return this.history.filter(e => e.event === filterEvent);
  }
}

/**
 * =========================
 * 8000-B LEARNING HOOK
 * =========================
 */
function attachLearning(eventBus, decisionLogger) {
  if (!eventBus || typeof eventBus.on !== "function") return;

  eventBus.on("execution_complete", (event) => {
    try {
      const p = event.payload || {};

      if (!decisionLogger?.save) return;

      decisionLogger.save({
        intent: p.intent,
        selected: p.plugin,
        success: p.success,
        executionTime: p.executionTime || 0,
        traceId: p.traceId || null
      });

    } catch (err) {
      console.error("[8000 learning error]", err.message);
    }
  });
}

module.exports = new EventBus();
module.exports.attachLearning = attachLearning;
