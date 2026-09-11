import { describe, it, expect } from 'vitest';
import {
  createConsent,
  revokeConsent,
  computeStatus,
  isActive,
  isExpired,
  ConsentChain,
  hashConsentContent,
} from '../src/index.js';

const SUBJECT = { id: 'user-1', name: 'Marco', language: 'es-MX' as const };
const GRANTOR = { id: 'user-1', email: 'marco.a.rojas.v@hotmail.com' };
const AT = 1_700_000_000_000;

describe('createConsent', () => {
  it('crea un registro activo con hash', () => {
    const r = createConsent(SUBJECT, GRANTOR, ['voice:capture', 'voice:analyze'], {
      at: AT,
      id: 'c-1',
    });
    expect(r.id).toBe('c-1');
    expect(r.status).toBe('active');
    expect(r.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(r.scopes).toContain('voice:capture');
    expect(r.createdAt).toBe(AT);
    expect(r.expiresAt).toBeNull();
  });

  it('rechaza scopes inválidos', () => {
    expect(() =>
      createConsent(SUBJECT, GRANTOR, ['voice:analyze']),
    ).toThrow(/invalid scopes/);
  });

  it('rechaza sin scopes', () => {
    expect(() => createConsent(SUBJECT, GRANTOR, [])).toThrow(/at least one/);
  });

  it('respeta expiresIn', () => {
    const r = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      expiresIn: 1000,
    });
    expect(r.expiresAt).toBe(AT + 1000);
  });

  it('es determinista para el mismo contenido', () => {
    const a = createConsent(SUBJECT, GRANTOR, ['voice:capture'], { at: AT, id: 'x' });
    const b = createConsent(SUBJECT, GRANTOR, ['voice:capture'], { at: AT, id: 'x' });
    expect(a.hash).toBe(b.hash);
  });
});

describe('computeStatus / isActive / isExpired', () => {
  it('activo dentro del plazo', () => {
    const r = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      expiresIn: 10_000,
    });
    expect(computeStatus(r, AT + 5000)).toBe('active');
    expect(isActive(r, AT + 5000)).toBe(true);
    expect(isExpired(r, AT + 5000)).toBe(false);
  });

  it('expirado después del plazo', () => {
    const r = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      expiresIn: 1000,
    });
    expect(computeStatus(r, AT + 2000)).toBe('expired');
    expect(isExpired(r, AT + 2000)).toBe(true);
  });

  it('revocado tiene prioridad sobre expirado', () => {
    const r = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      expiresIn: 1000,
    });
    const rev = revokeConsent(r, { reason: 'user request', at: AT + 500 });
    expect(computeStatus(rev, AT + 2000)).toBe('revoked');
  });
});

describe('revokeConsent', () => {
  it('crea un nuevo registro con previousHash', () => {
    const original = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      id: 'c-1',
    });
    const rev = revokeConsent(original, { reason: 'privacy', at: AT + 1000, id: 'c-2' });
    expect(rev.status).toBe('revoked');
    expect(rev.previousHash).toBe(original.hash);
    expect(rev.revokedReason).toBe('privacy');
    expect(rev.revokedAt).toBe(AT + 1000);
  });

  it('rechaza revocar dos veces', () => {
    const original = createConsent(SUBJECT, GRANTOR, ['voice:capture'], { at: AT });
    const rev = revokeConsent(original, { reason: 'x', at: AT + 1 });
    expect(() => revokeConsent(rev, { reason: 'y', at: AT + 2 })).toThrow(/already revoked/);
  });

  it('exige motivo', () => {
    const original = createConsent(SUBJECT, GRANTOR, ['voice:capture'], { at: AT });
    expect(() => revokeConsent(original, { reason: '' })).toThrow(/reason/);
  });
});

describe('ConsentChain', () => {
  it('acepta una cadena vacía como válida', () => {
    const chain = new ConsentChain();
    expect(chain.verify().valid).toBe(true);
    expect(chain.length()).toBe(0);
  });

  it('encadena grant → revoke', () => {
    const grant = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      id: 'g',
    });
    const rev = revokeConsent(grant, { reason: 'x', at: AT + 1, id: 'r' });

    const chain = new ConsentChain([grant, rev]);
    expect(chain.verify().valid).toBe(true);
    expect(chain.length()).toBe(2);
    expect(chain.current()?.id).toBe('r');
  });

  it('detecta cadena rota si se altera un registro', () => {
    const grant = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      id: 'g',
    });
    const rev = revokeConsent(grant, { reason: 'x', at: AT + 1, id: 'r' });

    // Simular manipulación: alterar el hash del primer registro.
    // El validador debe rechazarlo con "own hash mismatch".
    const tampered = { ...grant, hash: 'f'.repeat(64) };

    const chain = new ConsentChain();
    expect(() => chain.append(tampered)).toThrow(/own hash mismatch/);

    // La cadena original (con el grant sin manipular) sí debe aceptarse.
    const cleanChain = new ConsentChain([grant, rev]);
    expect(cleanChain.verify().valid).toBe(true);
  });

  it('rechaza append si el registro anterior no fue aceptado', () => {
    // Si la cadena está vacía y el registro tiene previousHash !== null,
    // el validador lo rechaza para evitar huérfanos.
    const grant = createConsent(SUBJECT, GRANTOR, ['voice:capture'], {
      at: AT,
      id: 'g',
    });
    const rev = revokeConsent(grant, { reason: 'x', at: AT + 1, id: 'r' });

    const chain = new ConsentChain();
    expect(() => chain.append(rev)).toThrow(/first record must have previousHash=null/);
  });

  it('rechaza si previousHash no coincide', () => {
    const g1 = createConsent(SUBJECT, GRANTOR, ['voice:capture'], { at: AT, id: 'g1' });
    const g2 = createConsent(SUBJECT, GRANTOR, ['voice:capture'], { at: AT + 1, id: 'g2' });
    // g2 no apunta a g1 (previousHash=null)
    const chain = new ConsentChain();
    chain.append(g1);
    expect(() => chain.append(g2)).toThrow(/previousHash/);
  });
});

describe('hashConsentContent', () => {
  it('es determinista ante orden de claves', () => {
    const a = hashConsentContent({ a: 1, b: 2 });
    const b = hashConsentContent({ b: 2, a: 1 });
    expect(a).toBe(b);
  });
});
