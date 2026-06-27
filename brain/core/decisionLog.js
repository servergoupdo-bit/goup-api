const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../decision-log.json");

function load() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function save(entry) {
  const data = load();

  data.push({
    timestamp: Date.now(),
    intent: entry.intent,
    selected: entry.selected,
    score: entry.score,
    alternatives: entry.alternatives || [],
    executionTime: entry.executionTime,
    success: entry.success
  });

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = { save, load };
