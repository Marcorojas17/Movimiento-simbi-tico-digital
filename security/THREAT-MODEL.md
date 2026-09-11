# Modelo de Amenazas — STRIDE

## Alcance
KRONOS v0.3.0: captura, análisis cimático, consentimiento, decisión,
explicación y auditoría.

## Activos protegidos

| Activo | Criticidad |
|--------|-----------|
| Acta fundacional | Crítica |
| Clave privada GPG | Crítica |
| Audio crudo de titulares | Alta |
| Consentimientos | Alta |
| Cadena de auditoría | Alta |
| Clave pública GPG | Media |

---

## S — Spoofing

**S-01: Suplantar al fundador**
Mitigación: Tags firmados con GPG `E78BC761AC19FFCB`. Verificable con
`git tag -v v0.3.0`. Estado: ✅

**S-02: Suplantar un consentimiento**
Mitigación: Cada `ConsentRecord` tiene hash propio y cadena inmutable.
`ConsentChain.verify()` detecta alteraciones. Estado: ✅

---

## T — Tampering

**T-01: Modificar el acta fundacional**
Mitigación: Hash SHA-256 en Ethereum + CI valida en cada push.
Estado: ✅

**T-02: Alterar la cadena de auditoría**
Mitigación: Cada entrada apunta al hash de la anterior.
`verifyAuditChain()` detecta manipulación. Estado: ✅

**T-03: Inyectar audio malicioso**
Mitigación: `capture.ts` valida tipo y tamaño. Sin decodificadores
en el pipeline core. Estado: ✅

---

## R — Repudiation

**R-01: Negar consentimiento otorgado**
Mitigación: `ConsentRecord` con timestamp y hash. Cadena `grant → revoke`.
Estado: ✅

**R-02: Negar veredicto emitido**
Mitigación: Cada `runKronos()` produce `auditEntryCount` y hash del audio.
Estado: ✅

---

## I — Information Disclosure

**I-01: Fuga de audio crudo**
Mitigación: Audio solo en memoria. Scope `voice:store` requerido para
persistir. Estado: ✅

**I-02: Fuga de scopes**
Mitigación: Scope `data:export` regula exportación. Estado: ✅

**I-03: Fuga de clave privada GPG**
Mitigación: `.gitignore` excluye claves privadas. Solo `.pub` en repo.
Estado: ✅

---

## D — Denial of Service

**D-01: Saturación de API**
Mitigación futura: Rate limiting, colas asíncronas. Estado: 🟡 Fase 8.

**D-02: Audio patológico**
Mitigación parcial: `capture.ts` impone duración mínima pero no máxima.
Estado: 🟡 Fase 8.

---

## E — Elevation of Privilege

**E-01: Escapar del sandbox de análisis**
Mitigación: TypeScript puro sin eval. Sin plugins externos. Estado: ✅

**E-02: Escalar a admin del repo**
Mitigación: CODEOWNERS + ramas protegidas + 2FA. Estado: ✅

---

## Resumen

| Categoría | Amenazas | Mitigadas | Pendientes |
|-----------|----------|-----------|------------|
| Spoofing | 2 | 2 | 0 |
| Tampering | 3 | 3 | 0 |
| Repudiation | 2 | 2 | 0 |
| Info Disclosure | 3 | 3 | 0 |
| DoS | 2 | 0 | 2 |
| Elevation | 2 | 2 | 0 |
| **Total** | **14** | **12** | **2** |

Revisión trimestral. Próxima: 2026-12-11.
