# CODEX_CONTEXT — PlanificacionDocenteRD

Última actualización: 2026-10-24

Este archivo contiene únicamente el **estado técnico vigente, validado y reutilizable**.

Reglas generales de ejecución pertenecen a `AGENTS.md`.

## REGLA DE USO

- Reutilizar los hechos `VALIDADO`.
- Reinspeccionar solo si la tarea lo exige, existe contradicción o el estado puede haber cambiado.
- El estado observable actual prevalece sobre este archivo.
- No almacenar secretos, razonamientos, logs, historial ni versiones obsoletas.
- Actualizar solo cuando exista un nuevo hecho técnico validado y reutilizable.

---

## 1. INFRAESTRUCTURA OPERATIVA

Estado: `VALIDADO`

### WAHA

Sesión:

`plandocente-mvp`

URL interna desde n8n:

`http://waha:3000`

Autenticación existente:

`X-Api-Key`

No mostrar, copiar ni almacenar su valor.

Envío WhatsApp:

`POST http://waha:3000/api/sendText`

Para responder al docente, `chatId` utiliza el identificador WAHA completo recibido.

### Docker

n8n y WAHA comparten la red necesaria para comunicación interna.

Desde WAHA, `n8n` es resoluble por DNS Docker y n8n responde internamente.

---

## 2. WORKFLOW OPERATIVO

Estado: `VALIDADO`

Workflow:

`GaJHT8qlhzo7mklP`

Nombre:

`WF-002A - Etapa1./Conversacional - PlanDocente MVP`

Estado:

Activo / publicado.

Webhook:

`POST /webhook/c82bcd42-f443-407c-845f-6ec1e39ce98b`

Flujo vigente:

`WAHA`
→ normalización
→ validación sesión
→ contrato mínimo
→ búsqueda `Indice_Docentes`
→ identificación
→ alta/recuperación cuando corresponda
→ router Fichero 01
→ Onboarding F01 o Pladia
→ WAHA

En el borrador no publicado, el cierre válido de Fichero 01 conduce a G05
(`CREAR_PROYECTO_DOCENTE`). La versión publicada permanece sin cambios.

---

## 3. IDENTIDAD WHATSAPP v1

Estado: `VALIDADO`

Identidad operacional:

`whatsapp_id`

Reglas:

- contiene el identificador WAHA completo;
- puede utilizar `@lid`;
- no reconstruirlo;
- no asumir `@c.us`;
- búsqueda del docente por coincidencia exacta de `whatsapp_id`.

### Contrato

`whatsapp_id`
= identificador WAHA completo recibido.

`telefono_whatsapp`
= teléfono humano resuelto mediante WAHA; nullable.

`chat_id_waha`
= identificador WAHA completo utilizado para responder.

`mensaje_normalizado`
= contenido normalizado del mensaje.

`message_id`
= ID del mensaje recibido.

### Resolución LID → teléfono

Se realiza únicamente cuando es necesaria en la rama de alta.

Si WAHA devuelve un `pn` válido terminado en `@c.us`, persistir el número humano sin el sufijo.

Si no existe un `pn` válido:

`telefono_whatsapp = null`

Esto no bloquea el alta.

---

## 4. INDICE_DOCENTES

Estado: `VALIDADO`

Fuente operacional:

n8n Data Table `Indice_Docentes`

Data Table ID:

`mxlnU4w1X7N2NNrQ`

Project ID:

`YNra09xagm1ukdey`

Google Drive continúa como repositorio documental.

Google Sheets no forma parte del runtime operacional.

### Identidad funcional

Formato:

`DOC-NNNN`

Ejemplos:

`DOC-0001`
`DOC-0002`

Para nuevas altas:

1. considerar IDs que cumplan `^DOC-(\d{4})$`;
2. obtener máximo válido;
3. incrementar +1;
4. rellenar a cuatro dígitos;
5. no reutilizar huecos.

Concurrencia simultánea de altas queda fuera del MVP.

### Alta

Si `docente_existe = false`:

→ calcular nuevo `id_docente`
→ resolver LID → teléfono una vez
→ insertar una fila
→ recuperar por identidad
→ continuar al mismo router F01.

Valores iniciales:

`fichero_01_estado = PENDIENTE`

`planificacion_anual_estado = PENDIENTE`

`estado_docente = PAUSADO`

`onboarding_iniciado = false`

No utilizar el `id` interno de n8n como `id_docente`.

---

## 5. ROUTER FICHERO 01

Estado: `VALIDADO`

Arquitectura:

`Docente identificado/recuperado`
→ evaluar `fichero_01_estado`

### LISTO

→ continuidad normal hacia `Agente Pladia v0`.

### PENDIENTE

→ evaluar `onboarding_iniciado`.

El router recibe tanto docentes existentes como docentes recién creados/recuperados.

Contrato operacional a preservar:

- `id_docente`
- `whatsapp_id`
- `telefono_whatsapp`
- `chat_id_waha`
- `mensaje_normalizado`
- `message_id`
- `fichero_01_estado`
- `planificacion_anual_estado`
- `estado_docente`
- `onboarding_iniciado`

---

## 6. ESTADO CONVERSACIONAL F01

Estado: `VALIDADO` estructuralmente.

Campo:

`onboarding_iniciado`

Tipo:

Boolean

Semántica:

`false`
= mensaje inicial F01 todavía no enviado.

`true`
= mensaje inicial ya enviado; mensajes siguientes son continuación/respuesta.

No representa finalización del onboarding.

Valores vigentes validados:

`DOC-0001 = true`

`DOC-0002 = false`

Nuevas altas:

`false`

### PENDIENTE + false

→ preparar mensaje inicial determinístico
→ enviar mediante WAHA
→ después del envío satisfactorio actualizar únicamente:

`onboarding_iniciado = true`

No cambiar `fichero_01_estado`.

### PENDIENTE + true

→ `Respuesta Onboarding F01` (Information Extractor)
→ `Normalizar extracción F01`

Gemini reutiliza el nodo/modelo existente `Modelo Gemini Pladia v0`
(`models/gemini-3-flash-preview`).

La salida terminal contiene:

- `fichero_01_datos`: `nombre`, `centro_educativo`, `nivel`, `grado`,
  `seccion`, `asignatura`, `duracion_clase_minutos`;
- `fichero_01_campos_faltantes`: campos nulos, vacíos o no determinados;
- `fichero_01_completo`: `true` solo cuando los siete campos están presentes.

Esta rama no persiste los datos, no cambia `fichero_01_estado` y no envía
mensajes.

### Finalización

La finalización continúa gobernada por:

- `fichero_01_estado`
- `planificacion_anual_estado`

No por `onboarding_iniciado`.

---

## 7. PLADIA v0

Modelo conversacional validado:

`models/gemini-3-flash-preview`

El nodo Gemini compartido usa `maxOutputTokens = 1024`; con 300, la extracción
estructurada F01 terminó en `MAX_TOKENS` antes de producir JSON válido.

Credencial existente:

`Google Gemini(PaLM) Api account`

No mostrar ni modificar su valor.

La rama:

`fichero_01_estado = LISTO`

continúa hacia:

`Agente Pladia v0`
→ adaptar respuesta
→ enviar por WAHA.

Pladia v0 no debe asumir decisiones estructurales fuera de su contrato vigente.

---

## 8. MAPA OPERATIVO G01–G12

Estado: `VALIDADO` como arquitectura del borrador; gates pendientes no implementados.

- G01 — Entrada WhatsApp / WAHA.
- G02 — Identidad.
- G03 — Registro / recuperación en `Indice_Docentes`.
- G04 — Fichero 01 / Proyecto Docente.
- G05 — Instrucción `CREAR_PROYECTO_DOCENTE`.
- G06 — Fichero 02 / Planificación Anual (pendiente).
- G07 — Instrucción `CREAR_PLANIFICACION_ANUAL` (pendiente).
- G08 — Criterios de activación (pendiente).
- G09 — Plan / estado / créditos.
- G10 — Fichero 03 / Contexto diario (pendiente).
- G11 — `CREAR_PLANIFICACION_DIARIA` (pendiente).
- G12 — Vertical slice completa (pendiente).

Relación de artefactos:

- F01 → `CREAR_PROYECTO_DOCENTE`.
- F02 → `CREAR_PLANIFICACION_ANUAL`.
- F03 → `CREAR_PLANIFICACION_DIARIA`.

G05 reutiliza la consulta de `Fichero_01_Docentes` y valida el cierre F01
(`LISTO`, identidad única y campos obligatorios) antes de producir el contrato
`CREAR_PROYECTO_DOCENTE` v0.1. No requiere aprobación de plan ni créditos.
Sus entradas en el borrador son las salidas `Salida onboarding completo` y
`Salida F01 ya listo`.

G09 reutiliza el bloque anterior de acceso de plan/estado/créditos con su
lógica de decisión preservada. Está aislado y no conectado desde G05; su
validador de entrada conserva por compatibilidad la condición heredada
`siguiente_gate = G05` hasta que se diseñe su integración tras G08.
G06, G07 y G08 no están implementados.

El bloque G05 se validó de forma aislada con Fichero 01 real de DOC-0001.
No se ejecuta la Etapa Productiva y el workflow continúa sin publicar los
cambios del borrador.

---

## 9. ESTADO DE VALIDACIÓN

Validado estructuralmente:

- En este n8n, modificar/autoguardar un workflow no garantiza que la versión
  que atiende el webhook haya sido publicada; después de cambios operativos
  debe verificarse explícitamente la versión publicada/activa.
- infraestructura WAHA ↔ n8n;
- recepción webhook;
- Identidad WhatsApp v1;
- Data Table `Indice_Docentes`;
- identificación por `whatsapp_id`;
- alta y recuperación estructural;
- Router Fichero 01;
- `onboarding_iniciado`;
- separación PENDIENTE / LISTO;
- extracción estructurada F01 y cálculo determinístico de faltantes/completitud;
- generación de respuesta Pladia;
- mecanismo de envío WAHA.

Pendientes de prueba real cuando corresponda:

- ramas que deliberadamente no fueron ejecutadas para evitar crear datos artificiales;
- validación end-to-end de la extracción Gemini F01 con mensaje natural.

No ejecutar pruebas reales automáticamente si la tarea especifica validación estructural.

---

## 11. OPERADOR LOCAL N8N

Estado: `VALIDADO`

Oracle dispone de un operador local reutilizable para n8n.

Implementación:

`n8n-operator.js`

Configuración privada:

`~/.config/goup/n8n.env`

Reglas:

- la configuración privada nunca se versiona;
- la clave API no se almacena ni se publica en el repositorio;
- el operador usa la API oficial local de n8n;
- la interfaz validada es: `list`, `get`, `create`, `update`, `delete`;
- el gate validado es: `CREATE → READ → UPDATE → VERIFY → DELETE → CLEANUP`;
- `UPDATE` debe omitir campos `read-only`;
- `MCP` no es una dependencia obligatoria para operar n8n.

---

## 10. POLÍTICA DE ACTUALIZACIÓN

Registrar únicamente:

**estado técnico vigente + validado + reutilizable**

No registrar:

- historial de implementación;
- números de ejecuciones pasadas;
- diagnósticos ya resueltos;
- versiones reemplazadas;
- componentes obsoletos;
- conversaciones;
- hipótesis;
- logs;
- secretos;
- pruebas circunstanciales.

Cuando una arquitectura cambie:

**reemplazar el estado anterior por el vigente**, en lugar de acumular historia.

Objetivo:

**contexto mínimo suficiente para ejecutar la próxima unidad.**