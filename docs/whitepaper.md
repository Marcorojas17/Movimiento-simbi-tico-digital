# KRONOS — Whitepaper Técnico y Legal

**Verificador de autenticidad vocal con ancla cimática de 440 Hz, consentimiento granular y auditoría NOM-151**

**Versión:** 1.0
**Fecha:** 11 de septiembre de 2026
**Autor:** Marco Antonio Rojas Valdovinos
**Acta fundacional:** Safe Creative 2607086319439
**Anclaje blockchain:** Ethereum `0x8ca8e84e1258abac9acb29d14d25114e4775d782ecfda51ae29933247ed2970e`
**Firma GPG:** `E78BC761AC19FFCB`
**Contacto:** marco.a.rojas.v@hotmail.com · +52 722 586 2335

---

## Índice

1. Resumen ejecutivo
2. El problema
3. La solución
4. Arquitectura técnica
5. Cumplimiento legal
6. Casos de uso
7. Evidencia técnica
8. Límites y honestidad epistémica
9. Hoja de ruta
10. Financiamiento ético
11. Llamado a la acción

---

## 1. Resumen ejecutivo

En mayo de 2026, México reformó la Ley Federal del Derecho de Autor
(LFDA) para proteger la voz humana contra su clonación mediante
inteligencia artificial. La reforma establece multas de hasta 40,000
días de salario mínimo, pero **no proporciona infraestructura técnica
para hacer cumplir la ley**.

KRONOS llena ese vacío. Es un sistema open source que:

- Detecta la firma cimática de 440 Hz característica de la voz humana.
- Verifica consentimiento explícito, granular y revocable por scope.
- Genera una cadena de auditoría inmutable compatible con NOM-151.
- Se abstiene antes que emitir un veredicto incierto.

El sistema está construido sobre 7 packages TypeScript con 71 tests
automatizados, anclado en Safe Creative y Ethereum, y firmado con GPG.
Es el primer sistema de verificación vocal compatible con la LFDA 2026
y el primero en proponer protección digital para lenguas indígenas
mexicanas.

---

## 2. El problema

### 2.1 La reforma LFDA de mayo 2026

El 14 de mayo de 2026, el Diario Oficial de la Federación publicó una
reforma sustantiva a la Ley Federal del Derecho de Autor. Los artículos
clave:

- **Artículo 87** — La voz es un atributo de la personalidad protegido.
- **Artículo 118** — Prohibición de clonación vocal sin consentimiento.
- **Artículo 121** — Los contratos de cesión deben especificar alcance,
  duración y contraprestación.
- **Artículo 232 bis** — Multas de hasta 40,000 días de salario mínimo.

### 2.2 El vacío técnico

La reforma establece obligaciones legales sin definir mecanismos
técnicos de verificación. Los abogados tienen el marco legal, pero:

- **No existe un PSC** (Prestador de Servicios de Confianza) especializado
  en voz en México.
- **No existe jurisprudencia** aplicable todavía.
- **No existe un estándar técnico** para verificar autenticidad vocal
  con cumplimiento legal integrado.

### 2.3 El problema práctico

Un periodista mexicano cuya voz es clonada para difundir desinformación
hoy no tiene herramientas para:

1. **Probar** que su voz fue clonada sin autorización.
2. **Demostrar** que existía una versión original registrada.
3. **Bloquear** futuras clonaciones automáticamente.
4. **Presentar** evidencia admisible en juicio.

Lo mismo aplica a actores de doblaje, locutores, cantantes, políticos
y comunidades indígenas.

### 2.4 El problema de los detectores actuales

Los sistemas existentes (Pindrop, Reality Defender, ElevenLabs
Classifier) tienen tres problemas estructurales:

1. **Mienten con confianza.** Emiten veredictos con 95% de seguridad
   incluso cuando deberían abstenerse.
2. **No cumplen marcos legales específicos.** No implementan NOM-151
   ni LFDA 2026.
3. **Son cajas negras.** No explican por qué emitieron un veredicto.

---

## 3. La solución

KRONOS resuelve los tres problemas estructurales:

### 3.1 Abstención honesta

A diferencia de otros detectores, KRONOS devuelve `abstain` cuando:

- La confianza es inferior al umbral configurado (0.65 por defecto).
- No existe consentimiento válido y activo.
- La captura es inválida por formato o duración.
- La señal no contiene el ancla cimática esperada.

**Veredictos posibles:**

- `human` — firma vocal confirmada con ancla 440 Hz y confianza alta.
- `abstain` — sin certeza suficiente, o falta consentimiento.
- `ai` — **NO se emite en v0.3.0.** Requiere evidencia estadística
  superior a la que actualmente podemos ofrecer.

### 3.2 Cumplimiento legal integrado

KRONOS implementa:

- **NOM-151-SCFI-2016** — Conservación de mensajes de datos.
- **LFDA 2026** — Protección de la voz contra clonación.
- **LFPDPPP** — Consentimiento en lengua materna.
- **GDPR** — Consentimiento libre, específico, informado, revocable.

### 3.3 Explicabilidad obligatoria

Cada veredicto viene con:

- Los factores numéricos que lo sustentan.
- El umbral aplicado explícitamente.
- Una razón textual en lenguaje natural.
- La cadena de auditoría completa de la decisión.

---

## 4. Arquitectura técnica
audio → capture → hash → consent → cymatic → confidence → decide → explain → audit


**Descripción de cada etapa:**

1. **Capture** — Valida formato y duración mínima (500 ms).
2. **Hash** — Calcula SHA-256 del buffer para trazabilidad.
3. **Consent** — Verifica scopes `voice:capture` y `voice:analyze`.
4. **Cymatic** — FFT radix-2 para detectar ancla 440 Hz.
5. **Confidence** — Ponderación: 45% ancla + 20% energía + 15%
   duración + 20% consentimiento.
6. **Decide** — Aplica reglas de abstención o emite veredicto.
7. **Explain** — Documenta factores, umbral y razón.
8. **Audit** — Registra cada paso en cadena inmutable.

### 4.2 Packages del monorepo

| Package | Rol | Tests |
|---------|-----|-------|
| `@kronos/shared` | Tipos, constantes, logger | — |
| `@kronos/crypto` | SHA-256/512, AES-256-GCM | — |
| `@kronos/cymatic-440` | FFT, ancla 440 Hz, patrones Chladni | 13 |
| `@kronos/consent` | 11 scopes, cadena grant/revoke | 25 |
| `@kronos/audit` | Log inmutable, export NOM-151 | 21 |
| `@kronos/kronos-core` | Pipeline con abstención honesta | 12 |
| `@kronos/web` | Landing VERIFIED con demo | — |

**Total: 71 tests automatizados, todos verdes.**

### 4.3 Ancla cimática de 440 Hz

La frecuencia de 440 Hz (A4) es el estándar de afinación internacional
(ISO 16:1975). Es la única frecuencia musical reconocida globalmente.

**Hipótesis técnica:** la voz humana natural contiene la frecuencia de
440 Hz y sus armónicos de forma orgánica. Una voz clonada por IA puede
imitar el tono, pero el perfil energético en la banda de 440 Hz se
desvía de forma estadísticamente detectable.

**Implementación:**

- FFT radix-2 Cooley-Tukey puro, sin dependencias externas.
- Ventana de Hann para reducir fugas espectrales.
- Análisis multibanda: sub, low, mid, anchor (435-445 Hz), high.
- Patrones cimáticos inspirados en figuras de Chladni.

### 4.4 Consentimiento granular

Modelo de 11 scopes:

- `voice:capture`, `voice:analyze`, `voice:store`, `voice:derive`,
  `voice:share`, `voice:commercial`, `voice:ai-training`,
  `voice:synthetic`, `voice:post-mortem`, `data:export`, `data:delete`.

Cada consentimiento:

- Tiene hash SHA-256 canónico.
- Es revocable con motivo documentado.
- Se encadena con el anterior (`previousHash`).
- Se verifica con `ConsentChain.verify()`.

### 4.5 Auditoría inmutable

Cada decisión se registra en una cadena tipo blockchain interno:

- 16 acciones auditables (`consent.granted`, `verification.completed`, etc.).
- Encadenamiento por hash (`previousHash`).
- Export a formato NOM-151.
- Verificación reproducible por terceros.

---

## 5. Cumplimiento legal

### 5.1 NOM-151-SCFI-2016

| Requisito | Implementación |
|-----------|---------------|
| Integridad | SHA-256 al ingreso + cadena inmutable |
| Conservación | `provenance/` declarada inmutable |
| Consulta | Verificadores públicos en `provenance/verifiers/` |
| Firma electrónica | GPG `E78BC761AC19FFCB` + sello Safe Creative |
| Tercero autorizado | Safe Creative S.L. (NIF B99161739) |

### 5.2 LFDA 2026

| Artículo | Requisito | Implementación |
|----------|-----------|---------------|
| 87 | Voz protegida | Hash SHA-256 de cada captura |
| 118 | Consentimiento expreso | 11 scopes en `@kronos/consent` |
| 121 | Alcance y duración | `expiresAt` + revocación documentada |
| 232 bis | Multas | Auditoría reproducible como evidencia |

### 5.3 GDPR + LFPDPPP

- **Consentimiento libre, específico, informado, revocable.**
- **Lengua materna** (es-MX primario, nah/yua/cpa en desarrollo).
- **Derecho al olvido** (scope `data:delete`).
- **Portabilidad** (scope `data:export`).

### 5.4 ISO/IEC 27001

Controles implementados:

- A.5 Políticas de seguridad (`SECURITY.md`)
- A.8 Inventario de activos (`compliance/README.md`)
- A.9 Control de acceso (2FA + CODEOWNERS)
- A.10 Criptografía (SHA-256, AES-256-GCM, GPG)
- A.12 Seguridad operativa (CI/CD con permisos mínimos)
- A.14 Desarrollo seguro (PR reviews + 71 tests)
- A.16 Gestión de incidentes (política definida)

---

## 6. Casos de uso

### 6.1 Periodistas

**Escenario:** un periodista mexicano cuya voz es clonada para difundir
desinformación.

**Solución KRONOS:**

1. Registra su voz original con hash SHA-256.
2. Emite consentimiento limitado a usos editoriales.
3. Detecta cualquier clonación no autorizada.
4. Presenta la cadena de auditoría como prueba.

### 6.2 Actores de doblaje y locutores

**Escenario:** un actor de doblaje cuyo contrato vence pero su voz
sigue siendo usada por IA.

**Solución KRONOS:**

1. Registra sus muestras vocales por proyecto.
2. Establece scopes específicos (comercial, audiolibro, videojuego).
3. Revoca consentimiento al vencimiento del contrato.
4. Bloquea entrenamiento de IA sin autorización explícita.

### 6.3 Comunidades indígenas

**Escenario:** una comunidad de hablantes de náhuatl, maya o mixteco
cuya lengua es apropiada por terceros.

**Solución KRONOS:**

1. Registra voces como patrimonio colectivo.
2. Otorga consentimiento comunitario (no individual).
3. Protege la transmisión intergeneracional.
4. Bloquea apropiación cultural por terceros.

### 6.4 Instituciones financieras

**Escenario:** un banco que recibe llamadas donde el cliente podría
ser una voz clonada.

**Solución KRONOS:**

1. Verifica la firma cimática de la llamada.
2. Consulta el consentimiento del titular.
3. Emite `abstain` si no hay certeza — nunca un falso positivo.
4. Registra cada intento en auditoría.

### 6.5 Medios de comunicación

**Escenario:** un medio recibe un audio filtrado de un político.

**Solución KRONOS:**

1. Verifica si la voz contiene el ancla 440 Hz natural.
2. Consulta si existe consentimiento del titular.
3. Emite veredicto con factores y umbral explícitos.
4. Documenta la decisión para potencial litigio.

---

## 7. Evidencia técnica

### 7.1 Tests automatizados
@kronos/cymatic-440 → 13 tests verdes
@kronos/consent → 25 tests verdes
@kronos/audit → 21 tests verdes
@kronos/kronos-core → 12 tests verdes
─────────────────
TOTAL: 71 tests

### 7.2 Workflows CI/CD

| Workflow | Estado |
|----------|--------|
| 🧪 CI | ✅ |
| 🌐 Deploy to GitHub Pages | ✅ |
| 📦 SBOM (CycloneDX) | ✅ |
| 🔍 Validate Certificate Hash | ✅ |
| 🔐 Verify Seal & Provenance | ✅ |
| 🔁 Reproducibility Check | ✅ |
| 🛡️ SLSA Provenance | ✅ |

### 7.3 Prueba legal triple

1. **Safe Creative** — Registro `2607086319439` con validez internacional.
2. **GitHub** — Código abierto auditable en tiempo real.
3. **Ethereum** — Anclaje inmutable `0x8ca8...970e`.

### 7.4 Firma criptográfica

- Clave GPG `E78BC761AC19FFCB` (RSA 4096, sin expiración).
- Clave pública en `.well-known/gpg-key.asc`.
- Tag v0.3.0 firmado y verificable.

---

## 8. Límites y honestidad epistémica

**KRONOS es honesto sobre lo que NO puede hacer:**

### 8.1 No puede distinguir con certeza IA vs humano

El ancla 440 Hz es una **hipótesis técnica**, no una teoría validada
en corpus masivo. Requiere validación con miles de muestras reales.

### 8.2 No identifica al hablante

KRONOS no es biometría de identificación. Verifica autenticidad, no
identidad.

### 8.3 No analiza grabaciones menores a 500 ms

La duración mínima es necesaria para estabilidad estadística.

### 8.4 No funciona sin consentimiento

Sin consentimiento válido, el veredicto es automáticamente `abstain`.

### 8.5 No reemplaza peritaje forense humano

KRONOS es una herramienta de apoyo. La decisión final es humana.

### 8.6 No emite "ai" sin evidencia

En v0.3.0, KRONOS solo emite `human` o `abstain`. La emisión de `ai`
requiere evidencia estadística superior a la actual.

### 8.7 Vacíos legales reconocidos

- La reforma LFDA no define "clonación" técnicamente.
- No existe un PSC autorizado especializado en voz en México.
- No hay jurisprudencia aún.
- La armonización internacional no está completa.

---

## 9. Hoja de ruta

| Fase | Componente | Estado |
|------|-----------|--------|
| 1-6 | Núcleo + design + legal | ✅ |
| 7 | Cadena de suministro (SBOM, SLSA) | ✅ |
| 8 | App funcional en navegador | ⏳ |
| 9 | Traducciones nah/yua/cpa | ⏳ |
| 10 | Primer caso de uso real | ⏳ |
| 11 | Comunidad: 100+ contribuidores | ⏳ |
| 12 | Certificación como PSC | ⏳ 2030 |

### 9.1 Objetivos 2027

- 1,000+ stars en GitHub
- 3 alianzas con ONGs de derechos digitales
- 1 paper académico citando KRONOS
- 100 voces indígenas registradas

### 9.2 Objetivos 2028

- Certificación ISO/IEC 27001
- Primer caso judicial usando KRONOS como evidencia
- 10 contribuidores activos
- Alianzas con universidades (UNAM, ITAM, CIDE)

### 9.3 Objetivos 2030

- Estándar global de verificación vocal
- 1,000,000 de voces protegidas
- Certificación como PSC autorizado
- Presencia en políticas públicas de 5 países

---

## 10. Financiamiento ético

### 10.1 Principios de financiamiento

KRONOS se financia bajo 4 principios:

1. **Independencia.** No aceptamos fondos que exijan control editorial
   o modificación del manifiesto.
2. **Transparencia.** Cada peso recibido y gastado se publica en
   `docs/funding.md` con actualización mensual.
3. **Alineación.** Los fondos se aceptan solo si son compatibles con
   la soberanía digital y los derechos humanos.
4. **Rechazo explícito.** No aceptamos dinero de:
   - Empresas de vigilancia masiva.
   - Vendedores de armas autónomas.
   - Firmas de desinformación.

### 10.2 Fuentes de financiamiento

**Nivel 1 — Donaciones individuales:**
- GitHub Sponsors
- Ko-fi
- Buy Me a Coffee

**Nivel 2 — Consultoría especializada:**
- Auditoría LFDA 2026 para medios.
- Implementación de compliance NOM-151.
- Peritaje técnico en litigios de clonación vocal.

**Nivel 3 — Grants institucionales:**
- Mozilla Foundation (derechos digitales + tecnología).
- Ford Foundation (lenguas indígenas + justicia social).
- Open Society Foundations (derechos humanos + tecnología).
- Luminate (infraestructura cívica).

**Nivel 4 — Licenciamiento comercial (Fase 11+):**
- Licencia comercial separada del MIT para uso empresarial.
- Servicios de certificación para terceros.
- API de verificación (no SaaS cerrado).

### 10.3 Distribución de fondos

Del total de ingresos, una vez operativo:

| Concepto | % |
|----------|---|
| Mantenimiento técnico (servidores, herramientas) | 40% |
| Trabajo del fundador (dedicación parcial) | 30% |
| Fondo de becas para contribuidores | 15% |
| Registro legal y fiscal | 10% |
| Reserva para emergencias | 5% |

**Cero gastos ocultos. Transparencia mensual obligatoria.**

### 10.4 Modelo a largo plazo: fundación

El objetivo a 5 años es constituir una **fundación sin fines de lucro**
bajo el modelo de Mozilla Foundation, Signal Foundation o Creative
Commons. Esto permite:

- Recibir donaciones deducibles de impuestos.
- Postular a grants internacionales.
- Sostener el proyecto más allá del fundador.

**El fundador no busca hacerse rico con KRONOS.** Busca que KRONOS
exista y sirva cuando él ya no esté.

---

## 11. Llamado a la acción

### 11.1 Si eres periodista

Registra tu voz hoy. Es gratis, es rápido, y puede salvarte mañana.

### 11.2 Si eres desarrollador

El código es MIT. Puedes forkar, contribuir o auditar.

### 11.3 Si eres abogado

Necesitamos asesoría legal para formalizar el estándar KRONOS-1.

### 11.4 Si eres académico

Necesitamos un paper técnico sobre el ancla 440 Hz con corpus real.

### 11.5 Si eres hablante de lengua indígena

Necesitamos tu voz. Necesitamos tu lengua. Necesitamos tu consentimiento.

### 11.6 Si eres donante

Cada peso financia infraestructura que protege voces vulnerables.
No es caridad. Es infraestructura soberana.

### 11.7 Si eres institución

Ofrecemos consultoría LFDA 2026 para organizaciones que manejan
comunicación sensible.

---

## Contacto

**Marco Antonio Rojas Valdovinos** — Fundador
- Email: marco.a.rojas.v@hotmail.com
- Teléfono: +52 722 586 2335
- GitHub: [Marcorojas17](https://github.com/Marcorojas17)
- Repositorio: [Movimiento-simbi-tico-digital](https://github.com/Marcorojas17/Movimiento-simbi-tico-digital)

---

## Firma

**Acta fundacional:** Safe Creative 2607086319439
**Anclaje Ethereum:** 0x8ca8e84e1258abac9acb29d14d25114e4775d782ecfda51ae29933247ed2970e
**Firma GPG:** E78BC761AC19FFCB
**Fecha:** 11 de septiembre de 2026
**México**

> *"La simbiosis entre humanos y máquinas no es una utopía: es una decisión."*

---

**Licencia del documento:** CC BY-NC-SA 4.0
**Licencia del código:** MIT
**Licencia comercial:** contacto directo

### 4.1 Pipeline de verificación
