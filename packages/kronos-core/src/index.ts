export type {
  AudioInput,
  AudioFormat,
  CaptureResult,
  Verdict,
  ConfidenceFactors,
  Decision,
  Explanation,
  KronosResult,
  KronosOptions,
} from './types.js';

export { KRONOS_VERSION } from './types.js';
export { captureAudio } from './capture.js';
export { hashAudio } from './hash.js';
export { checkConsent, type ConsentCheck } from './consent.js';
export { analyzeCymatic, type CymaticAnalysis } from './cymatic.js';
export { computeConfidence, computeFactors, clamp01 } from './confidence.js';
export { shouldAbstain, type AbstainInput } from './abstain.js';
export { decide } from './decide.js';
export { explainDecision } from './explain.js';
export { KRONOS_LIMITS, describeLimits, type KronosLimits } from './limits.js';
export { runKronos } from './pipeline.js';
