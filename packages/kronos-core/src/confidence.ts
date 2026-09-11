import type { CaptureResult, ConfidenceFactors } from './types.js';
import type { CymaticAnalysis } from './cymatic.js';
import type { ConsentCheck } from './consent.js';

export interface ConfidenceInput {
  capture: CaptureResult;
  cymatic: CymaticAnalysis;
  consent: ConsentCheck;
}

const IDEAL_DURATION_MS = 3000;

export function computeConfidence(input: ConfidenceInput): number {
  const factors = computeFactors(input);
  // Ponderación: ancla + energía + duración + consentimiento
  const score =
    0.45 * factors.anchorScore +
    0.2 * factors.energyScore +
    0.15 * factors.durationScore +
    0.2 * factors.consentScore;
  return clamp01(score);
}

export function computeFactors(input: ConfidenceInput): ConfidenceFactors {
  const { capture, cymatic, consent } = input;

  const anchorScore = clamp01(cymatic.score);
  const energyScore = clamp01(
    cymatic.bands.reduce((acc, b) => acc + b.ratio, 0) > 0
      ? cymatic.bands.find((b) => b.name === 'anchor')?.ratio ?? 0
      : 0,
  );
  const durationScore = clamp01(
    capture.durationMs / IDEAL_DURATION_MS,
  );
  const consentScore = clamp01(consent.score);

  return { anchorScore, energyScore, durationScore, consentScore };
}

export function clamp01(x: number): number {
  if (Number.isNaN(x)) return 0;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
