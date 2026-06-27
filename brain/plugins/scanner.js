// brain/plugins/scanner.js

const fs = require("fs");
const path = require("path");

function scanPlugins() {
  const pluginsDir = path.join(__dirname);

  const files = fs.readdirSync(pluginsDir);

  const plugins = {};

  for (const file of files) {

    if (file === "scanner.js") continue;
    if (file === "registry.js") continue;

    const fullPath = path.join(pluginsDir, file);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      plugins[file] = require(fullPath);
    }

    if (file.endsWith(".js")) {
      const name = file.replace(".js", "");
      plugins[name] = require(fullPath);
    }
  }

  return plugins;
}

module.exports = { scanPlugins };
