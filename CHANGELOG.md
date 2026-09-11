# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/).
Versionado [SemVer](https://semver.org/lang/es/).

## [0.3.0] - 2026-07-08

### Añadido — Núcleo KRONOS completo

- **@kronos/cymatic-440**: FFT radix-2 puro, detección de ancla 440 Hz, análisis multibanda, patrones Chladni, visualización ASCII/SVG. 13 tests.
- **@kronos/consent**: Gestión de consentimiento vocal con 11 scopes granulares, cadena inmutable grant→revoke→re-grant, hash canónico determinista. 25 tests.
- **@kronos/audit**: Log inmutable con cadena de hashes, 16 acciones auditables, export NOM-151. 21 tests.
- **@kronos/kronos-core**: Pipeline completo (capture→hash→consent→cymatic→confidence→decide→explain→audit) con abstención honesta. 12 tests.
- **apps/web VERIFIED**: Landing con demo estática generada desde fixtures reales en build-time.

### Añadido — Infraestructura

- Monorepo pnpm + Turborepo con 7 packages.
- Biome como linter/formatter unificado.
- GitHub Actions: `ci.yml`, `sbom.yml`, `verify-seal.yml`, `deploy-pages.yml`, `codeql.yml`, `security.yml`, `validate-certificate.yml`.
- `.devcontainer/` para entorno reproducible.

### Cambiado

- Migración de `certificate/` a `provenance/2607086319439/` como raíz documental inmutable.
- `packages/crypto` y `packages/shared` requieren `@types/node`.

### Corregido

- `cymatic-440`: `anchor.confidence` clampeada a [0..1] (era 45.548).
- `consent`: dos tests mal escritos que no reflejaban la lógica de conflictos unidireccionales.
- `kronos-core`: import sin usar en `decide.ts`.

## [0.2.0] - 2026-07-08

### Añadido
- Estructura de monorepo con pnpm workspaces.
- Paquetes base `@kronos/shared`, `@kronos/crypto`.
- Landing inicial en `apps/web` (Astro).
- Configuración de Biome, Turbo, TypeScript estricto.

## [0.1.0] - 2026-07-08

### Añadido
- Registro Safe Creative 2607086319439.
- Anclaje Ethereum `0x8ca8...970e`.
- 41 archivos base: gobernanza, seguridad, docs, workflows.
- Acta Fundacional en `docs/acta-fundacional.md`.
- Certificados legales en PDF.
- Estructura `provenance/` inicial.

[0.3.0]: https://github.com/Marcorojas17/Movimiento-simbi-tico-digital/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Marcorojas17/Movimiento-simbi-tico-digital/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Marcorojas17/Movimiento-simbi-tico-digital/releases/tag/v0.1.0
