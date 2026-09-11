export type AuditActorKind = 'human' | 'system' | 'ai';

export interface AuditActor {
  id: string;
  kind: AuditActorKind;
  email?: string;
}

export const AUDIT_ACTIONS = [
  'consent.granted',
  'consent.revoked',
  'consent.expired',
  'verification.started',
  'verification.completed',
  'verification.abstained',
  'seal.created',
  'seal.verified',
  'seal.failed',
  'nom151.timestamped',
  'nom151.preserved',
  'blockchain.anchored',
  'blockchain.confirmed',
  'system.bootstrap',
  'system.migration',
  'system.error',
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export interface AuditEntry {
  version: 1;
  id: string;
  timestamp: number;
  actor: AuditActor;
  action: AuditAction;
  payload: Record<string, unknown>;
  previousHash: string | null;
  hash: string;
}

export interface AppendOptions {
  id?: string;
  at?: number;
}

export interface ChainVerification {
  valid: boolean;
  brokenAt?: number;
  reason?: string;
  length: number;
}
