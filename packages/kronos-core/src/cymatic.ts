import { detect440, analyzeBands, DEFAULT_SAMPLE_RATE } from '@kronos/cymatic-440';
import type { AnchorResult, BandResult } from '@kronos/cymatic-440';

export interface CymaticAnalysis {
  anchor: AnchorResult;
  bands: BandResult[];
  /** score global [0..1] combinando ancla + banda 440 */
  score: number;
}

export function analyzeCymatic(
  samples: Float32Array,
  sampleRate: number = DEFAULT_SAMPLE_RATE,
): CymaticAnalysis {
  const anchor = detect440(samples, sampleRate);
  const bands = analyzeBands(samples, sampleRate);

  // El score del análisis combina:
  // - 70%: si el ancla de 440 Hz fue detectada (con peso por confidence)
  // - 30%: energía relativa en la banda "anchor" (435-445 Hz)
  const anchorBand = bands.find((b) => b.name === 'anchor');
  const anchorBandRatio = anchorBand ? anchorBand.ratio : 0;

  const anchorComponent = anchor.detected ? Math.min(1, anchor.confidence * 2) : 0;
  const bandComponent = Math.min(1, anchorBandRatio * 3);

  const score = 0.7 * anchorComponent + 0.3 * bandComponent;

  return { anchor, bands, score: Math.max(0, Math.min(1, score)) };
}
