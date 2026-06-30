/**
 * filesystemService.js
 * Blueprint v2.0 — File System Layer
 * Aislado del kernel
 */

const fs = require("fs").promises;

class FileSystemService {
  constructor() {
    this.basePath = process.cwd();
  }

  /**
   * Leer archivo
   */
  async readFile(path) {
    const fullPath = `${this.basePath}/${path}`;
    const data = await fs.readFile(fullPath, "utf-8");
    return data;
  }

  /**
   * Escribir archivo
   */
  async writeFile(path, content) {
    const fullPath = `${this.basePath}/${path}`;
    await fs.writeFile(fullPath, content, "utf-8");
    return { success: true, path: fullPath };
  }

  /**
   * Listar directorio
   */
  async listDir(path = ".") {
    const fullPath = `${this.basePath}/${path}`;
    const files = await fs.readdir(fullPath);
    return files;
  }

  /**
   * Verifica existencia
   */
  async exists(path) {
    try {
      await fs.access(`${this.basePath}/${path}`);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = new FileSystemService();
