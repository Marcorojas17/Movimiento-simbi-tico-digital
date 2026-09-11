]633;E;echo '# 📜 @kronos/consent';c3eaaf31-1e0e-434c-be18-e957049dd4e9]633;C# 📜 @kronos/consent

Gestión de consentimiento vocal con trazabilidad criptográfica.
Base legal de KRONOS, compatible con NOM-151-SCFI-2016 y LFPDPPP art. 7.

## ¿Por qué existe?

Sin consentimiento explícito, verificable y revocable, ninguna
herramienta de análisis vocal es legal. Este package garantiza:

- Consentimiento expreso por scope (no hay permiso global).
- Cadena inmutable de cambios (grant -> revoke -> re-grant).
- Hash SHA-256 determinista de cada registro.
- Expiracion automatica y revocacion con motivo.

## Conceptos

- ConsentRecord: un registro firmable e inmutable.
- ConsentScope: permiso granular (voice:capture, voice:ai-training, etc.).
- ConsentChain: secuencia de registros encadenados por hash.

## API

- createConsent(subject, grantor, scopes, options)
- revokeConsent(previous, { reason, at })
- computeStatus(record, at) -> active | revoked | expired
- isActive(record, at)
- ConsentChain — clase con append, verify, current, history

## Ejemplo de ciclo de vida

  grant = createConsent(subject, grantor, ["voice:capture", "voice:analyze"])
  rev   = revokeConsent(grant, { reason: "user request" })
  chain = new ConsentChain([grant, rev])
  chain.verify() // -> { valid: true }

## Cumplimiento

- NOM-151-SCFI-2016: conservacion de mensajes de datos.
- LFPDPPP art. 7: consentimiento en lengua materna (es-MX, nah, yua, cpa).
- GDPR art. 7: consentimiento libre, especifico, informado, revocable.

## Licencia

MIT — parte del Movimiento de Co-Creatividad Simbiotica.
Acta 2607086319439.
