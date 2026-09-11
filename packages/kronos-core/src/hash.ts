import { createHash } from 'node:crypto';

export function hashAudio(samples: Float32Array): string {
  const view = new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength);
  return createHash('sha256').update(view).digest('hex');
}
