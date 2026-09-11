import { randomUUID } from 'node:crypto';
import type {
  ConsentGrantor,
  ConsentRecord,
  ConsentSubject,
  GrantOptions,
} from './types.js';
import type { ConsentScope } from './scopes.js';
import { validateScopes } from './scopes.js';
import { hashConsentContent } from './hash.js';

/**
 * Crea un nuevo registro de consentimiento vocal.
 * Valida scopes, calcula hash canónico y devuelve el registro completo.
 * No tiene efectos secundarios: todo es determinista salvo UUID y timestamp.
 */
export function createConsent(
  subject: ConsentSubject,
  grantor: ConsentGrantor,
  scopes: readonly ConsentScope[],
  options: GrantOptions = {},
): ConsentRecord {
  if (!subject.id) throw new Error('subject.id is required');
  if (!grantor.id) throw new Error('grantor.id is required');
  if (!grantor.email) throw new Error('grantor.email is required');
  if (scopes.length === 0) throw new Error('at least one scope is required');

  const validation = validateScopes(scopes);
  if (!validation.valid) {
    const parts: string[] = [];
    if (validation.unknown.length) parts.push(`unknown: ${validation.unknown.join(', ')}`);
    if (validation.missingRequirements.length)
      parts.push(`missing requirements: ${validation.missingRequirements.join(', ')}`);
    if (validation.conflicts.length)
      parts.push(`conflicts: ${validation.conflicts.join(', ')}`);
    throw new Error(`invalid scopes (${parts.join(' | ')})`);
  }

  const now = options.at ?? Date.now();
  const expiresAt =
    options.expiresIn !== undefined ? now + options.expiresIn : null;

  const draft = {
    version: 1 as const,
    id: options.id ?? randomUUID(),
    subject: {
      id: subject.id,
      name: subject.name,
      language: options.language ?? subject.language ?? 'es-MX',
    },
    grantor: { id: grantor.id, email: grantor.email },
    scopes: [...scopes].sort() as ConsentScope[],
    createdAt: now,
    updatedAt: now,
    expiresAt,
    status: 'active' as const,
    revokedAt: null,
    revokedReason: null,
    previousHash: null,
    metadata: options.metadata ?? {},
  };

  const hash = hashConsentContent(draft as unknown as Record<string, unknown>);

  return { ...draft, hash };
}
