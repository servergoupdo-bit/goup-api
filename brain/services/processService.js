/**
 * processService.js
 * Blueprint v2.0 — Process Isolation Layer
 */

const { spawn } = require("child_process");

class ProcessService {
  constructor() {
    this.processes = new Map();
  }

  /**
   * Ejecuta proceso separado (NO bloqueante)
   */
  run(command, args = []) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        stdio: "pipe",
        shell: true,
      });

      const id = Date.now().toString();

      this.processes.set(id, proc);

      let output = "";
      let error = "";

      proc.stdout.on("data", (data) => {
        output += data.toString();
      });

      proc.stderr.on("data", (data) => {
        error += data.toString();
      });

      proc.on("close", (code) => {
        this.processes.delete(id);

        resolve({
          id,
          code,
          output: output.trim(),
          error: error.trim(),
        });
      });

      proc.on("error", (err) => {
        this.processes.delete(id);
        reject(err);
      });
    });
  }

  /**
   * Lista procesos activos
   */
  list() {
    return Array.from(this.processes.keys());
  }

  /**
   * Mata proceso por ID
   */
  kill(id) {
    const proc = this.processes.get(id);
    if (proc) {
      proc.kill();
      this.processes.delete(id);
      return true;
    }
    return false;
  }
}

module.exports = new ProcessService();
