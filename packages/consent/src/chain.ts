import type { ConsentRecord } from './types.js';
import type { ChainVerification } from './types.js';
import { hashConsentContent } from './hash.js';

/**
 * ConsentChain: secuencia inmutable de registros de consentimiento
 * encadenados por hash. Cada nuevo registro (grant, revoke, re-grant)
 * referencia el hash del anterior.
 *
 * Sirve como base para NOM-151 y para auditoría posterior.
 */
export class ConsentChain {
  private records: ConsentRecord[] = [];

  constructor(initial: ConsentRecord[] = []) {
    for (const r of initial) this.append(r);
  }

  /**
   * Añade un registro al final de la cadena.
   * Valida: hash propio correcto + previousHash apunta al último.
   */
  append(record: ConsentRecord): void {
    // 1. Validar que el hash propio sea correcto
    const { hash, ...rest } = record;
    const expected = hashConsentContent(rest as unknown as Record<string, unknown>);
    if (expected !== hash) {
      throw new Error(`record ${record.id}: own hash mismatch`);
    }

    // 2. Validar encadenamiento
    const last = this.records[this.records.length - 1];
    if (last === undefined) {
      if (record.previousHash !== null) {
        throw new Error(`record ${record.id}: first record must have previousHash=null`);
      }
    } else if (record.previousHash !== last.hash) {
      throw new Error(
        `record ${record.id}: previousHash does not match last record (expected ${last.hash}, got ${record.previousHash})`,
      );
    }

    this.records.push(record);
  }

  /** Verifica toda la cadena sin modificar su estado. */
  verify(): ChainVerification {
    for (let i = 0; i < this.records.length; i++) {
      const r = this.records[i];

      // Hash propio
      const { hash, ...rest } = r;
      const expected = hashConsentContent(rest as unknown as Record<string, unknown>);
      if (expected !== hash) {
        return { valid: false, reason: `hash mismatch at record ${r.id}`, brokenAt: i };
      }

      // Encadenamiento
      const prev = this.records[i - 1];
      if (i === 0) {
        if (r.previousHash !== null) {
          return { valid: false, reason: `first record must have previousHash=null`, brokenAt: 0 };
        }
      } else if (r.previousHash !== prev.hash) {
        return {
          valid: false,
          reason: `previousHash mismatch at record ${r.id}`,
          brokenAt: i,
        };
      }
    }
    return { valid: true };
  }

  current(): ConsentRecord | null {
    return this.records.length ? this.records[this.records.length - 1] : null;
  }

  history(): readonly ConsentRecord[] {
    return this.records;
  }

  length(): number {
    return this.records.length;
  }

  clear(): void {
    this.records = [];
  }
}
