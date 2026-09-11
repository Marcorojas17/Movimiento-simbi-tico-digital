/**
 * Límites explícitos del sistema KRONOS v0.1.0.
 *
 * Esta lista es parte del contrato con el usuario: si algo no está aquí,
 * no podemos afirmarlo. Si algo está aquí, es porque nuestro diseño
 * NO lo cubre todavía.
 */
export const KRONOS_LIMITS = {
  can: [
    'Detectar la presencia del ancla 440 Hz con FFT radis-2.',
    'Analizar distribución energética por bandas (sub, low, mid, anchor, high).',
    'Verificar consentimiento explícito por scope.',
    'Registrar cada decisión en una cadena de auditoría inmutable.',
    'Abstenerse cuando la confianza es insuficiente.',
  ],
  cannot: [
    'Distinguir con certeza una voz humana de una clonada por IA en todos los casos.',
    'Identificar al hablante (no somos biometría de identificación).',
    'Analizar grabaciones menores a 500 ms.',
    'Funcionar sin consentimiento explícito del titular.',
    'Garantizar resultados en idiomas o dialectos no representados en el corpus.',
    'Reemplazar un peritaje forense humano.',
  ],
  will_not: [
    'Emitir un veredicto "ai" sin consentimiento explícito y confianza muy alta.',
    'Almacenar audio crudo sin orden explícita del titular.',
    'Compartir datos con terceros sin scope voice:share.',
    'Operar sobre voces de menores sin tutor legal.',
  ],
} as const;

export type KronosLimits = typeof KRONOS_LIMITS;

export function describeLimits(): string {
  const lines: string[] = [
    '## KRONOS puede:',
    ...KRONOS_LIMITS.can.map((l) => `- ${l}`),
    '',
    '## KRONOS NO puede:',
    ...KRONOS_LIMITS.cannot.map((l) => `- ${l}`),
    '',
    '## KRONOS NO hará:',
    ...KRONOS_LIMITS.will_not.map((l) => `- ${l}`),
  ];
  return lines.join('\n');
}
