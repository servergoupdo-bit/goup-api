/**
 * hostService.js
 * Blueprint v2.0 — System OS Layer (Isolated)
 * NO DEPENDE DEL KERNEL
 */

const { exec } = require("child_process");

class HostService {
  constructor() {
    this.safeMode = true; // evita ejecución peligrosa por defecto
  }

  /**
   * Ejecuta comando del sistema de forma controlada
   */
  runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      if (this.safeMode && this.isDangerous(command)) {
        return reject({
          error: "Blocked by SafeMode",
          command,
        });
      }

      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          return reject({ error, stderr });
        }
        resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      });
    });
  }

  /**
   * Detecta comandos peligrosos básicos
   */
  isDangerous(command) {
    const blacklist = [
      "rm -rf",
      "mkfs",
      ":(){",
      "shutdown",
      "reboot",
      "dd if=",
      "chmod 777 /",
    ];

    return blacklist.some((pattern) =>
      command.includes(pattern)
    );
  }

  /**
   * Activa/desactiva modo seguro
   */
  setSafeMode(value) {
    this.safeMode = value;
  }
}

module.exports = new HostService();
