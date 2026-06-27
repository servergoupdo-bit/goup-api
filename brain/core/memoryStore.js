const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../memory-store.json");

/**
 * Cargar memoria
 */
function loadMemory() {
  try {
    if (!fs.existsSync(FILE)) return [];

    const raw = fs.readFileSync(FILE, "utf8");
    if (!raw) return [];

    return JSON.parse(raw);
  } catch (err) {
    console.error("[MEMORY LOAD ERROR]", err.message);
    return [];
  }
}

/**
 * Guardar experiencia
 */
function saveMemory(entry = {}) {
  try {
    const data = loadMemory();

    const record = {
      timestamp: Date.now(),
      intent: entry.intent ?? null,
      plugin: entry.plugin ?? null,
      success: entry.success ?? false,
      raw: entry.raw ?? null
    };

    data.push(record);

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[MEMORY SAVE ERROR]", err.message);
  }
}

/**
 * 📊 MEMORIA INTELIGENTE (NUEVO 7000)
 * Devuelve estadísticas útiles
 */
function getMemoryInsights(intent) {
  const data = loadMemory();

  const filtered = data.filter(m => m.intent === intent);

  return {
    total: filtered.length,
    successRate:
      filtered.length === 0
        ? 0
        : filtered.filter(f => f.success).length / filtered.length,
    lastUsed:
      filtered.length > 0
        ? filtered[filtered.length - 1].timestamp
        : null
  };
}

module.exports = {
  loadMemory,
  saveMemory,
  getMemoryInsights
};
