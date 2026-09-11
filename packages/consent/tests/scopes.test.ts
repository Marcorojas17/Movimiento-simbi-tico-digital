import { describe, it, expect } from 'vitest';
import {
  CONSENT_SCOPES,
  SCOPE_REGISTRY,
  isKnownScope,
  hasScope,
  hasAllScopes,
  hasAnyScope,
  validateScopes,
} from '../src/index.js';

describe('SCOPE_REGISTRY', () => {
  it('contiene una definición para cada scope', () => {
    for (const scope of CONSENT_SCOPES) {
      expect(SCOPE_REGISTRY[scope]).toBeDefined();
      expect(SCOPE_REGISTRY[scope].id).toBe(scope);
    }
  });

  it('los requisitos declarados son scopes válidos', () => {
    for (const def of Object.values(SCOPE_REGISTRY)) {
      for (const req of def.requires) {
        expect(isKnownScope(req)).toBe(true);
      }
      for (const c of def.conflicts) {
        expect(isKnownScope(c)).toBe(true);
      }
    }
  });
});

describe('helpers', () => {
  it('isKnownScope discrimina correctamente', () => {
    expect(isKnownScope('voice:capture')).toBe(true);
    expect(isKnownScope('voice:nope')).toBe(false);
  });

  it('hasScope / hasAllScopes / hasAnyScope', () => {
    const scopes = ['voice:capture', 'voice:analyze'] as const;
    expect(hasScope([...scopes], 'voice:capture')).toBe(true);
    expect(hasAllScopes([...scopes], ['voice:capture', 'voice:analyze'])).toBe(true);
    expect(hasAllScopes([...scopes], ['voice:capture', 'voice:store'])).toBe(false);
    expect(hasAnyScope([...scopes], ['voice:store', 'voice:analyze'])).toBe(true);
  });
});

describe('validateScopes', () => {
  it('acepta un conjunto simple válido', () => {
    const r = validateScopes(['voice:capture', 'voice:analyze']);
    expect(r.valid).toBe(true);
  });

  it('rechaza un scope desconocido', () => {
    const r = validateScopes(['voice:capture', 'voice:nope'] as unknown as string[]);
    expect(r.valid).toBe(false);
    expect(r.unknown).toContain('voice:nope');
  });

  it('detecta requisitos faltantes', () => {
    const r = validateScopes(['voice:analyze']);
    expect(r.valid).toBe(false);
    expect(r.missingRequirements).toContain('voice:capture');
  });

  it('detecta conflictos (data:delete vs voice:store)', () => {
    const r = validateScopes(['voice:store', 'data:delete']);
    expect(r.valid).toBe(false);
    expect(r.conflicts).toContain('data:delete');
  });
});
