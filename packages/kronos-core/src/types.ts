import type { ConsentRecord } from '@kronos/consent';
import type { BandResult, AnchorResult } from '@kronos/cymatic-440';

export const KRONOS_VERSION = '0.1.0';

export type AudioFormat = 'pcm-f32' | 'pcm-i16';

export interface AudioInput {
  samples: Float32Array;
  sampleRate: number;
  format: AudioFormat;
  durationMs?: number;
}

export interface CaptureResult {
  ok: boolean;
  reason?: string;
  sampleRate: number;
  sampleCount: number;
  durationMs: number;
}

export type Verdict = 'human' | 'ai' | 'abstain';

export interface ConfidenceFactors {
  anchorScore: number;
  energyScore: number;
  durationScore: number;
  consentScore: number;
}

export interface Decision {
  verdict: Verdict;
  confidence: number;
  factors: ConfidenceFactors;
  reason: string;
}

export interface Explanation {
  summary: string;
  details: string[];
  factors: ConfidenceFactors;
  thresholdUsed: number;
}

export interface KronosResult {
  version: string;
  audioHash: string;
  verdict: Verdict;
  confidence: number;
  decision: Decision;
  explanation: Explanation;
  anchor: AnchorResult;
  bands: BandResult[];
  consent: ConsentRecord | null;
  auditEntryCount: number;
  computedAt: number;
}

export interface KronosOptions {
  /** Consentimiento registrado para el sujeto analizado. Si es null → abstain. */
  consent: ConsentRecord | null;
  /** Sujeto a analizar (debe coincidir con consent.subject.id). */
  subjectId: string;
  /** Umbral para decidir "human" o "ai". [0..1], por defecto 0.65. */
  threshold?: number;
  /** Duración mínima en ms para análisis fiable. Por defecto 500ms. */
  minDurationMs?: number;
  /** Actor de auditoría (quién ejecuta la verificación). */
  actor?: { id: string; kind: 'human' | 'system' | 'ai'; email?: string };
  /** Momento de la ejecución (por defecto Date.now()). */
  at?: number;
}
