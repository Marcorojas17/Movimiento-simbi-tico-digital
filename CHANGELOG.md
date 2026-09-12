# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Versionado [SemVer](https://semver.org/lang/es/).

## [0.3.1] - 2026-09-11

### Añadido — Design System VERIFIED

- Logo KRONOS oficial (favicon SVG + nav 32px)
- OG image 1200×630 para Twitter/LinkedIn/WhatsApp
- Fondo cimático animado CSS (anillos concéntricos sin JavaScript)
- Paleta VERIFIED: #00FF88 (verde), #FFD700 (dorado), #FF0040 (rojo)
- Meta tags Open Graph + Twitter Card completos
- Screenshot de la landing en README

### Añadido — Vinculación Legal LFDA 2026

- `compliance/legal/LFDA-2026.md` — Análisis de la reforma del 14 mayo 2026
- `docs/acta-fundacional-v2.md` — Anexo vinculante al acta 2607086319439
- `sovereignty/auto-norma/KRONOS-1.md` — Norma propia con 10 requisitos

### Cambiado

- `global.css` reorganizado por secciones con comentarios
- Fusión de gradientes esquineros + anillos cimáticos en un solo `body::before`
- Nav reestructurado con logo + nombre + links

### Notas

- Tag sin firma GPG temporal (clave privada reside en Codespaces)
- Se re-firmará con `git tag -s -f v0.3.1` cuando la cuota se renueve

## [0.3.0] - 2026-07-08

### Añadido — Núcleo KRONOS completo

- **@kronos/cymatic-440**: FFT radix-2 puro, detección de ancla 440 Hz, análisis multibanda, patrones Chladni, visualización ASCII/SVG. 13 tests.
- **@kronos/consent**: Gestión de consentimiento vocal con 11 scopes granulares, cadena inmutable grant→revoke→re-grant, hash canónico determinista. 25 tests.
- **@kronos/audit**: Log inmutable con cadena de hashes, 16 acciones auditables, export NOM-151. 21 tests.
- **@kronos/kronos-core**: Pipeline completo (capture→hash→consent→cymatic→confidence→decide→explain→audit) con abstención honesta. 12 tests.
- **apps/web VERIFIED**: Landing con demo estática generada desde fixtures reales en build-time.

### Añadido — Infraestructura

- Monorepo pnpm + Turborepo con 7 packages
- Biome como linter/formatter unificado
- GitHub Actions: ci.yml, sbom.yml, verify-seal.yml, deploy-pages.yml, codeql.yml, security.yml, validate-certificate.yml
- .devcontainer/ para entorno reproducible

### Añadido — Compliance + Security + Sovereignty

- `compliance/README.md` con NOM-151, ISO 27001, derechos vocales
- `security/THREAT-MODEL.md` con análisis STRIDE completo
- `sovereignty/MANIFESTO.md` con 7 principios y auto-norma
- `SECURITY.md` actualizado con referencias cruzadas

### Corregido

- `cymatic-440`: `anchor.confidence` clampeada a [0..1]
- `consent`: dos tests mal escritos que no reflejaban la lógica de conflictos unidireccionales
- `kronos-core`: import sin usar en `decide.ts`
- Deploy pages: usa `pnpm build` (Turbo construye dependencias en orden)
- Workflows: pnpm version conflict (usa packageManager del package.json)

## [0.2.0] - 2026-07-08

### Añadido
- Estructura de monorepo con pnpm workspaces
- Paquetes base @kronos/shared, @kronos/crypto
- Landing inicial en apps/web (Astro)
- Configuración de Biome, Turbo, TypeScript estricto

## [0.1.0] - 2026-07-08

### Añadido
- Registro Safe Creative 2607086319439
- Anclaje Ethereum 0x8ca8...970e
- 41 archivos base: gobernanza, seguridad, docs, workflows
- Acta Fundacional en docs/acta-fundacional.md
- Certificados legales en PDF
- Estructura provenance/ inicial

[0.3.1]: https://github.com/Marcorojas17/Movimiento-simbi-tico-digital/releases/tag/v0.3.1
[0.3.0]: https://github.com/Marcorojas17/Movimiento-simbi-tico-digital/releases/tag/v0.3.0
[0.2.0]: https://github.com/Marcorojas17/Movimiento-simbi-tico-digital/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Marcorojas17/Movimiento-simbi-tico-digital/releases/tag/v0.1.0
