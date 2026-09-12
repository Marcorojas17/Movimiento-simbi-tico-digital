# KRONOS-1 — Norma propia v1

## Fundamento normativo

Esta norma se emite en respuesta a:

1. La **Ley Federal del Derecho de Autor de México**, reformada el
   14 de mayo de 2026, que protege la voz contra clonación no
   autorizada mediante IA (Artículos 87, 118 y 121).

2. El **Reglamento General de Protección de Datos (GDPR)** de la Unión
   Europea, Artículo 9, que clasifica la voz como categoría especial de
   dato personal.

3. La **Ley Federal de Protección de Datos Personales en Posesión de
   los Particulares (LFPDPPP)**, Artículo 7, que requiere consentimiento
   expreso en lengua materna cuando aplique.

4. El principio de **soberanía digital** declarado en el Manifiesto del
   Movimiento de Co-Creatividad Simbiótica y Respeto Digital.

---

## Objeto

Establecer los requisitos mínimos que debe cumplir cualquier sistema de
verificación vocal adoptado por el Movimiento, o que invoque su
adopción como estándar.

---

## Requisitos normativos

### Requisito 1 — Consentimiento explícito y granular

Todo análisis de voz requiere consentimiento explícito, granular,
informado y revocable. Los scopes mínimos son:

- `voice:capture` — autorización para capturar la muestra
- `voice:analyze` — autorización para analizarla cimáticamente

**Cumplimiento v0.3.0:** `@kronos/consent` con 11 scopes granulares.

### Requisito 2 — Abstención honesta

El sistema DEBE devolver `abstain` cuando:

- La confianza sea inferior al umbral configurado.
- No exista consentimiento válido y activo.
- La captura sea inválida por formato o duración.

**Cumplimiento v0.3.0:** `packages/kronos-core/src/abstain.ts`.

### Requisito 3 — Explicabilidad obligatoria

Cada veredicto DEBE acompañarse de:

- Los factores numéricos que lo sustentan.
- El umbral aplicado explícitamente.
- Una razón textual comprensible para el titular.

**Cumplimiento v0.3.0:** `packages/kronos-core/src/explain.ts`.

### Requisito 4 — Auditoría inmutable

Cada decisión DEBE registrarse en una cadena auditable que incluya:

- Timestamp de la operación.
- Actor responsable (humano, sistema o IA).
- Acción ejecutada.
- Hash del audio analizado.
- Resultado con razón.

**Cumplimiento v0.3.0:** `@kronos/audit`.

### Requisito 5 — Publicación de límites

El sistema DEBE declarar públicamente lo que NO puede hacer. No se
permite marketing que sugiera capacidades no implementadas.

**Cumplimiento v0.3.0:** `packages/kronos-core/src/limits.ts`.

### Requisito 6 — No emisión de "ai" sin evidencia

El sistema NO debe emitir el veredicto "ai" (voz clonada) sin
confianza estadísticamente alta y consentimiento explícito del titular
para ese análisis específico.

**Cumplimiento v0.3.0:** KRONOS v0.3.0 no emite "ai" en absoluto.
Veredictos posibles: `human` o `abstain`.

### Requisito 7 — Cumplimiento NOM-151

Toda conservación de mensajes de datos (audio, consentimiento,
auditoría) DEBE cumplir con NOM-151-SCFI-2016.

**Cumplimiento v0.3.0:** `@kronos/audit` con export NOM-151.

### Requisito 8 — Multilenguaje y lengua materna

El consentimiento DEBE poder otorgarse en la lengua materna del
titular cuando así lo requiera. Esto incluye lenguas indígenas
reconocidas por el Estado mexicano.

**Cumplimiento v0.3.0:** `es-MX`, `en-US`. Pendiente: `nah`, `yua`, `cpa`.

### Requisito 9 — Prohibición de clonación sin consentimiento

El sistema NO puede generar, sintetizar ni entrenar modelos con
voces sin scope `voice:ai-training` explícitamente otorgado.

**Cumplimiento v0.3.0:** Modelo de scopes en `@kronos/consent`.

### Requisito 10 — Revocabilidad permanente

El titular PUEDE revocar su consentimiento en cualquier momento, sin
penalización, y el sistema DEBE respetar la revocación inmediatamente
en futuras operaciones.

**Cumplimiento v0.3.0:** `packages/consent/src/revoke.ts`.

---

## Tabla resumen de cumplimiento

| Requisito | Estado v0.3.0 | Evidencia |
|-----------|--------------|-----------|
| 1. Consentimiento granular | ✅ | @kronos/consent |
| 2. Abstención honesta | ✅ | abstain.ts |
| 3. Explicabilidad | ✅ | explain.ts |
| 4. Auditoría inmutable | ✅ | @kronos/audit |
| 5. Límites publicados | ✅ | limits.ts |
| 6. No "ai" sin evidencia | ✅ | decide.ts |
| 7. NOM-151 | ✅ | export.ts |
| 8. Multilenguaje | 🟡 Parcial | es-MX + en-US |
| 9. Prohibición clonación | ✅ | scopes.ts |
| 10. Revocabilidad | ✅ | revoke.ts |

---

## Cumplimiento de la norma

Un sistema puede declarar cumplimiento con KRONOS-1 si:

1. Implementa los 10 requisitos.
2. Publica su declaración de conformidad.
3. Se somete a auditoría pública.
4. Acepta las sanciones reputacionales del Movimiento en caso de
   incumplimiento.

**Este es el estándar mínimo. No es el máximo.**

---

## Referencias normativas

- LFDA reformada (DOF 14-05-2026)
- GDPR Art. 9 (UE)
- LFPDPPP Art. 7 (México)
- NOM-151-SCFI-2016 (México)
- Manifiesto del Movimiento (`sovereignty/MANIFESTO.md`)
- Análisis legal (`compliance/legal/LFDA-2026.md`)

---

## Firma

**Marco Antonio Rojas Valdovinos**
Fundador del Movimiento
Acta 2607086319439
GPG: E78BC761AC19FFCB

México, 11 de septiembre de 2026
