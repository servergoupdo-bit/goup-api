module.exports = function system(intent) {

  switch (intent) {

    case "system.status":
      return {
        status: "running",
        cpu: "45%",
        ram: "60%"
      };

    case "system.ping":
      return "pong";

    case "system.docker":
      return {
        containers: 5,
        status: "ok"
      };

    case "system.workflow":
      return {
        n8n: "active"
      };

    default:
      return {
        error: "unknown intent",
        received: intent
      };
  }
};
