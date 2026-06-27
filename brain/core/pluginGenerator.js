const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../plugin-proposals.json");

/**
 * 🧠 10000 — AUTO PLUGIN GENERATOR (CONTROLLED)
 * Genera propuestas, no ejecuta código automáticamente
 */

function load() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

/**
 * Detecta necesidad de nuevo plugin
 */
function proposePlugin(intent, context = {}) {
  const proposals = load();

  const exists = proposals.find(p => p.intent === intent);

  if (exists) return exists;

  const proposal = {
    intent,
    createdAt: Date.now(),

    // estructura base del plugin sugerido
    template: `
module.exports = {
  name: "${intent}",

  execute({ intent }) {
    return {
      ok: true,
      intent,
      message: "auto-generated plugin placeholder"
    };
  }
};
    `.trim(),

    analysis: {
      usageHint: context.usage || 0,
      successRate: context.successRate || 0
    },

    status: "proposed" // proposed | reviewed | accepted
  };

  proposals.push(proposal);
  save(proposals);

  return proposal;
}

/**
 * Detecta gaps del sistema
 */
function analyzeMissingPlugins(intentStats = []) {
  const missing = [];

  for (const stat of intentStats) {
    if (stat.successRate < 0.3 && stat.total > 3) {
      missing.push(stat.intent);
    }
  }

  return missing;
}

module.exports = {
  proposePlugin,
  analyzeMissingPlugins
};
