/**
 * 🧠 PLANNER v1.1 — entiende intents estructurados del detector
 */
function buildPlan(intentObj) {
  const intent = (intentObj?.intent || "").toLowerCase();
  const raw = (intentObj?.intentRaw || intent).toLowerCase();
  const plan = [];

  // system.status
  if (intent === "system.status" || raw.includes("status") || raw.includes("estado")) {
    plan.push({ step: 1, intent: "system.status", action: "system_status" });
    return plan;
  }

  // system.docker
  if (intent === "system.docker" || raw.includes("docker")) {
    plan.push({ step: 1, intent: "system.docker", action: "docker_status" });
    return plan;
  }

  // system.ping
  if (intent === "system.ping" || raw.includes("ping")) {
    plan.push({ step: 1, intent: "system.ping", action: "ping" });
    return plan;
  }

  // system.workflow
  if (intent === "system.workflow" || raw.includes("n8n") || raw.includes("workflow")) {
    plan.push({ step: 1, intent: "system.workflow", action: "workflow_trigger" });
    return plan;
  }

  // debug
  if (intent.includes("debug") || raw.includes("debug")) {
    plan.push({ step: 1, intent: "debug", action: "debug_run" });
    return plan;
  }

  // echo
  if (intent.includes("echo") || raw.includes("echo")) {
    plan.push({ step: 1, intent: "echo", action: "echo_run" });
    return plan;
  }

  // fallback
  plan.push({ step: 1, intent: "system", action: "fallback" });
  return plan;
}

module.exports = { buildPlan };
