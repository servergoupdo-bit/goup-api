const { getIOGateway } = require("../core/ioGatewaySingleton");

/**
 * n8nService.js
 * Blueprint v3.2 → IO Gateway Controlled Version (Singleton-safe)
 */

class N8NService {
  constructor({ baseUrl, apiKey }) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;

    // ✅ SINGLETON IO GATEWAY (global kernel boundary)
    this.ioGateway = getIOGateway();
  }

  /**
   * 🔁 ejecuta workflow existente (GOVERNED)
   */
  async executeWorkflow(workflowId, data = {}) {
    try {
      const targetUrl = `${this.baseUrl}/webhook/${workflowId}`;

      const result = await this.ioGateway.request({
        intent: "n8n_execute_workflow",
        target: targetUrl,
        payload: data,
        context: {
          service: "n8nService"
        }
      });

      return result;

    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * 📊 health check del servicio
   */
  async health() {
    return this.ioGateway.request({
      intent: "n8n_health_check",
      target: `${this.baseUrl}/health`,
      payload: {},
      context: {
        service: "n8nService"
      }
    });
  }
}

module.exports = N8NService;
