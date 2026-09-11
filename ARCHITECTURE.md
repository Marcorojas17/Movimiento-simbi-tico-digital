# ARCHITECTURE — Co-Creatividad Simbiótica + KRONOS

**Versión:** 0.3.0
**Acta:** 2607086319439
**Fundador:** Marco Antonio Rojas Valdovinos
**Contacto:** marco.a.rojas.v@hotmail.com · +52 722 586 2335

---

## 1. Fundamentos

Dos capas superpuestas:

- **Movimiento**: Co-Creatividad Simbiótica y Respeto Digital (inmutable, Safe Creative + Ethereum)
- **Producto**: KRONOS — Verificador de autenticidad vocal y procedencia digital

## 2. Decisiones confirmadas

| # | Decisión | Valor |
|---|----------|-------|
| 1 | Nombre producto | KRONOS |
| 2 | Nombre movimiento | Co-Creatividad Simbiótica y Respeto Digital |
| 3 | Alcance v1 | SOLO VOZ |
| 4 | Multilenguaje | Fase 1-2: es-MX + en-US |
| 5 | Monetización | Híbrida ética (B2B + API + certificación) |
| 6 | Dominio | kronos.mx o cocreatividad.digital |
| 7 | Licencia | MIT (código) + CC BY-NC-SA 4.0 (contenido) |
| 8 | Prioridad | Provenance legal primero |

## 3. Principio rector

Cada archivo en `provenance/` que toque `VID-20260708-WA0038.mp4` DEBE validar
`SHA-256 41a3683bbf83296eeb45da9b0e0ea5a7c095e78b493772e79520a92dbc39f4c3`.
Si falla, el CI falla.

## 4. Stack

| Capa | Tecnología |
|------|-----------|
| Monorepo | pnpm 9 + Turborepo 2 |
| Lenguaje | TypeScript 5.5 estricto |
| Runtime | Node 20 LTS |
| Landing | Astro 4 |
| Lint/Format | Biome 1.9 |
| Testing | Vitest 2.1 |
| CI/CD | GitHub Actions |

## 5. Estado de packages (v0.3.0)

| Package | Tests | Rol |
|---------|-------|-----|
| @kronos/shared | — | Tipos, constantes, logger |
| @kronos/crypto | — | SHA-256/512, AES-256-GCM |
| @kronos/cymatic-440 | 13 | FFT, ancla 440 Hz, Chladni |
| @kronos/consent | 25 | Scopes, cadena grant/revoke |
| @kronos/audit | 21 | Log inmutable, export NOM-151 |
| @kronos/kronos-core | 12 | Pipeline con abstención honesta |
| @kronos/web | — | Landing VERIFIED |

## 6. Grafo de dependencias
shared → crypto → cymatic-440 → consent → audit → kronos-core → apps/web

## 7. Pipeline KRONOS v1
capture → hash → consent → cymatic → confidence → decide → explain → audit

Regla de oro: **abstención honesta** por encima de veredicto.

## 8. Compliance y seguridad

- `compliance/README.md` — NOM-151, ISO 27001, derechos vocales
- `security/THREAT-MODEL.md` — STRIDE (14 amenazas, 12 mitigadas)
- `sovereignty/MANIFESTO.md` — Principios operativos
- `SECURITY.md` — Política de reporte

## 9. Verificación

```bash
make verify
pnpm test
Firmado: Marco Antonio Rojas Valdovinos — Fundador
Acta 2607086319439-3CXNQP
GPG: E78BC761AC19FFCB
