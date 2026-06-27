/**
 * 🧠 BASE AGENT
 * Contrato común para todos los agentes del sistema
 */

class BaseAgent {
  constructor(name, eventBus) {
    this.name = name;
    this.eventBus = eventBus;
  }

  log(event, payload) {
    this.eventBus.emit(event, {
      agent: this.name,
      payload,
      timestamp: Date.now()
    });
  }

  on(event, handler) {
    this.eventBus.on(event, handler);
  }
}

module.exports = BaseAgent;
