import { AuditChain } from '@kronos/audit';
import type { AuditActor } from '@kronos/audit';
import type {
  AudioInput,
  KronosOptions,
  KronosResult,
  Decision,
} from './types.js';
import { KRONOS_VERSION } from './types.js';
import { captureAudio } from './capture.js';
import { hashAudio } from './hash.js';
import { checkConsent } from './consent.js';
import { analyzeCymatic } from './cymatic.js';
import { computeConfidence, computeFactors } from './confidence.js';
import { decide } from './decide.js';
import { explainDecision } from './explain.js';

const DEFAULT_THRESHOLD = 0.65;
const DEFAULT_MIN_DURATION_MS = 500;

const DEFAULT_ACTOR: AuditActor = {
  id: 'kronos-system',
  kind: 'system',
};

export function runKronos(
  audio: AudioInput,
  options: KronosOptions,
): KronosResult {
  const at = options.at ?? Date.now();
  const threshold = options.threshold ?? DEFAULT_THRESHOLD;
  const minDurationMs = options.minDurationMs ?? DEFAULT_MIN_DURATION_MS;
  const actor = options.actor ?? DEFAULT_ACTOR;

  const chain = new AuditChain();
  chain.record(actor, 'verification.started', {
    version: KRONOS_VERSION,
    subjectId: options.subjectId,
    sampleRate: audio.sampleRate,
    sampleCount: audio.samples.length,
  }, { at });

  // 1. Capture
  const capture = captureAudio(audio, minDurationMs);

  // 2. Hash (siempre, incluso si capture falla, para trazabilidad)
  const audioHash = hashAudio(audio.samples);

  // 3. Consent
  const consent = checkConsent(options.consent, options.subjectId, at);

  if (consent.ok) {
    chain.record(actor, 'consent.granted', {
      consentId: consent.record?.id,
      scopes: consent.record?.scopes,
    }, { at });
  }

  // 4. Cymatic (solo si capture ok, para evitar procesar basura)
  const cymatic = capture.ok
    ? analyzeCymatic(audio.samples, audio.sampleRate)
    : {
        anchor: {
          detected: false,
          frequency: 0,
          magnitude: 0,
          confidence: 0,
          binIndex: 0,
          deviationHz: 0,
        },
        bands: [],
        score: 0,
      };

  // 5. Confidence
  const factors = computeFactors({ capture, cymatic, consent });
  const confidence = computeConfidence({ capture, cymatic, consent });

  // 6. Decision
  const decision: Decision = decide({
    capture,
    consent,
    confidence,
    factors,
    threshold,
  });

  // 7. Audit
  if (decision.verdict === 'abstain') {
    chain.record(actor, 'verification.abstained', {
      reason: decision.reason,
      confidence,
    }, { at });
  } else {
    chain.record(actor, 'verification.completed', {
      verdict: decision.verdict,
      confidence,
      audioHash,
    }, { at });
  }

  // 8. Explicación
  const explanation = explainDecision(decision, threshold);

  return {
    version: KRONOS_VERSION,
    audioHash,
    verdict: decision.verdict,
    confidence: decision.confidence,
    decision,
    explanation,
    anchor: cymatic.anchor,
    bands: cymatic.bands,
    consent: consent.record,
    auditEntryCount: chain.length(),
    computedAt: at,
  };
}
