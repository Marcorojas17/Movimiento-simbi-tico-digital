import { describe, it, expect } from 'vitest';
import {
  AuditChain,
  createAuditEntry,
  verifyAuditChain,
  hashAuditContent,
} from '../src/index.js';

const ACTOR = {
  id: 'user-1',
  kind: 'human' as const,
  email: 'marco.a.rojas.v@hotmail.com',
};
const AT = 1_700_000_000_000;

describe('createAuditEntry', () => {
  it('crea una entrada con hash propio', () => {
    const entry = createAuditEntry(ACTOR, 'system.bootstrap', { note: 'inicio' }, null, {
      at: AT,
      id: 'e-1',
    });
    expect(entry.id).toBe('e-1');
    expect(entry.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(entry.previousHash).toBeNull();
    expect(entry.timestamp).toBe(AT);
  });

  it('rechaza acciones desconocidas', () => {
    expect(() => createAuditEntry(ACTOR, 'nope.bad', {}, null)).toThrow(
      /unknown audit action/,
    );
  });

  it('exige actor.id', () => {
    expect(() =>
      createAuditEntry({ id: '', kind: 'human' }, 'system.bootstrap', {}, null),
    ).toThrow(/actor.id/);
  });

  it('es determinista para el mismo contenido', () => {
    const a = createAuditEntry(ACTOR, 'system.bootstrap', { x: 1 }, null, {
      at: AT,
      id: 'x',
    });
    const b = createAuditEntry(ACTOR, 'system.bootstrap', { x: 1 }, null, {
      at: AT,
      id: 'x',
    });
    expect(a.hash).toBe(b.hash);
  });
});

describe('verifyAuditChain', () => {
  it('acepta una cadena vacía', () => {
    const r = verifyAuditChain([]);
    expect(r.valid).toBe(true);
    expect(r.length).toBe(0);
  });

  it('acepta una cadena de una entrada', () => {
    const e = createAuditEntry(ACTOR, 'system.bootstrap', {}, null, { at: AT, id: 'e1' });
    const r = verifyAuditChain([e]);
    expect(r.valid).toBe(true);
    expect(r.length).toBe(1);
  });

  it('detecta payload alterado (hash propio)', () => {
    const e = createAuditEntry(ACTOR, 'system.bootstrap', {}, null, { at: AT, id: 'e1' });
    const tampered = { ...e, payload: { tampered: true } };
    const r = verifyAuditChain([tampered]);
    expect(r.valid).toBe(false);
    expect(r.brokenAt).toBe(0);
    expect(r.reason).toMatch(/own hash mismatch/);
  });

  it('detecta previousHash inventado en el primero', () => {
    const e = createAuditEntry(ACTOR, 'system.bootstrap', {}, null, { at: AT, id: 'e1' });
    const tampered = { ...e, previousHash: 'f'.repeat(64) };
    const r = verifyAuditChain([tampered]);
    expect(r.valid).toBe(false);
  });
});

describe('AuditChain', () => {
  it('acepta constructor vacío', () => {
    const chain = new AuditChain();
    expect(chain.verify().valid).toBe(true);
    expect(chain.length()).toBe(0);
    expect(chain.current()).toBeNull();
  });

  it('registra entradas secuenciales encadenadas', () => {
    const chain = new AuditChain();
    const e1 = chain.record(ACTOR, 'system.bootstrap', { note: 'start' }, { at: AT, id: 'e1' });
    const e2 = chain.record(
      ACTOR,
      'consent.granted',
      { scope: 'voice:capture' },
      { at: AT + 1, id: 'e2' },
    );

    expect(e1.previousHash).toBeNull();
    expect(e2.previousHash).toBe(e1.hash);
    expect(chain.length()).toBe(2);
    expect(chain.verify().valid).toBe(true);
    expect(chain.current()?.id).toBe('e2');
  });

  it('rechaza append con hash propio alterado', () => {
    const chain = new AuditChain();
    const e = createAuditEntry(ACTOR, 'system.bootstrap', {}, null, { at: AT, id: 'e1' });
    const tampered = { ...e, hash: 'f'.repeat(64) };
    expect(() => chain.append(tampered)).toThrow(/own hash mismatch/);
  });

  it('rechaza append con previousHash incorrecto', () => {
    const chain = new AuditChain();
    const e1 = createAuditEntry(ACTOR, 'system.bootstrap', {}, null, { at: AT, id: 'e1' });
    chain.append(e1);

    const e2Bad = createAuditEntry(
      ACTOR,
      'consent.granted',
      {},
      'f'.repeat(64),
      { at: AT + 1, id: 'e2' },
    );
    expect(() => chain.append(e2Bad)).toThrow(/previousHash/);
  });

  it('rechaza append del primer elemento con previousHash no-null', () => {
    const chain = new AuditChain();
    const e = createAuditEntry(
      ACTOR,
      'system.bootstrap',
      {},
      'a'.repeat(64),
      { at: AT, id: 'e1' },
    );
    expect(() => chain.append(e)).toThrow(/first entry must have previousHash=null/);
  });

  it('clear vacía la cadena', () => {
    const chain = new AuditChain();
    chain.record(ACTOR, 'system.bootstrap', {}, { at: AT });
    chain.clear();
    expect(chain.length()).toBe(0);
    expect(chain.verify().valid).toBe(true);
  });

  it('cadena completa (bootstrap → grant → verify → seal) es válida', () => {
    const chain = new AuditChain();
    chain.record(ACTOR, 'system.bootstrap', { version: '0.1.0' }, { at: AT, id: 'e1' });
    chain.record(ACTOR, 'consent.granted', { scope: 'voice:capture' }, { at: AT + 1, id: 'e2' });
    chain.record(ACTOR, 'verification.started', { audioHash: 'abc123' }, { at: AT + 2, id: 'e3' });
    chain.record(ACTOR, 'verification.completed', { confidence: 0.87 }, { at: AT + 3, id: 'e4' });
    chain.record(ACTOR, 'seal.created', { algo: 'sha256' }, { at: AT + 4, id: 'e5' });

    expect(chain.length()).toBe(5);
    expect(chain.verify().valid).toBe(true);
  });
});

describe('hashAuditContent', () => {
  it('es determinista ante orden de claves', () => {
    expect(hashAuditContent({ a: 1, b: 2 })).toBe(hashAuditContent({ b: 2, a: 1 }));
  });

  it('cambia si cambia el contenido', () => {
    expect(hashAuditContent({ a: 1 })).not.toBe(hashAuditContent({ a: 2 }));
  });
});
