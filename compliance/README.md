# ⚖️ Compliance — Cumplimiento Normativo KRONOS v0.3.0

Esta carpeta documenta el cumplimiento legal de KRONOS y del Movimiento
de Co-Creatividad Simbiótica y Respeto Digital.

> El cumplimiento no se declara. Se demuestra con evidencia verificable.

## Matriz de cumplimiento

### México

| Norma | Estado | Evidencia |
|-------|--------|-----------|
| NOM-151-SCFI-2016 | 🟢 Cumplido | Este archivo |
| LFPDPPP | 🟢 Cumplido | legal/PRIVACY.md |
| LFDA | 🟢 Cumplido | Registro Safe Creative 2607086319439 |

### ISO

| Estándar | Estado |
|----------|--------|
| ISO/IEC 27001 | 🟡 En proceso |
| ISO/IEC 25010 | 🟢 Documentado |

### Internacional

| Norma | Estado |
|-------|--------|
| GDPR | 🟢 Cumplido |
| eIDAS | 🟡 Analizado |

---

## NOM-151-SCFI-2016

### Requisitos aplicables

**1. Integridad**

Cada audio se hashea con SHA-256 al ingreso (`@kronos/kronos-core/capture.ts`).
El hash se registra en `@kronos/audit`. El hash del acta fundacional está
anclado en Ethereum.

**2. Conservación**

`provenance/` es raíz inmutable. Cada cambio requiere entrada en
`seals/HISTORY.md`. El workflow `verify-seal.yml` valida hash en cada push.

**3. Consulta posterior**

El registro completo está en `provenance/2607086319439/`. Los verificadores
públicos en `provenance/verifiers/` permiten consulta programática.

**4. Firma electrónica avanzada**

Sello de tiempo Safe Creative (Firmaprofesional SA). Firma GPG del fundador
`E78BC761AC19FFCB` (RSA 4096). Clave pública en `.well-known/gpg-key.asc`.

**5. Conservación por tercero**

Safe Creative S.L. (NIF B99161739, Zaragoza, España).

---

## ISO/IEC 27001 — SGSI básico

### Alcance

- Repositorio GitHub y su contenido
- Cadenas de auditoría (`@kronos/audit`)
- Registro Safe Creative + Ethereum
- Claves criptográficas (GPG)
- Datos vocales de titulares

### Controles implementados

| Control | Estado |
|---------|--------|
| A.5 Políticas de seguridad | ✅ SECURITY.md |
| A.8 Inventario de activos | ✅ Este archivo |
| A.9 Control de acceso | ✅ 2FA + CODEOWNERS |
| A.10 Criptografía | ✅ SHA-256, AES-256-GCM, GPG |
| A.12 Seguridad operativa | ✅ CI/CD con permisos mínimos |
| A.14 Desarrollo seguro | ✅ PR reviews + 71 tests |
| A.16 Gestión de incidentes | 🟡 Política definida, bitácora pendiente |

---

## Derechos vocales

### Voz como dato biométrico

- LFPDPPP (México): dato personal sensible.
- GDPR (UE): Art. 9, categoría especial.

**Reglas KRONOS:**

1. NUNCA procesar voz sin consentimiento explícito.
2. NUNCA almacenar sin scope `voice:store`.
3. NUNCA compartir sin scope `voice:share`.
4. NUNCA entrenar IA sin scope `voice:ai-training`.
5. Revocable en cualquier momento.

### Consentimiento

Debe ser libre, específico, informado, revocable y documentado.
Implementado en `@kronos/consent` con 11 scopes granulares.

### Menores de edad

KRONOS v1 NO procesa voces de menores sin tutor legal explícito.
Registrado como limitación en `packages/kronos-core/src/limits.ts`.

### Clonación no autorizada

KRONOS detecta el ancla cimática 440 Hz y se abstiene cuando no hay
certeza. La defensa real es consentimiento + auditoría + marco legal.

---

## Acta fundacional

- Safe Creative: 2607086319439
- Ethereum: 0x8ca8e84e1258abac9acb29d14d25114e4775d782ecfda51ae29933247ed2970e
- Fundador: Marco Antonio Rojas Valdovinos
- Contacto: marco.a.rojas.v@hotmail.com · +52 722 586 2335
