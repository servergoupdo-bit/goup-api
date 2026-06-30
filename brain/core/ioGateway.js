/**
 * IO Gateway CORE (v1 - BETA STABLE)
 * ❗ Prohibido instanciar directamente
 */

function createGatewayCore({ policyEngine, eventBus, memory, transport }) {
  return {
    policyEngine,
    eventBus,
    memory,
    transport: transport || null,

    async request({ intent, target, payload = {}, context = {} }) {
      // 1. Policy decision (source of truth)
      const decision =
        this.policyEngine?.evaluate?.({
          intent,
          target,
          payload,
          context
        }) || { allow: false, reason: "NO_POLICY_ENGINE" };

      // 2. Reject path
      if (!decision.allow) {
        this.eventBus?.emit?.("ioGateway.rejected", {
          intent,
          target,
          reason: decision.reason
        });

        return {
          ok: false,
          blocked: true,
          reason: decision.reason
        };
      }

      // 3. Execute (transport layer future)
      if (this.transport?.request) {
        return await this.transport.request({
          intent,
          target,
          payload,
          context
        });
      }

      // 4. Fallback safe response
      return {
        ok: true,
        executed: true,
        mode: "noop",
        intent,
        target
      };
    }
  };
}

module.exports = { createGatewayCore };
