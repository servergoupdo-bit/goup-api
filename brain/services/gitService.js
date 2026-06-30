/**
 * gitService.js
 * Blueprint v2.0 — Version Control Layer
 */

const { exec } = require("child_process");

class GitService {
  runGit(command) {
    return new Promise((resolve, reject) => {
      exec(`git ${command}`, (error, stdout, stderr) => {
        if (error) {
          return reject({ error, stderr });
        }

        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        });
      });
    });
  }

  status() {
    return this.runGit("status --short");
  }

  log(limit = 10) {
    return this.runGit(`log -n ${limit} --oneline`);
  }

  add(path = ".") {
    return this.runGit(`add ${path}`);
  }

  commit(message) {
    return this.runGit(`commit -m "${message}"`);
  }
}

module.exports = new GitService();
