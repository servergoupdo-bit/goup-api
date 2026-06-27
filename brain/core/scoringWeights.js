
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../scoring-weights.json");

/**
 * 🧠 AUTO-OPTIMIZING SCORING WEIGHTS (9600)
 */

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

function getWeights() {
  return load();
}

function getPluginWeight(plugin) {
  const db = load();
  return db[plugin]?.weight ?? 1;
}

function updatePluginWeight(plugin, success) {
  const db = load();

  if (!db[plugin]) {
    db[plugin] = {
      weight: 1,
      success: 0,
      total: 0
    };
  }

  db[plugin].total += 1;

  if (success) {
    db[plugin].success += 1;
    db[plugin].weight += 0.1;
  } else {
    db[plugin].weight -= 0.05;
  }

  // clamp
  if (db[plugin].weight < 0.1) db[plugin].weight = 0.1;
  if (db[plugin].weight > 5) db[plugin].weight = 5;

  save(db);
}

module.exports = {
  getWeights,
  getPluginWeight,
  updatePluginWeight
};
