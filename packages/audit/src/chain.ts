import { hashAuditContent } from './hash.js';
import type {
  AuditActor,
  AuditAction,
  AuditEntry,
  ChainVerification,
  AppendOptions,
} from './types.js';
import { createAuditEntry } from './entry.js';
import { verifyAuditChain } from './verify.js';

export class AuditChain {
  private entries: AuditEntry[] = [];

  constructor(initial: readonly AuditEntry[] = []) {
    for (const entry of initial) this.append(entry);
  }

  append(entry: AuditEntry): void {
    const { hash, ...rest } = entry;
    const expected = hashAuditContent(rest as unknown as Record<string, unknown>);
    if (expected !== hash) {
      throw new Error(`entry ${entry.id}: own hash mismatch`);
    }

    const last = this.entries[this.entries.length - 1];
    if (last === undefined) {
      if (entry.previousHash !== null) {
        throw new Error(`entry ${entry.id}: first entry must have previousHash=null`);
      }
    } else if (entry.previousHash !== last.hash) {
      throw new Error(`entry ${entry.id}: previousHash does not match last entry`);
    }

    this.entries.push(entry);
  }

  record(
    actor: AuditActor,
    action: AuditAction,
    payload: Record<string, unknown> = {},
    options: AppendOptions = {},
  ): AuditEntry {
    const last = this.entries[this.entries.length - 1];
    const previousHash = last ? last.hash : null;
    const entry = createAuditEntry(actor, action, payload, previousHash, options);
    this.entries.push(entry);
    return entry;
  }

  verify(): ChainVerification {
    return verifyAuditChain(this.entries);
  }

  current(): AuditEntry | null {
    return this.entries.length ? this.entries[this.entries.length - 1] : null;
  }

  history(): readonly AuditEntry[] {
    return this.entries;
  }

  length(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }

  toJSON(): readonly AuditEntry[] {
    return this.entries;
  }
}
