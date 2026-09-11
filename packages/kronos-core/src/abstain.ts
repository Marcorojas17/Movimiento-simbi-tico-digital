import type { CaptureResult, ConfidenceFactors, Decision } from './types.js';
import type { ConsentCheck } from './consent.js';

export interface AbstainInput {
  capture: CaptureResult;
  consent: ConsentCheck;
  confidence: number;
  factors: ConfidenceFactors;
  threshold: number;
}

/**
 * Reglas de abstención honesta. Si CUALQUIERA aplica → abstain.
 * El orden importa: primero las causas más graves.
 */
export function shouldAbstain(input: AbstainInput): Decision | null {
  const { capture, consent, confidence, threshold } = input;

  // 1. Captura inválida
  if (!capture.ok) {
    return {
      verdict: 'abstain',
      confidence: 0,
      factors: input.factors,
      reason: `capture failed: ${capture.reason ?? 'unknown'}`,
    };
  }

  // 2. Sin consentimiento válido
  if (!consent.ok) {
    return {
      verdict: 'abstain',
      confidence: 0,
      factors: input.factors,
      reason: `consent invalid: ${consent.reason ?? 'unknown'}`,
    };
  }

  // 3. Confianza por debajo del umbral
  if (confidence < threshold) {
    return {
      verdict: 'abstain',
      confidence,
      factors: input.factors,
      reason: `confidence ${confidence.toFixed(3)} < threshold ${threshold.toFixed(3)}`,
    };
  }

  return null;
}
