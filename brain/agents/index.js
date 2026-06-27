const LogAgent = require("./logAgent");
const LearningAgent = require("./learningAgent");
const MetaAgentBridge = require("./metaAgentBridge");

/**
 * 🧠 AGENT REGISTRY BOOT
 */

function initAgents(eventBus) {
  const agents = [
    new LogAgent("logAgent", eventBus),
    new LearningAgent("learningAgent", eventBus),
    new MetaAgentBridge("metaAgent", eventBus)
  ];

  for (const agent of agents) {
    agent.init();
  }

  return agents;
}

module.exports = {
  initAgents
};
