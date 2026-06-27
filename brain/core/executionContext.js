class ExecutionContext {
  constructor() {
    this.store = new Map();
  }

  create(traceId) {
    this.store.set(traceId, {
      traceId,
      data: {},
      steps: []
    });
  }

  get(traceId) {
    return this.store.get(traceId);
  }

  update(traceId, key, value) {
    const ctx = this.store.get(traceId);
    if (!ctx) return;

    ctx.data[key] = value;
  }

  addStep(traceId, step) {
    const ctx = this.store.get(traceId);
    if (!ctx) return;

    ctx.steps.push(step);
  }

  destroy(traceId) {
    this.store.delete(traceId);
  }
}

module.exports = new ExecutionContext();
