]633;E;echo '# 🌀 @kronos/cymatic-440';c3eaaf31-1e0e-434c-be18-e957049dd4e9]633;C# 🌀 @kronos/cymatic-440

Ancla cimática a **440 Hz** — firma acústica determinista para KRONOS.

## ¿Por qué 440 Hz?

**440 Hz = A4**, la frecuencia de afinación estándar internacional (ISO 16:1975).

En KRONOS la usamos como **ancla biométrica**:

- Una voz humana natural contiene 440 Hz y sus armónicos de forma orgánica.
- Una voz clonada por IA puede imitar el tono, pero el perfil energético en la banda de 440 Hz se desvía de forma detectable.

## API

Ver los archivos en src/ para detalles. Funciones principales:

- detect440(samples, sampleRate) → AnchorResult
- analyzeBands(samples, sampleRate) → BandResult[]
- generatePattern(seedHz, options) → CymaticPattern
- toAscii(pattern) → string
- toSvg(pattern, options) → string

## Licencia

MIT — parte del Movimiento de Co-Creatividad Simbiótica. Acta 2607086319439.
