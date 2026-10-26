# Instrucciones para agentes

## Propósito

GoUP es el núcleo de un sistema modular de agentes que planifica, ejecuta,
aprende y se versiona mediante Git.

## Arquitectura

- `brain/core`: planificación, ejecución, scoring, políticas y memoria.
- `brain/bootstrap.js`: inicialización.
- `brain/services`: integraciones con sistemas externos.
- `brain/interfaces`: puntos de entrada, incluidas interfaces de mensajería y API.
- `brain/federation`: coordinación y transporte entre agentes.
- `brain/observability`: trazas y observabilidad.
- Todo IO debe pasar por IO Gateway. No introducir acceso HTTP directo que
  evada sus controles.

## PlanificacionDocenteRD

PlanificacionDocenteRD es el MVP de planificación docente que se integra con
GoUP. Los contratos, artefactos y gates deben derivarse de código o
documentación validada; no inferir capacidades de sistemas externos ni
implementar lógica productiva a partir de exports locales.

## Seguridad y límites operativos

- No incluir secretos, credenciales, tokens, datos personales, números de
  teléfono ni códigos QR en cambios, logs, ejemplos o informes.
- Tratar exports de workflows como posibles portadores de datos privados.
  Inspeccionarlos localmente y no versionarlos hasta verificar y eliminar datos
  reales y configuración sensible.
- No acceder a producción ni modificar servicios, workflows operativos o datos
  externos sin autorización explícita para la tarea.
- No realizar commits, push, merges ni pull requests sin autorización explícita.
- Preservar los cambios preexistentes del worktree y limitar cada cambio al
  alcance solicitado.

## Procedimiento de desarrollo

1. Leer esta guía y la documentación directamente relacionada antes de editar.
2. Inspeccionar el estado Git y el código existente; reutilizar patrones y
   componentes antes de añadir otros.
3. Mantener los cambios quirúrgicos y actualizar documentación relacionada.
4. No instalar dependencias ni modificar servicios salvo que se autorice y sea
   imprescindible.
5. Informar explícitamente de archivos o dependencias ausentes; no crear
   sustitutos ficticios.

## Validación

- Ejecutar las pruebas y verificaciones locales existentes que correspondan,
  sin contactar servicios externos ni ejecutar workflows productivos.
- No declarar una validación exitosa sin resultado observable.
- Revisar el diff, el estado del worktree y los cambios por posibles secretos o
  datos personales antes de finalizar.
- Si una prueba requiere acceso externo, detenerse y reportar esa dependencia.

## Documentación de referencia

- `CODEX_CONTEXT.md`: contexto técnico persistente; conservar únicamente
  hechos técnicos validados y reutilizables.
- `GEMINI.md`: principios y arquitectura del kernel.
- `scripts/validate-alta-docente-v0.js`: validador estructural local del export.
- `alta-docente-v0.workflow.json`: export local sujeto a revisión de privacidad;
  no asumir que representa el workflow productivo actual.