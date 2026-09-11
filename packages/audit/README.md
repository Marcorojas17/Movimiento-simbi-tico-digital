]633;E;echo '# 🔐 @kronos/audit';c3eaaf31-1e0e-434c-be18-e957049dd4e9]633;C# 🔐 @kronos/audit

Log de auditoría inmutable con cadena de hashes (blockchain-lite interno).

## ¿Por qué existe?

Cada decisión de KRONOS debe ser trazable: quién, cuándo, qué.
Este package construye la cadena de custodia interna que une
las entradas por hash, de forma que alterar el pasado sea
detectable de inmediato.

## Conceptos

- AuditEntry: una entrada firmada (UUID, timestamp, actor, acción, payload).
- AuditChain: secuencia de entradas encadenadas por hash.
- AuditAction: vocabulario cerrado de acciones auditables.
- verifyAuditChain(): función pura que valida una cadena completa.

## API

- createAuditEntry(actor, action, payload, previousHash, options)
- verifyAuditChain(entries) -> ChainVerification
- AuditChain (clase): record, append, verify, current, history, toJSON
- exportNom151(entries, at) -> Nom151Export

## Cumplimiento

- NOM-151-SCFI-2016: conservación de mensajes de datos.
- Trazabilidad completa para auditoría legal.
- Base para firma GPG posterior (Fase 4).

## Licencia

MIT — parte del Movimiento de Co-Creatividad Simbiotica.
Acta 2607086319439.
