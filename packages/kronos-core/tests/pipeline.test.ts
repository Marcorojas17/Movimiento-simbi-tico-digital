import { describe, it, expect } from 'vitest';
import { createConsent } from '@kronos/consent';
import { runKronos } from '../src/index.js';

const AT = 1_700_000_000_000;
const SUBJECT_ID = 'marco';
const SUBJECT = { id: SUBJECT_ID, name: 'Marco', language: 'es-MX' as const };
const GRANTOR = { id: SUBJECT_ID, email: 'marco.a.rojas.v@hotmail.com' };

function sine(freq: number, sr: number, ms: number): Float32Array {
  const n = Math.floor((sr * ms) / 1000);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = Math.sin((2 * Math.PI * freq * i) / sr);
  return out;
}

function makeValidConsent() {
  return createConsent(SUBJECT, GRANTOR, ['voice:capture', 'voice:analyze'], {
    at: AT - 1000,
    id: 'c-test',
  });
}

describe('runKronos — happy path', () => {
  it('detecta firma 440 Hz con consentimiento válido', () => {
    const consent = makeValidConsent();
    const result = runKronos(
      { samples: sine(440, 44100, 1500), sampleRate: 44100, format: 'pcm-f32' },
      { consent, subjectId: SUBJECT_ID, at: AT },
    );

    expect(result.verdict).toBe('human');
    expect(result.confidence).toBeGreaterThan(0.65);
    expect(result.anchor.detected).toBe(true);
    expect(result.audioHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.auditEntryCount).toBeGreaterThanOrEqual(2);
    expect(result.explanation.summary).toMatch(/confirma firma vocal humana/);
  });

  it('genera hash distinto para audios distintos', () => {
    const consent = makeValidConsent();
    const a = runKronos(
      { samples: sine(440, 44100, 1500), sampleRate: 44100, format: 'pcm-f32' },
      { consent, subjectId: SUBJECT_ID, at: AT },
    );
    const b = runKronos(
      { samples: sine(441, 44100, 1500), sampleRate: 44100, format: 'pcm-f32' },
      { consent, subjectId: SUBJECT_ID, at: AT },
    );
    expect(a.audioHash).not.toBe(b.audioHash);
  });
});

describe('runKronos — abstention cases', () => {
  it('se abstiene sin consentimiento', () => {
    const result = runKronos(
      { samples: sine(440, 44100, 1500), sampleRate: 44100, format: 'pcm-f32' },
      { consent: null, subjectId: SUBJECT_ID, at: AT },
    );

    expect(result.verdict).toBe('abstain');
    expect(result.decision.reason).toMatch(/consent/);
    expect(result.confidence).toBe(0);
  });

  it('se abstiene si el consentimiento es de otro sujeto', () => {
    const consent = makeValidConsent();
    const result = runKronos(
      { samples: sine(440, 44100, 1500), sampleRate: 44100, format: 'pcm-f32' },
      { consent, subjectId: 'otro-sujeto', at: AT },
    );
    expect(result.verdict).toBe('abstain');
    expect(result.decision.reason).toMatch(/subject/);
  });

  it('se abstiene si el consentimiento está revocado', () => {
    const consent = createConsent(SUBJECT, GRANTOR, ['voice:capture', 'voice:analyze'], {
      at: AT - 1000,
      id: 'c-rev',
    });
    const revoked = {
      ...consent,
      status: 'revoked' as const,
      revokedAt: AT - 100,
    };
    const result = runKronos(
      { samples: sine(440, 44100, 1500), sampleRate: 44100, format: 'pcm-f32' },
      { consent: revoked, subjectId: SUBJECT_ID, at: AT },
    );
    expect(result.verdict).toBe('abstain');
    expect(result.decision.reason).toMatch(/active/);
  });

  it('se abstiene si el audio es demasiado corto', () => {
    const consent = makeValidConsent();
    const result = runKronos(
      { samples: sine(440, 44100, 100), sampleRate: 44100, format: 'pcm-f32' },
      { consent, subjectId: SUBJECT_ID, at: AT },
    );
    expect(result.verdict).toBe('abstain');
    expect(result.decision.reason).toMatch(/capture failed/);
  });

  it('se abstiene si la señal no tiene ancla 440 Hz', () => {
    const consent = makeValidConsent();
    const result = runKronos(
      { samples: sine(300, 44100, 1500), sampleRate: 44100, format: 'pcm-f32' },
      { consent, subjectId: SUBJECT_ID, at: AT, threshold: 0.65 },
    );
    expect(result.verdict).toBe('abstain');
    expect(result.decision.reason).toMatch(/threshold/);
  });

  it('respeta umbral personalizado más alto', () => {
    const consent = makeValidConsent();
    const result = runKronos(
      { samples: sine(440, 44100, 800), sampleRate: 44100, format: 'pcm-f32' },
      { consent, subjectId: SUBJECT_ID, at: AT, threshold: 0.99 },
    );
    expect(result.verdict).toBe('abstain');
  });
});
