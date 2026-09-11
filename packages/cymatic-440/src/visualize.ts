import type { CymaticPattern } from './pattern.js';

const RAMP = ' .:-=+*#%@';

export function toAscii(pattern: CymaticPattern): string {
  const { resolution, cells } = pattern;
  const lines: string[] = [];
  const last = RAMP.length - 1;

  for (let y = 0; y < resolution; y++) {
    let line = '';
    for (let x = 0; x < resolution; x++) {
      const v = cells[y * resolution + x];
      const idx = Math.min(last, Math.max(0, Math.round(v * last)));
      line += RAMP[idx];
    }
    lines.push(line);
  }
  return lines.join('\n');
}

export interface SvgOptions {
  /** tamaño en px del SVG cuadrado (por defecto 256) */
  size?: number;
  /** color de fondo */
  bg?: string;
  /** color de celda */
  fg?: string;
}

export function toSvg(pattern: CymaticPattern, options: SvgOptions = {}): string {
  const size = options.size ?? 256;
  const bg = options.bg ?? '#0d0d0d';
  const fg = options.fg ?? '#00c853';
  const { resolution, cells, seedHz } = pattern;
  const cell = size / resolution;
  const r = cell / 2;

  const dots: string[] = [];
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const v = cells[y * resolution + x];
      if (v <= 0.02) continue;
      const cx = x * cell + r;
      const cy = y * cell + r;
      dots.push(
        `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${(r * v).toFixed(2)}" fill="${fg}" opacity="${v.toFixed(3)}"/>`,
      );
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    `<rect width="${size}" height="${size}" fill="${bg}"/>`,
    `<g>${dots.join('')}</g>`,
    `<title>Cymatic pattern ${seedHz.toFixed(2)} Hz</title>`,
    `</svg>`,
  ].join('\n');
}
