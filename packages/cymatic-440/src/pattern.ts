import { CYMATIC_ANCHOR_HZ } from './anchor440.js';

export interface CymaticPattern {
  /** resolución N×N */
  resolution: number;
  /** N*N celdas normalizadas [0..1], orden fila-mayor */
  cells: Float32Array;
  /** frecuencia semilla (Hz) */
  seedHz: number;
  /** número de onda normalizado respecto a 440 Hz */
  waveNumber: number;
}

export interface PatternOptions {
  resolution?: number;
  /** modo x del patrón de Chladni (entero >= 1) */
  modeX?: number;
  /** modo y del patrón de Chladni (entero >= 1) */
  modeY?: number;
}

/**
 * Genera un patrón cimático determinista inspirado en las figuras
 * de Chladni: nodos y antinodos de una placa vibrante cuadrada.
 * Determinista: mismo seedHz + opciones → mismo output.
 */
export function generatePattern(
  seedHz: number,
  options: PatternOptions = {},
): CymaticPattern {
  if (seedHz <= 0) throw new Error('seedHz must be positive');

  const resolution = options.resolution ?? 16;
  if (resolution < 2) throw new Error('resolution must be >= 2');

  const waveNumber = seedHz / CYMATIC_ANCHOR_HZ;

  // Modos: derivados del número de onda para que 440 Hz dé un patrón estable
  const modeX = options.modeX ?? Math.max(1, Math.round(waveNumber));
  const modeY = options.modeY ?? Math.max(1, Math.round(waveNumber));

  const cells = new Float32Array(resolution * resolution);
  let maxVal = 0;

  for (let y = 0; y < resolution; y++) {
    const ny = y / (resolution - 1);
    for (let x = 0; x < resolution; x++) {
      const nx = x / (resolution - 1);
      const v =
        Math.sin(modeX * Math.PI * nx) *
        Math.sin(modeY * Math.PI * ny);
      const abs = Math.abs(v);
      cells[y * resolution + x] = abs;
      if (abs > maxVal) maxVal = abs;
    }
  }

  // Normalizar a [0..1]
  if (maxVal > 0) {
    for (let i = 0; i < cells.length; i++) cells[i] /= maxVal;
  }

  return { resolution, cells, seedHz, waveNumber };
}

/** Distancia euclídea entre dos patrones del mismo tamaño. */
export function patternDistance(a: CymaticPattern, b: CymaticPattern): number {
  if (a.resolution !== b.resolution) {
    throw new Error('patterns must have same resolution');
  }
  let sum = 0;
  for (let i = 0; i < a.cells.length; i++) {
    const d = a.cells[i] - b.cells[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}
