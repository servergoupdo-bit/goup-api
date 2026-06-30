const fs = require("fs");
const path = require("path");

class IOKernelGuardian {
  constructor({ eventBus, mode = "observe" }) {
    this.eventBus = eventBus;
    this.mode = mode;
    this.violations = [];
  }

  // ==============================
  // IGNORADOS (CRÍTICO)
  // ==============================
  _isIgnored(filePath) {
    const ignoredPatterns = [
      "_archive",
      ".bak.js",
      ".save",
      ".swp",
      "node_modules"
    ];

    return ignoredPatterns.some(p => filePath.includes(p));
  }

  // ==============================
  // SCAN DEL SISTEMA
  // ==============================
  scanSourceTree(rootDir = "./brain") {
    const results = [];

    const walk = (dir) => {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const fullPath = path.join(dir, file);

        if (this._isIgnored(fullPath)) continue;

        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (file.endsWith(".js")) {
          const content = fs.readFileSync(fullPath, "utf-8");

          if (this._detectViolation(content)) {
            const violation = {
              file: fullPath,
              type: "IO_VIOLATION",
              severity: "critical",
              timestamp: Date.now()
            };

            results.push(violation);
            this._report(violation);
          }
        }
      }
    };

    walk(rootDir);

    this.violations = results;

    this._emit("ioKernelGuardian.scan.complete", {
      violations: results.length
    });

    return results;
  }

  // ==============================
  // DETECCIÓN (runtime only)
  // ==============================
  _detectViolation(code) {
    return (
      code.includes("new IOGateway") ||
      code.includes("IOGateway(")
    );
  }

  // ==============================
  // REPORTE
  // ==============================
  _report(violation) {
    console.error("[IO_KERNEL_GUARDIAN][VIOLATION]", violation);

    this._emit("ioKernelGuardian.violation", violation);

    if (this.mode === "strict") {
      throw new Error(
        `[IO_KERNEL_GUARDIAN] ARCHITECTURE VIOLATION: ${violation.file}`
      );
    }
  }

  // ==============================
  // EVENT BUS
  // ==============================
  _emit(event, data) {
    this.eventBus?.emit?.(event, data);
  }
}

module.exports = IOKernelGuardian;
