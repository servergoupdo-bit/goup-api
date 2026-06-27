const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../global-memory.json");

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

/**
 * 🧠 Registra ejecución global
 */
function recordExecution(entry) {
  const memory = load();

  const key = entry.intent || "unknown";

  if (!memory[key]) {
    memory[key] = {
      total: 0,
      success: 0,
      failures: 0,
      lastPlugin: null
    };
  }

  memory[key].total++;

  if (entry.success) {
    memory[key].success++;
  } else {
    memory[key].failures++;
  }

  memory[key].lastPlugin = entry.plugin;

  save(memory);
}

/**
 * 🧠 Insight global para scoring
 */
function getGlobalInsight(intent) {
  const memory = load();
  return memory[intent] || {
    total: 0,
    success: 0,
    failures: 0,
    lastPlugin: null
  };
}

module.exports = {
  recordExecution,
  getGlobalInsight
};
