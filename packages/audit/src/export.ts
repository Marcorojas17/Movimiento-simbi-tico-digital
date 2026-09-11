import type { AuditEntry } from './types.js';

export interface Nom151Export {
  version: 1;
  exportId: string;
  exportedAt: number;
  entries: number;
  firstHash: string | null;
  lastHash: string | null;
  chain: readonly AuditEntry[];
}

export function exportNom151(
  entries: readonly AuditEntry[],
  exportedAt: number = Date.now(),
): Nom151Export {
  const first = entries[0];
  const last = entries[entries.length - 1];

  return {
    version: 1,
    exportId: buildExportId(entries, exportedAt),
    exportedAt,
    entries: entries.length,
    firstHash: first ? first.hash : null,
    lastHash: last ? last.hash : null,
    chain: entries,
  };
}

function buildExportId(entries: readonly AuditEntry[], at: number): string {
  const base = `${entries.length}|${entries[0]?.hash ?? 'empty'}|${entries[entries.length - 1]?.hash ?? 'empty'}|${at}`;
  let h = 0;
  for (let i = 0; i < base.length; i++) {
    h = (h * 31 + base.charCodeAt(i)) | 0;
  }
  return `nom151-${Math.abs(h).toString(16).padStart(8, '0')}`;
}

export function serializeNom151(exp: Nom151Export): string {
  return JSON.stringify(exp, null, 2);
}
