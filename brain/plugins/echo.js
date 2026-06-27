module.exports = {
  name: "echo",

  score(intent) {
    const t = intent.toLowerCase();
    if (t.includes("echo")) return 1;
    return 0;
  },

  execute({ intent }) {
    return {
      ok: true,
      echo: intent
    };
  }
};
