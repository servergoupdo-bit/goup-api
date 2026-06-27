function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[¿?¡!.,]/g, "");
}

const INTENTS = [
  {
    intent: "system.status",
    keywords: ["estado sistema", "estado", "status", "sistema", "servidor"]
  },
  {
    intent: "system.docker",
    keywords: ["docker", "contenedores", "contenedor", "docker ps"]
  },
  {
    intent: "system.ping",
    keywords: ["ping", "latencia"]
  },
  {
    intent: "system.workflow",
    keywords: ["n8n", "workflow", "automatizacion", "flujo"]
  }
];

function scoreIntent(text, keywords) {
  let score = 0;

  for (const k of keywords) {
    if (text.includes(k)) score += 2;

    const parts = k.split(" ");
    for (const p of parts) {
      if (p.length > 3 && text.includes(p)) {
        score += 0.5;
      }
    }
  }

  return score;
}

function detectIntent(text) {
  const t = normalize(text);

  let bestIntent = "unknown";
  let bestScore = 0;

  const results = [];

  for (const item of INTENTS) {
    const score = scoreIntent(t, item.keywords);

    results.push({
      intent: item.intent,
      score
    });

    if (score > bestScore) {
      bestScore = score;
      bestIntent = item.intent;
    }
  }

  return {
    intent: bestIntent,
    confidence: Math.min(bestScore / 5, 1),
    ranking: results.sort((a, b) => b.score - a.score)
  };
}

module.exports = { detectIntent };
