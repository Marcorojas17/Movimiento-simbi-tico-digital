import { describe, it, expect } from 'vitest';
import { KRONOS_LIMITS, describeLimits } from '../src/index.js';

describe('KRONOS_LIMITS', () => {
  it('declara capacidades explícitas', () => {
    expect(KRONOS_LIMITS.can.length).toBeGreaterThan(0);
    expect(KRONOS_LIMITS.cannot.length).toBeGreaterThan(0);
    expect(KRONOS_LIMITS.will_not.length).toBeGreaterThan(0);
  });

  it('declara que NO puede distinguir con certeza IA vs humano', () => {
    const joined = KRONOS_LIMITS.cannot.join(' ').toLowerCase();
    expect(joined).toMatch(/ia|clonada/);
  });

  it('declara que NO emitirá "ai" por defecto', () => {
    const joined = KRONOS_LIMITS.will_not.join(' ').toLowerCase();
    expect(joined).toMatch(/ai/);
  });

  it('describeLimits() produce texto markdown', () => {
    const txt = describeLimits();
    expect(txt).toContain('## KRONOS puede');
    expect(txt).toContain('## KRONOS NO puede');
    expect(txt).toContain('## KRONOS NO hará');
  });
});
