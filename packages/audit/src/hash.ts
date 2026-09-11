import { createHash } from 'node:crypto';

export function canonicalize(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'null';

  const t = typeof value;
  if (t === 'number' || t === 'boolean') return JSON.stringify(value);
  if (t === 'string') return JSON.stringify(value);

  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']';
  }

  if (t === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const parts: string[] = [];
    for (const k of keys) {
      const v = obj[k];
      if (v === undefined) continue;
      parts.push(JSON.stringify(k) + ':' + canonicalize(v));
    }
    return '{' + parts.join(',') + '}';
  }

  return 'null';
}

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export function hashAuditContent(content: Record<string, unknown>): string {
  return sha256Hex(canonicalize(content));
}
