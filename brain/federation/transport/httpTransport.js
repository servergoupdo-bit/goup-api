const { getIOGateway } = require("../../core/ioGatewaySingleton");

/**
 * HTTP Transport Layer
 * Consumo puro del Kernel IO Gateway
 */

class HttpTransport {
  constructor({ policyEngine, eventBus, memory }) {
    this.policyEngine = policyEngine;
    this.eventBus = eventBus;
    this.memory = memory;

    // ✅ SINGLE SOURCE OF TRUTH (Kernel IO)
    this.ioGateway = getIOGateway();
  }

  async request({ url, method = "GET", data = {}, context = {} }) {
    return this.ioGateway.request({
      intent: "http_transport_request",
      target: url,
      payload: {
        method,
        data
      },
      context: {
        ...context,
        transport: "http"
      }
    });
  }
}

module.exports = HttpTransport;
