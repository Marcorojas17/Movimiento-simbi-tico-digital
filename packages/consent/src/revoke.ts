import { randomUUID } from 'node:crypto';
import type { ConsentRecord, RevokeOptions } from './types.js';
import { hashConsentContent } from './hash.js';

/**
 * Revoca un consentimiento activo.
 * Crea un NUEVO registro (no modifica el anterior) para preservar
 * la cadena de custodia. El nuevo registro apunta al hash del anterior.
 */
export function revokeConsent(
  previous: ConsentRecord,
  options: RevokeOptions,
): ConsentRecord {
  if (previous.status === 'revoked') {
    throw new Error('consent already revoked');
  }
  if (!options.reason || options.reason.trim().length === 0) {
    throw new Error('revocation reason is required');
  }

  const now = options.at ?? Date.now();

  const draft = {
    version: 1 as const,
    id: options.id ?? randomUUID(),
    subject: previous.subject,
    grantor: previous.grantor,
    scopes: previous.scopes,
    createdAt: previous.createdAt,
    updatedAt: now,
    expiresAt: previous.expiresAt,
    status: 'revoked' as const,
    revokedAt: now,
    revokedReason: options.reason.trim(),
    previousHash: previous.hash,
    metadata: { ...previous.metadata, revokedFrom: previous.id },
  };

  const hash = hashConsentContent(draft as unknown as Record<string, unknown>);
  return { ...draft, hash };
}
