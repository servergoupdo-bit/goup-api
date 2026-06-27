// brain/router/fallback.js

function pickNextCandidate(ranking, currentPlugin) {

  if (!ranking || ranking.length === 0) {
    return null;
  }

  const filtered = ranking.filter(p => p.plugin !== currentPlugin);

  return filtered.length > 0 ? filtered[0] : null;
}

module.exports = {
  pickNextCandidate
};
