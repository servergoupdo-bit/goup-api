const fs = require("fs");
const path = require("path");

const PLUGINS_DIR = __dirname;

let plugins = {};

/**
 * 🔥 AUTO-DISCOVERY REAL DE PLUGINS
 */
function loadPlugins() {
  const files = fs.readdirSync(PLUGINS_DIR);

  plugins = {};

  for (const file of files) {

    if (!file.endsWith(".js")) continue;
    if (file === "registry.js") continue;

    const pluginPath = path.join(PLUGINS_DIR, file);

    try {
      const plugin = require(pluginPath);

      if (plugin && plugin.name) {
        plugins[plugin.name] = plugin;
      }

    } catch (err) {
      console.error("[PLUGIN LOAD ERROR]", file, err.message);
    }
  }

  return plugins;
}

/**
 * Obtener plugin
 */
function getPlugin(name) {
  return plugins[name] || null;
}

/**
 * Listar plugins activos
 */
function listPlugins() {
  return Object.keys(plugins);
}

/**
 * 🔥 Inicializar sistema
 */
loadPlugins();

module.exports = {
  getPlugin,
  listPlugins,
  loadPlugins
};
