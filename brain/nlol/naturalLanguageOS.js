/**
 * naturalLanguageOS.js
 * Blueprint v4.8 — Natural Language Operating Layer
 */

class NaturalLanguageOS {
  constructor({ kernel, composer, observer }) {
    this.kernel = kernel;
    this.composer = composer;
    this.observer = observer;
  }

  /**
   * 🧠 entrada principal (lenguaje humano)
   */
  async handle(input) {
    const interpretation = this._interpret(input);

    this.observer?.record?.({
      type: "NL_INPUT",
      input,
      interpretation
    });

    let result;

    // 🧱 1. si es creación de workflow
    if (interpretation.mode === "COMPOSE") {
      result = this.composer.compose(input);
    }

    // ⚙️ 2. si es ejecución directa
    else if (interpretation.mode === "EXECUTE") {
      result = await this.kernel.handle(input);
    }

    // 🔍 3. si es consulta del sistema
    else if (interpretation.mode === "QUERY") {
      result = this._querySystem(input);
    }

    return this._respond(input, result);
  }

  /**
   * 🧠 interpretación semántica básica
   */
  _interpret(input) {
    const text = input.toLowerCase();

    if (text.includes("crea") || text.includes("construye") || text.includes("workflow")) {
      return { mode: "COMPOSE" };
    }

    if (text.includes("ejecuta") || text.includes("run") || text.includes("corre")) {
      return { mode: "EXECUTE" };
    }

    return { mode: "QUERY" };
  }

  /**
   * 📊 consultas del sistema
   */
  _querySystem(input) {
    return {
      status: "OK",
      message: "Sistema operativo activo",
      hint: "Puedes crear workflows o ejecutar intents"
    };
  }

  /**
   * 🗣️ respuesta natural al usuario
   */
  _respond(input, result) {
    return {
      input,
      output: result,
      humanReadable: this._format(result)
    };
  }

  /**
   * 🧾 formateo conversacional
   */
  _format(result) {
    if (result?.nodes) {
      return `He construido un workflow con ${result.nodes.length} nodos.`;
    }

    if (result?.success !== undefined) {
      return result.success
        ? "Ejecución completada correctamente."
        : "Se produjo un error durante la ejecución.";
    }

    return "Operación completada.";
  }
}

module.exports = NaturalLanguageOS;
