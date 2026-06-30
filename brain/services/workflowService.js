/**
 * workflowService.js
 * Blueprint v2.0 — Orchestration Layer (Robust)
 */

class WorkflowService {
  constructor(services = {}) {
    this.host = services.host;
    this.fs = services.fs;
    this.process = services.process;
    this.git = services.git;

    // Validación defensiva (evita crashes silenciosos)
    this._validateServices();
  }

  /**
   * Valida que los servicios críticos existan
   */
  _validateServices() {
    const required = ["host", "fs", "process", "git"];

    for (const key of required) {
      if (!this[key]) {
        throw new Error(
          `WorkflowService missing dependency: ${key}`
        );
      }
    }
  }

  /**
   * Ejecuta workflow básico de diagnóstico del sistema
   */
  async systemCheck() {
    try {
      const result = {};

      result.files = await this.fs.listDir(".");
      result.gitStatus = await this.git.status();
      result.processes = this.process.list();

      return {
        success: true,
        data: result
      };

    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message,
          stack: error.stack
        }
      };
    }
  }

  /**
   * Ejecuta comando seguro del sistema (host layer)
   */
  async execSafe(command) {
    try {
      if (!command) {
        throw new Error("Command is required");
      }

      return await this.host.runCommand(command);

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ejecuta proceso aislado
   */
  async runProcess(command) {
    try {
      if (!command) {
        throw new Error("Command is required");
      }

      return await this.process.run(command);

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Acceso directo al filesystem (seguro)
   */
  async listFiles(path = ".") {
    try {
      return await this.fs.listDir(path);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Estado Git
   */
  async gitStatus() {
    try {
      return await this.git.status();
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = WorkflowService;
