function normalizeIntent(input = "") {
  const text = input.toLowerCase();

  if (
    text.includes("estado") ||
    text.includes("status") ||
    text.includes("sistema") ||
    text.includes("system")
  ) {
    return "status";
  }

  if (
    text.includes("saludo") ||
    text.includes("hola")
  ) {
    return "hello";
  }

  return text;
}

module.exports = {
  normalizeIntent
};
