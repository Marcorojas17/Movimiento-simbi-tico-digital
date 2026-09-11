]633;E;echo '# 🧠 @kronos/kronos-core';c3eaaf31-1e0e-434c-be18-e957049dd4e9]633;C# 🧠 @kronos/kronos-core

Núcleo del verificador de autenticidad vocal y procedencia digital.
Orquesta cymatic-440 + consent + audit + crypto en un único pipeline.

## Pipeline

  audio -> capture -> hash -> consent -> cymatic -> confidence -> decide -> explain -> audit

## Regla de oro: abstención honesta

KRONOS prefiere ABSTENERSE antes que mentir. Emite veredicto solo
cuando:

  1. La captura es válida (formato + duración mínima).
  2. Existe consentimiento explícito y activo para voice:capture + voice:analyze.
  3. La confianza combinada supera el umbral (por defecto 0.65).

Si cualquiera de esas condiciones falla, verdict = abstain con razón explícita.

## Veredictos

- human    : firma vocal con ancla 440 Hz confirmada
- abstain  : no hay certeza suficiente, o falta consentimiento, o captura inválida
- ai       : NO se emite en v0.1.0 (ver limits.ts para el porqué)

## API

- runKronos(audio, options) -> KronosResult
- captureAudio(input, minDurationMs) -> CaptureResult
- checkConsent(consent, subjectId, at) -> ConsentCheck
- analyzeCymatic(samples, sampleRate) -> CymaticAnalysis
- computeConfidence(input) -> number
- decide(input) -> Decision
- explainDecision(decision, threshold) -> Explanation
- describeLimits() -> string

## Cumplimiento

- Consentimiento explícito por scope (NOM-151, LFPDPPP, GDPR).
- Auditoría inmutable de cada decisión.
- Explicabilidad obligatoria de cada veredicto.
- Límites publicados: sabemos qué NO podemos hacer.

## Licencia

MIT — parte del Movimiento de Co-Creatividad Simbiotica.
Acta 2607086319439.
