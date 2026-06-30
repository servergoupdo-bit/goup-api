/**
 * telegramOS.js
 * Blueprint v4.9 → IO Gateway Integrated Version (Singleton-safe)
 */

const express = require("express");
const { getIOGateway } = require("../../core/ioGatewaySingleton");

class TelegramOS {
  constructor({ nlol, token, observer }) {
    this.app = express();
    this.app.use(express.json());

    this.nlol = nlol;
    this.token = token;
    this.observer = observer;

    // ✅ SINGLETON IO GATEWAY (no instanciación)
    this.ioGateway = getIOGateway();

    this._registerRoutes();
  }

  async handleRequest(intent, payload, context = {}) {
    return this.ioGateway.request({
      intent,
      target: "telegram",
      payload,
      context
    });
  }

  _registerRoutes() {
    this.app.post("/webhook", async (req, res) => {
      try {
        const result = await this.handleRequest(
          "telegram_message",
          req.body,
          { source: "telegramOS" }
        );

        res.json(result);
      } catch (err) {
        res.status(500).json({
          error: err.message
        });
      }
    });
  }
}

module.exports = TelegramOS;
