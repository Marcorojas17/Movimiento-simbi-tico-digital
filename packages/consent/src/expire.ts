import type { ConsentRecord, ConsentStatus } from './types.js';

/**
 * Determina el estado efectivo de un registro en un momento dado.
 * Prioridad: revoked > expired > active.
 */
export function computeStatus(
  record: ConsentRecord,
  at: number = Date.now(),
): ConsentStatus {
  if (record.revokedAt !== null) return 'revoked';
  if (record.expiresAt !== null && at >= record.expiresAt) return 'expired';
  return 'active';
}

export function isActive(
  record: ConsentRecord,
  at: number = Date.now(),
): boolean {
  return computeStatus(record, at) === 'active';
}

export function isExpired(
  record: ConsentRecord,
  at: number = Date.now(),
): boolean {
  return computeStatus(record, at) === 'expired';
}

/** Devuelve una copia del registro con el status recalculado a `at`. */
export function refreshStatus(
  record: ConsentRecord,
  at: number = Date.now(),
): ConsentRecord {
  const status = computeStatus(record, at);
  if (status === record.status) return record;
  return { ...record, status };
}
