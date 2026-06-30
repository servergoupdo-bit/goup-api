const fs = require("fs");

class IOGuardian {
  constructor({ eventBus, memory, mode = "observe" }) {
    this.eventBus = eventBus;
    this.memory = memory;

    // 🧠 observe | enforce
    this.mode = mode;

    // ❌ IO primitives forbidden at kernel level
    this.forbiddenPatterns = [
      "axios",
      "node-fetch",
      "fetch(",
      "http.request",
      "https.request"
    ];

    // 🟢 allowed architecture zones
    this.allowedPaths = [
      "/brain/services/",
      "/brain/federation/",
      "/brain/interfaces/",
      "/api/"
    ];

    this._hookActive = false;
  }

  /**
   * 🔍 STATIC FILE SCAN (SAFE)
   */
  scanSource(filePath) {
    try {
      const stats = fs.statSync(filePath);

      // 🧯 skip directories safely
      if (!stats.isFile()) return true;

      const code = fs.readFileSync(filePath, "utf8");

      const violations = this.forbiddenPatterns.filter(p =>
        code.includes(p)
      );

      const isAllowedZone = this.allowedPaths.some(p =>
        filePath.includes(p)
      );

      const severity =
        isAllowedZone
          ? "warn"
          : (this.mode === "enforce" ? "block" : "warn");

      if (violations.length > 0) {
        this.report(filePath, violations, severity);
      }

      return violations.length === 0;

    } catch (err) {
      // 🧯 never break kernel scan
      console.warn("[IO_GUARDIAN_SCAN_SAFE]", filePath, err.message);
      return true;
    }
  }

  /**
   * 🌲 FULL TREE SCAN (RECURSIVE SAFE)
   */
  scanSourceTree(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
          this.scanSourceTree(fullPath);
        } else if (entry.name.endsWith(".js")) {
          this.scanSource(fullPath);
        }
      }
    } catch (err) {
      console.warn("[IO_GUARDIAN_TREE_SAFE]", dir, err.message);
    }
  }

  /**
   * 🚨 REPORT ENGINE
   */
  report(filePath, violations, severity = "warn") {
    const event = {
      type: "IO_VIOLATION",
      file: filePath,
      violations,
      severity,
      timestamp: Date.now()
    };

    this.eventBus?.emit?.("io_violation", event);

    this.memory?.push?.({
      type: "io_violation",
      data: event
    });

    if (severity === "block") {
      console.error("[IO_GUARDIAN][BLOCK]", event);
    } else {
      console.warn("[IO_GUARDIAN][WARN]", event);
    }
  }

  /**
   * 🧠 REQUIRE HOOK (CONTROLLED)
   */
  activateRequireHook() {
    if (this._hookActive) return;

    const self = this;
    const originalRequire = module.constructor.prototype.require;

    module.constructor.prototype.require = function (path) {
      try {
        const isForbidden = self.forbiddenPatterns.some(p =>
          path.includes(p)
        );

        if (isForbidden && self.mode === "enforce") {
          self.report("require://runtime", [path], "block");

          throw new Error(`[IO_GUARDIAN BLOCKED]: ${path}`);
        }

        return originalRequire.apply(this, arguments);

      } catch (err) {
        console.warn("[IO_GUARDIAN_REQUIRE_SAFE]", err.message);
        return originalRequire.apply(this, arguments);
      }
    };

    this._hookActive = true;

    this.report(
      "require://system",
      ["hook_activated"],
      "warn"
    );
  }
}

module.exports = IOGuardian;
