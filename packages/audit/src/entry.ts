import { randomUUID } from 'node:crypto';
import type { AuditActor, AuditAction, AuditEntry, AppendOptions } from './types.js';
import { AUDIT_ACTIONS } from './types.js';
import { hashAuditContent } from './hash.js';

function isKnownAction(value: string): value is AuditAction {
  return (AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function createAuditEntry(
  actor: AuditActor,
  action: AuditAction | string,
  payload: Record<string, unknown>,
  previousHash: string | null,
  options: AppendOptions = {},
): AuditEntry {
  if (!actor.id) throw new Error('actor.id is required');
  if (!actor.kind) throw new Error('actor.kind is required');
  if (!isKnownAction(action)) {
    throw new Error(`unknown audit action: ${action}`);
  }

  const draft = {
    version: 1 as const,
    id: options.id ?? randomUUID(),
    timestamp: options.at ?? Date.now(),
    actor,
    action,
    payload,
    previousHash,
  };

  const hash = hashAuditContent(draft as unknown as Record<string, unknown>);
  return { ...draft, hash };
}
