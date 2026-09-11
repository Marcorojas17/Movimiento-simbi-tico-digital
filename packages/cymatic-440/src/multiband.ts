import { magnitudeSpectrum } from './fft.js';
import { DEFAULT_SAMPLE_RATE } from './anchor440.js';

export interface BandSpec {
  name: string;
  minHz: number;
  maxHz: number;
}

export interface BandResult extends BandSpec {
  /** energía RMS dentro de la banda */
  energy: number;
  /** energía relativa al total [0..1] */
  ratio: number;
}

export const DEFAULT_BANDS: BandSpec[] = [
  { name: 'sub',    minHz: 20,   maxHz: 80 },
  { name: 'low',    minHz: 80,   maxHz: 250 },
  { name: 'mid',    minHz: 250,  maxHz: 2000 },
  { name: 'anchor', minHz: 435,  maxHz: 445 },
  { name: 'high',   minHz: 2000, maxHz: 8000 },
];

export function analyzeBands(
  samples: Float32Array,
  sampleRate: number = DEFAULT_SAMPLE_RATE,
  bands: BandSpec[] = DEFAULT_BANDS,
): BandResult[] {
  const mag = magnitudeSpectrum(samples);
  const size = mag.length * 2;
  const binHz = sampleRate / size;

  // Energía total
  let totalEnergy = 0;
  for (let i = 1; i < mag.length; i++) totalEnergy += mag[i] * mag[i];
  totalEnergy = Math.sqrt(totalEnergy);

  return bands.map((band) => {
    const startBin = Math.max(1, Math.floor(band.minHz / binHz));
    const endBin = Math.min(mag.length - 1, Math.ceil(band.maxHz / binHz));

    let bandEnergy = 0;
    for (let i = startBin; i <= endBin; i++) bandEnergy += mag[i] * mag[i];
    bandEnergy = Math.sqrt(bandEnergy);

    return {
      ...band,
      energy: bandEnergy,
      ratio: totalEnergy > 0 ? bandEnergy / totalEnergy : 0,
    };
  });
}
