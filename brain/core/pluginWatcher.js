// brain/core/pluginWatcher.js

const chokidar = require("chokidar");
const path = require("path");

const registry = require("../plugins/registry");

/**
 * HOT PLUGIN REGISTRY
 * detecta cambios en /plugins en tiempo real
 */

function startPluginWatcher() {

  const pluginsPath = path.join(__dirname, "../plugins");

  const watcher = chokidar.watch(pluginsPath, {
    persistent: true,
    ignoreInitial: false
  });

  watcher.on("add", (file) => {
    console.log("[PLUGIN ADDED]", file);
    reloadRegistry();
  });

  watcher.on("change", (file) => {
    console.log("[PLUGIN UPDATED]", file);
    reloadRegistry();
  });

  watcher.on("unlink", (file) => {
    console.log("[PLUGIN REMOVED]", file);
    reloadRegistry();
  });
}

/**
 * fuerza reload del registry (cache-bypass)
 */
function reloadRegistry() {
  Object.keys(require.cache).forEach((key) => {
    if (key.includes("/plugins/")) {
      delete require.cache[key];
    }
  });

  console.log("[REGISTRY] hot-reloaded");
}

module.exports = {
  startPluginWatcher
};
