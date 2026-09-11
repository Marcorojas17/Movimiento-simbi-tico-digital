// Registro de scopes de consentimiento vocal.
// Cada scope representa un permiso explícito y auditable.

export const CONSENT_SCOPES = [
  // Captura
  'voice:capture',

  // Uso
  'voice:analyze',
  'voice:store',
  'voice:derive',

  // Distribución
  'voice:share',

  // Comercial
  'voice:commercial',
  'voice:ai-training',
  'voice:synthetic',

  // Post-mortem
  'voice:post-mortem',

  // Datos personales
  'data:export',
  'data:delete',
] as const;

export type ConsentScope = (typeof CONSENT_SCOPES)[number];

export type ScopeCategory =
  | 'capture'
  | 'use'
  | 'distribution'
  | 'commercial'
  | 'post-mortem'
  | 'data';

export interface ScopeDefinition {
  id: ConsentScope;
  label: string;
  description: string;
  category: ScopeCategory;
  requires: ConsentScope[];
  conflicts: ConsentScope[];
}

export const SCOPE_REGISTRY: Record<ConsentScope, ScopeDefinition> = {
  'voice:capture': {
    id: 'voice:capture',
    label: 'Captura de voz',
    description: 'Permite capturar muestras de voz para cualquier fin autorizado.',
    category: 'capture',
    requires: [],
    conflicts: [],
  },
  'voice:analyze': {
    id: 'voice:analyze',
    label: 'Análisis de voz',
    description: 'Permite ejecutar análisis cimático y verificación de autenticidad.',
    category: 'use',
    requires: ['voice:capture'],
    conflicts: [],
  },
  'voice:store': {
    id: 'voice:store',
    label: 'Almacenamiento',
    description: 'Permite conservar la muestra de voz en un repositorio.',
    category: 'use',
    requires: ['voice:capture'],
    conflicts: [],
  },
  'voice:derive': {
    id: 'voice:derive',
    label: 'Obras derivadas',
    description: 'Permite crear obras derivadas a partir de la muestra original.',
    category: 'use',
    requires: ['voice:capture', 'voice:store'],
    conflicts: [],
  },
  'voice:share': {
    id: 'voice:share',
    label: 'Compartir con terceros',
    description: 'Permite transferir la muestra o sus derivados a terceros.',
    category: 'distribution',
    requires: ['voice:capture'],
    conflicts: [],
  },
  'voice:commercial': {
    id: 'voice:commercial',
    label: 'Uso comercial',
    description: 'Permite explotación comercial de la voz o sus derivados.',
    category: 'commercial',
    requires: ['voice:capture', 'voice:store'],
    conflicts: [],
  },
  'voice:ai-training': {
    id: 'voice:ai-training',
    label: 'Entrenamiento de IA',
    description: 'Permite usar la muestra para entrenar modelos de IA.',
    category: 'commercial',
    requires: ['voice:capture', 'voice:store'],
    conflicts: [],
  },
  'voice:synthetic': {
    id: 'voice:synthetic',
    label: 'Síntesis vocal',
    description: 'Permite generar voz sintética basada en la muestra.',
    category: 'commercial',
    requires: ['voice:capture', 'voice:ai-training'],
    conflicts: [],
  },
  'voice:post-mortem': {
    id: 'voice:post-mortem',
    label: 'Uso post-mortem',
    description: 'Permite uso de la voz después del fallecimiento del titular.',
    category: 'post-mortem',
    requires: ['voice:store'],
    conflicts: [],
  },
  'data:export': {
    id: 'data:export',
    label: 'Exportar datos',
    description: 'Derecho de acceso: permite exportar los datos asociados.',
    category: 'data',
    requires: [],
    conflicts: [],
  },
  'data:delete': {
    id: 'data:delete',
    label: 'Borrado de datos',
    description: 'Derecho al olvido: solicita el borrado de todos los datos.',
    category: 'data',
    requires: [],
    conflicts: [
      'voice:store',
      'voice:derive',
      'voice:commercial',
      'voice:ai-training',
      'voice:synthetic',
      'voice:post-mortem',
    ],
  },
};

export function isKnownScope(value: string): value is ConsentScope {
  return (CONSENT_SCOPES as readonly string[]).includes(value);
}

export function hasScope(scopes: ConsentScope[], scope: ConsentScope): boolean {
  return scopes.includes(scope);
}

export function hasAllScopes(scopes: ConsentScope[], required: ConsentScope[]): boolean {
  return required.every((s) => scopes.includes(s));
}

export function hasAnyScope(scopes: ConsentScope[], anyOf: ConsentScope[]): boolean {
  return anyOf.some((s) => scopes.includes(s));
}

export interface ScopeValidation {
  valid: boolean;
  unknown: string[];
  missingRequirements: ConsentScope[];
  conflicts: ConsentScope[];
}

export function validateScopes(input: readonly string[]): ScopeValidation {
  const unknown: string[] = [];
  const known: ConsentScope[] = [];

  for (const s of input) {
    if (isKnownScope(s)) known.push(s);
    else unknown.push(s);
  }

  // Requisitos faltantes
  const missing = new Set<ConsentScope>();
  for (const s of known) {
    const def = SCOPE_REGISTRY[s];
    for (const req of def.requires) {
      if (!known.includes(req)) missing.add(req);
    }
  }

  // Conflictos mutuos
  const conflicts = new Set<ConsentScope>();
  for (const s of known) {
    const def = SCOPE_REGISTRY[s];
    for (const c of def.conflicts) {
      if (known.includes(c)) conflicts.add(c);
    }
  }

  return {
    valid: unknown.length === 0 && missing.size === 0 && conflicts.size === 0,
    unknown,
    missingRequirements: [...missing],
    conflicts: [...conflicts],
  };
}
