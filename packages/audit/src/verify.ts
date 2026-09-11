import type { AuditEntry, ChainVerification } from './types.js';
import { hashAuditContent } from './hash.js';

/**
 * Verificación pura y sin estado de una cadena de entradas.
 * No modifica nada y no lanza excepciones: devuelve un resultado.
 * Sirve tanto para cadenas válidas como para cadenas manipuladas.
 */
export function verifyAuditChain(
  entries: readonly AuditEntry[],
): ChainVerification {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    const { hash, ...rest } = entry;
    const expected = hashAuditContent(rest as unknown as Record<string, unknown>);
    if (expected !== hash) {
      return {
        valid: false,
        brokenAt: i,
        reason: `entry ${entry.id}: own hash mismatch`,
        length: entries.length,
      };
    }

    const prev = entries[i - 1];
    if (i === 0) {
      if (entry.previousHash !== null) {
        return {
          valid: false,
          brokenAt: 0,
          reason: `entry ${entry.id}: first entry must have previousHash=null`,
          length: entries.length,
        };
      }
    } else if (entry.previousHash !== prev.hash) {
      return {
        valid: false,
        brokenAt: i,
        reason: `entry ${entry.id}: previousHash does not match previous entry`,
        length: entries.length,
      };
    }
  }

  return { valid: true, length: entries.length };
}
