import type { ConfidenceFactors, Decision } from './types.js';
import { shouldAbstain, type AbstainInput } from './abstain.js';

/**
 * Regla de decisión.
 *
 * IMPORTANTE: por diseño, KRONOS solo distingue entre:
 *   - 'human': cuando el ancla de 440 Hz está presente y la confianza es alta
 *   - 'abstain': cuando no puede afirmarlo con certeza
 *
 * NO emitimos 'ai' por defecto en v1. La distinción humana/IA es
 * estadísticamente frágil y preferimos abstención honesta antes que
 * un falso positivo. Ver limits.ts.
 */
export function decide(input: AbstainInput): Decision {
  const abstention = shouldAbstain(input);
  if (abstention) return abstention;

  const { confidence, factors } = input;
  const { anchorScore, consentScore } = factors;

  // Decisión positiva: hay consentimiento + ancla fuerte
  return {
    verdict: 'human',
    confidence,
    factors,
    reason: `anchor=${anchorScore.toFixed(3)}, consent=${consentScore.toFixed(3)}, confidence=${confidence.toFixed(3)}`,
  };
}
