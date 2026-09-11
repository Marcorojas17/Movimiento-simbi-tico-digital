import { describe, it, expect } from 'vitest';
import { detect440, detectAnchor, CYMATIC_ANCHOR_HZ } from '../src/index.js';

function sine(freq: number, sampleRate: number, durationSec: number): Float32Array {
  const n = Math.floor(sampleRate * durationSec);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    out[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate);
  }
  return out;
}

function addNoise(signal: Float32Array, amplitude: number): Float32Array {
  const out = new Float32Array(signal.length);
  for (let i = 0; i < signal.length; i++) {
    out[i] = signal[i] + (Math.random() * 2 - 1) * amplitude;
  }
  return out;
}

describe('detect440', () => {
  const SR = 44100;

  it('detecta una onda pura de 440 Hz', () => {
    const result = detect440(sine(440, SR, 0.5), SR);
    expect(result.detected).toBe(true);
    expect(Math.abs(result.frequency - 440)).toBeLessThan(5);
    expect(result.confidence).toBeGreaterThan(0.15);
  });

  it('NO detecta una onda de 300 Hz', () => {
    const result = detect440(sine(300, SR, 0.5), SR);
    expect(result.detected).toBe(false);
  });

  it('NO detecta una onda de 600 Hz', () => {
    const result = detect440(sine(600, SR, 0.5), SR);
    expect(result.detected).toBe(false);
  });

  it('detecta 440 Hz aunque haya ruido moderado', () => {
    const clean = sine(440, SR, 0.5);
    const noisy = addNoise(clean, 0.1);
    const result = detect440(noisy, SR);
    expect(result.detected).toBe(true);
  });

  it('respeta tolerancia personalizada', () => {
    const result = detectAnchor(sine(442, SR, 0.5), SR, { toleranceHz: 1 });
    expect(result.detected).toBe(false);
  });

  it('usa 440 como ancla por defecto', () => {
    expect(CYMATIC_ANCHOR_HZ).toBe(440);
    const result = detect440(sine(440, SR, 0.5), SR);
    expect(result.frequency).toBeGreaterThan(435);
    expect(result.frequency).toBeLessThan(445);
  });

  it('rechaza señales demasiado cortas', () => {
    expect(() => detect440(new Float32Array(10), SR)).toThrow();
  });
});
