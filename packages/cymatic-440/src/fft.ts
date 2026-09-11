// Radix-2 Cooley-Tukey FFT — implementación pura, sin dependencias.

function bitReverse(n: number, bits: number): number {
  let reversed = 0;
  for (let i = 0; i < bits; i++) {
    reversed = (reversed << 1) | (n & 1);
    n >>= 1;
  }
  return reversed;
}

export function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

export function nextPowerOfTwo(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/**
 * FFT in-place. Modifica re e im con el resultado.
 * Requiere longitud potencia de 2.
 */
export function fft(re: Float32Array, im: Float32Array): void {
  const n = re.length;
  if (n !== im.length) throw new Error('re and im must have same length');
  if (!isPowerOfTwo(n)) throw new Error('length must be a power of 2');

  const bits = Math.log2(n);

  // Bit-reversal permutation
  for (let i = 0; i < n; i++) {
    const j = bitReverse(i, bits);
    if (j > i) {
      const tr = re[i]; re[i] = re[j]; re[j] = tr;
      const ti = im[i]; im[i] = im[j]; im[j] = ti;
    }
  }

  // Butterfly stages
  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const angle = (-2 * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let k = 0; k < half; k++) {
        const c = Math.cos(angle * k);
        const s = Math.sin(angle * k);
        const tRe = c * re[i + k + half] - s * im[i + k + half];
        const tIm = s * re[i + k + half] + c * im[i + k + half];
        re[i + k + half] = re[i + k] - tRe;
        im[i + k + half] = im[i + k] - tIm;
        re[i + k] += tRe;
        im[i + k] += tIm;
      }
    }
  }
}

export function magnitudeSpectrum(samples: Float32Array): Float32Array {
  const size = nextPowerOfTwo(samples.length);
  const re = new Float32Array(size);
  const im = new Float32Array(size);
  re.set(samples.subarray(0, Math.min(samples.length, size)));

  // Hann window
  for (let i = 0; i < size; i++) {
    const w = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
    re[i] *= w;
  }

  fft(re, im);

  const half = size >> 1;
  const mag = new Float32Array(half);
  for (let i = 0; i < half; i++) {
    mag[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
  }
  return mag;
}
