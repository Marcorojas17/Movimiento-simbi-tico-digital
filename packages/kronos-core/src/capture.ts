import type { AudioInput, CaptureResult } from './types.js';

const MIN_SAMPLES = 64;
const DEFAULT_MIN_DURATION_MS = 500;

export function captureAudio(
  input: AudioInput,
  minDurationMs: number = DEFAULT_MIN_DURATION_MS,
): CaptureResult {
  const { samples, sampleRate } = input;

  if (!(samples instanceof Float32Array)) {
    return { ok: false, reason: 'samples must be Float32Array', sampleRate, sampleCount: 0, durationMs: 0 };
  }
  if (sampleRate <= 0) {
    return { ok: false, reason: 'sampleRate must be positive', sampleRate, sampleCount: samples.length, durationMs: 0 };
  }
  if (samples.length < MIN_SAMPLES) {
    return {
      ok: false,
      reason: `need at least ${MIN_SAMPLES} samples, got ${samples.length}`,
      sampleRate,
      sampleCount: samples.length,
      durationMs: 0,
    };
  }

  const durationMs = (samples.length / sampleRate) * 1000;
  if (durationMs < minDurationMs) {
    return {
      ok: false,
      reason: `duration ${durationMs.toFixed(0)}ms < min ${minDurationMs}ms`,
      sampleRate,
      sampleCount: samples.length,
      durationMs,
    };
  }

  return { ok: true, sampleRate, sampleCount: samples.length, durationMs };
}
