import { describe, it, expect } from 'vitest';
import { AuditChain, exportNom151, serializeNom151 } from '../src/index.js';

const ACTOR = { id: 'user-1', kind: 'human' as const };
const AT = 1_700_000_000_000;

describe('exportNom151', () => {
  it('exporta una cadena vacía', () => {
    const exp = exportNom151([], AT);
    expect(exp.entries).toBe(0);
    expect(exp.firstHash).toBeNull();
    expect(exp.lastHash).toBeNull();
    expect(exp.chain).toEqual([]);
    expect(exp.exportedAt).toBe(AT);
  });

  it('exporta una cadena poblada', () => {
    const chain = new AuditChain();
    chain.record(ACTOR, 'system.bootstrap', {}, { at: AT, id: 'e1' });
    chain.record(ACTOR, 'consent.granted', {}, { at: AT + 1, id: 'e2' });

    const exp = exportNom151(chain.toJSON(), AT + 100);
    expect(exp.entries).toBe(2);
    expect(exp.firstHash).toBe(chain.history()[0].hash);
    expect(exp.lastHash).toBe(chain.history()[1].hash);
    expect(exp.chain.length).toBe(2);
  });

  it('exportId es determinista para el mismo contenido y tiempo', () => {
    const chain = new AuditChain();
    chain.record(ACTOR, 'system.bootstrap', {}, { at: AT, id: 'e1' });

    const a = exportNom151(chain.toJSON(), AT + 100);
    const b = exportNom151(chain.toJSON(), AT + 100);
    expect(a.exportId).toBe(b.exportId);
  });

  it('serializeNom151 produce JSON válido', () => {
    const chain = new AuditChain();
    chain.record(ACTOR, 'system.bootstrap', {}, { at: AT, id: 'e1' });

    const exp = exportNom151(chain.toJSON(), AT + 100);
    const json = serializeNom151(exp);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.entries).toBe(1);
    expect(Array.isArray(parsed.chain)).toBe(true);
  });
});
