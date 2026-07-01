# GoUP Kernel

Este repositorio es el núcleo del sistema GoUP.

## Arquitectura

- brain/core → motor de ejecución (planner, executor, scoring)
- brain/bootstrap.js → inicialización del sistema
- brain/services → integraciones externas (Git, n8n, filesystem)
- brain/interfaces → capas de entrada (Telegram, APIs)
- brain/federation → distribución de agentes
- brain/observability → trazas y control del sistema

## Principios

- Todo IO debe pasar por IO Gateway
- No se permite acceso directo a HTTP sin control
- El sistema es modular y evolutivo
- Git es la memoria persistente del sistema

## Objetivo

Construir un sistema de agentes autónomos que:
- planifica
- ejecuta
- aprende
- se versiona en GitHub
