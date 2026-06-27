module.exports = {
  name: "debug",

  score(intent) {
    const t = intent.toLowerCase();
    if (t.includes("debug")) return 1;
    return 0;
  },

  execute({ intent }) {
    return {
      ok: true,
      debug: true,
      intent
    };
  }
};
