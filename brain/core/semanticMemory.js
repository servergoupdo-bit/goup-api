const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../semantic-memory.json");

/**
 * 🧠 9700 — SEMANTIC MEMORY LAYER
 * Normaliza intents a "conceptos"
 */

const INTENT_MAP = {
  system_status: [
    "status",
    "estado",
    "estado del sistema",
    "system",
    "health",
    "health check",
    "sistema"
  ],

  debug: [
    "debug",
    "test debug",
    "debug test"
  ],

  echo: [
    "echo",
    "repeat",
    "repite"
  ]
};

function normalize(intent) {
  const input = (intent || "").toLowerCase().trim();

  for (const [key, values] of Object.entries(INTENT_MAP)) {
    if (values.some(v => input.includes(v))) {
      return key;
    }
  }

  return "unknown";
}

function load() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function recordSemantic(intentRaw, plugin, success) {
  const db = load();

  const intent = normalize(intentRaw);

  if (!db[intent]) {
    db[intent] = {
      total: 0,
      success: 0,
      plugins: {}
    };
  }

  db[intent].total++;

  if (success) db[intent].success++;

  if (!db[intent].plugins[plugin]) {
    db[intent].plugins[plugin] = { used: 0, success: 0 };
  }

  db[intent].plugins[plugin].used++;

  if (success) db[intent].plugins[plugin].success++;

  save(db);
}

function getSemanticInsight(intentRaw) {
  const db = load();
  const intent = normalize(intentRaw);

  const data = db[intent];

  if (!data) {
    return {
      exists: false,
      intent,
      successRate: 0
    };
  }

  const bestPlugin =
    Object.entries(data.plugins)
      .sort((a, b) => b[1].success - a[1].success)[0]?.[0] || null;

  return {
    exists: true,
    intent,
    total: data.total,
    successRate: data.success / data.total,
    bestPlugin
  };
}

module.exports = {
  normalize,
  recordSemantic,
  getSemanticInsight
};
