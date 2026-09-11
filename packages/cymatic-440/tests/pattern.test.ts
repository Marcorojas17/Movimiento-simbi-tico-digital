import { describe, it, expect } from 'vitest';
import {
  generatePattern,
  patternDistance,
  toAscii,
  toSvg,
} from '../src/index.js';

describe('generatePattern', () => {
  it('respeta la resolución solicitada', () => {
    const p = generatePattern(440, { resolution: 8 });
    expect(p.resolution).toBe(8);
    expect(p.cells.length).toBe(64);
  });

  it('es determinista para el mismo seed', () => {
    const a = generatePattern(440, { resolution: 8 });
    const b = generatePattern(440, { resolution: 8 });
    expect(patternDistance(a, b)).toBe(0);
  });

  it('difiere para distintos seeds', () => {
    const a = generatePattern(440, { resolution: 8 });
    const b = generatePattern(880, { resolution: 8 });
    expect(patternDistance(a, b)).toBeGreaterThan(0);
  });

  it('normaliza valores a [0..1]', () => {
    const p = generatePattern(440, { resolution: 8 });
    for (const v of p.cells) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe('toAscii', () => {
  it('genera N líneas de N caracteres', () => {
    const p = generatePattern(440, { resolution: 4 });
    const art = toAscii(p);
    const lines = art.split('\n');
    expect(lines.length).toBe(4);
    for (const line of lines) expect(line.length).toBe(4);
  });
});

describe('toSvg', () => {
  it('genera SVG válido', () => {
    const p = generatePattern(440, { resolution: 4 });
    const svg = toSvg(p, { size: 64 });
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
    expect(svg).toContain('Cymatic pattern');
  });
});
