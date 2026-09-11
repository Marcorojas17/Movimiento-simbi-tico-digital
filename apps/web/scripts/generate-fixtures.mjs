// Genera fixtures reales corriendo el pipeline de KRONOS en build-time.
// El resultado se escribe en src/data/fixtures.json y la landing
// lo lee como si fuera contenido estático.

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createConsent } from '@kronos/consent';
import { detect440, analyzeBands, generatePattern, toSvg } from '@kronos/cymatic-440';
import { runKronos } from '@kronos/kronos-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'src', 'data');
const OUT_FILE = join(OUT_DIR, 'fixtures.json');

const SR = 44100;
const AT = 1_700_000_000_000;

function sine(freq, sr, ms) {
  const n = Math.floor((sr * ms) / 1000);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = Math.sin((2 * Math.PI * freq * i) / sr);
  return out;
}

function noise(amplitude, sr, ms) {
  const n = Math.floor((sr * ms) / 1000);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = (Math.random() * 2 - 1) * amplitude;
  return out;
}

function mix(a, b) {
  const n = Math.min(a.length, b.length);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = a[i] + b[i];
  return out;
}

function buildConsent(scopes) {
  return createConsent(
    { id: 'demo-subject', name: 'Marco Rojas', language: 'es-MX' },
    { id: 'demo-subject', email: 'marco.a.rojas.v@hotmail.com' },
    scopes,
    { at: AT - 1000, id: 'demo-consent' },
  );
}

// --- Escenario 1: señal con ancla 440 Hz + consentimiento válido ---
const signal440 = mix(sine(440, SR, 1500), noise(0.05, SR, 1500));
const consentOk = buildConsent(['voice:capture', 'voice:analyze']);
const resultHuman = runKronos(
  { samples: signal440, sampleRate: SR, format: 'pcm-f32' },
  { consent: consentOk, subjectId: 'demo-subject', at: AT },
);

// --- Escenario 2: señal sin ancla (300 Hz) → debe abstenerse ---
const signal300 = sine(300, SR, 1500);
const resultAbstainNoAnchor = runKronos(
  { samples: signal300, sampleRate: SR, format: 'pcm-f32' },
  { consent: consentOk, subjectId: 'demo-subject', at: AT },
);

// --- Escenario 3: sin consentimiento → debe abstenerse ---
const resultAbstainNoConsent = runKronos(
  { samples: signal440, sampleRate: SR, format: 'pcm-f32' },
  { consent: null, subjectId: 'demo-subject', at: AT },
);

// --- Patrón cimático SVG del 440 Hz (12x12) ---
const pattern440 = generatePattern(440, { resolution: 12 });
const patternSvg = toSvg(pattern440, { size: 240, bg: '#0a0a0a', fg: '#00c853' });

// --- Espectro de bandas para visualizar ---
const bands = analyzeBands(signal440, SR);
const anchor = detect440(signal440, SR);

const fixtures = {
  generatedAt: new Date(AT).toISOString(),
  scenarios: {
    human: sanitize(resultHuman),
    abstainNoAnchor: sanitize(resultAbstainNoAnchor),
    abstainNoConsent: sanitize(resultAbstainNoConsent),
  },
  cymatic: {
    patternSvg,
    anchor: {
      detected: anchor.detected,
      frequency: Number(anchor.frequency.toFixed(2)),
      deviationHz: Number(anchor.deviationHz.toFixed(3)),
      confidence: Number(anchor.confidence.toFixed(4)),
    },
    bands: bands.map((b) => ({
      name: b.name,
      minHz: b.minHz,
      maxHz: b.maxHz,
      ratio: Number(b.ratio.toFixed(4)),
    })),
  },
};

function sanitize(r) {
  return {
    verdict: r.verdict,
    confidence: Number(r.confidence.toFixed(4)),
    audioHash: r.audioHash,
    auditEntryCount: r.auditEntryCount,
    explanation: r.explanation.summary,
    details: r.explanation.details,
    factors: {
      anchorScore: Number(r.decision.factors.anchorScore.toFixed(4)),
      energyScore: Number(r.decision.factors.energyScore.toFixed(4)),
      durationScore: Number(r.decision.factors.durationScore.toFixed(4)),
      consentScore: Number(r.decision.factors.consentScore.toFixed(4)),
    },
    reason: r.decision.reason,
    threshold: r.explanation.thresholdUsed,
    anchorDetected: r.anchor.detected,
  };
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(fixtures, null, 2), 'utf8');

console.log('✅ fixtures.json generado');
console.log('   Verdict human:', fixtures.scenarios.human.verdict, '| confidence:', fixtures.scenarios.human.confidence);
console.log('   Verdict sin ancla:', fixtures.scenarios.abstainNoAnchor.verdict);
console.log('   Verdict sin consentimiento:', fixtures.scenarios.abstainNoConsent.verdict);
