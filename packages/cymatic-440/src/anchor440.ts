import { magnitudeSpectrum } from './fft.js';

export const CYMATIC_ANCHOR_HZ = 440;
export const DEFAULT_SAMPLE_RATE = 44100;

export interface AnchorResult {
  /** true si se detectó la frecuencia ancla dentro de la tolerancia */
  detected: boolean;
  /** frecuencia detectada (Hz) más cercana al ancla */
  frequency: number;
  /** magnitud espectral del pico */
  magnitude: number;
  /** confianza [0..1]: energía en la banda ancla / energía total */
  confidence: number;
  /** índice del bin espectral */
  binIndex: number;
  /** desviación respecto al ancla (Hz) */
  deviationHz: number;
}

export interface DetectOptions {
  /** frecuencia ancla (por defecto 440 Hz) */
  anchorHz?: number;
  /** tolerancia en Hz (por defecto ±5 Hz) */
  toleranceHz?: number;
  /** umbral mínimo de confianza para detected=true (por defecto 0.15) */
  minConfidence?: number;
}

export function detectAnchor(
  samples: Float32Array,
  sampleRate: number = DEFAULT_SAMPLE_RATE,
  options: DetectOptions = {},
): AnchorResult {
  if (samples.length < 64) throw new Error('need at least 64 samples');
  if (sampleRate <= 0) throw new Error('sampleRate must be positive');

  const anchorHz = options.anchorHz ?? CYMATIC_ANCHOR_HZ;
  const toleranceHz = options.toleranceHz ?? 5;
  const minConfidence = options.minConfidence ?? 0.15;

  const mag = magnitudeSpectrum(samples);
  const size = mag.length * 2; // reconstruir FFT size
  const binHz = sampleRate / size;

  const targetBin = Math.round(anchorHz / binHz);
  const tolBins = Math.max(1, Math.ceil(toleranceHz / binHz));

  const start = Math.max(0, targetBin - tolBins);
  const end = Math.min(mag.length - 1, targetBin + tolBins);

  let bestBin = targetBin;
  let bestMag = 0;
  for (let i = start; i <= end; i++) {
    if (mag[i] > bestMag) {
      bestMag = mag[i];
      bestBin = i;
    }
  }

  // Energía total (media cuadrática de magnitudes)
  let totalEnergy = 0;
  for (let i = 1; i < mag.length; i++) totalEnergy += mag[i] * mag[i];
  totalEnergy = Math.sqrt(totalEnergy / (mag.length - 1));

  // Energía en la banda ancla
  let anchorEnergy = 0;
  for (let i = start; i <= end; i++) anchorEnergy += mag[i] * mag[i];
  anchorEnergy = Math.sqrt(anchorEnergy / (end - start + 1));

  const rawConfidence = totalEnergy > 0 ? anchorEnergy / totalEnergy : 0;
  const confidence = Math.max(0, Math.min(1, rawConfidence));
  const frequency = bestBin * binHz;
  const deviationHz = frequency - anchorHz;

  const detected =
    Math.abs(deviationHz) <= toleranceHz && confidence >= minConfidence;

  return {
    detected,
    frequency,
    magnitude: bestMag,
    confidence,
    binIndex: bestBin,
    deviationHz,
  };
}

/** Alias semántico para el pipeline de KRONOS. */
export function detect440(
  samples: Float32Array,
  sampleRate: number = DEFAULT_SAMPLE_RATE,
): AnchorResult {
  return detectAnchor(samples, sampleRate);
}
