import type { ConsentScope } from './scopes.js';

export type ConsentStatus = 'active' | 'revoked' | 'expired';

export type ConsentLanguage = 'es-MX' | 'en-US' | 'nah' | 'yua' | 'cpa';

export interface ConsentSubject {
  /** Identificador interno del titular de la voz. */
  id: string;
  /** Nombre completo (opcional). */
  name?: string;
  /** Lengua materna en que se otorgó el consentimiento. */
  language: ConsentLanguage;
}

export interface ConsentGrantor {
  /** Quien otorga el consentimiento (habitualmente el mismo subject). */
  id: string;
  /** Correo de contacto. */
  email: string;
}

export interface ConsentRecord {
  /** Versión del formato de registro. */
  version: 1;
  /** UUID v4 único de este registro. */
  id: string;
  /** Titular de la voz. */
  subject: ConsentSubject;
  /** Quien otorga. */
  grantor: ConsentGrantor;
  /** Scopes otorgados. */
  scopes: ConsentScope[];
  /** Epoch ms de creación. */
  createdAt: number;
  /** Epoch ms de última modificación. */
  updatedAt: number;
  /** Epoch ms de expiración, o null si no expira. */
  expiresAt: number | null;
  /** Estado actual. */
  status: ConsentStatus;
  /** Epoch ms de revocación (null si activo). */
  revokedAt: number | null;
  /** Motivo de la revocación (null si activo). */
  revokedReason: string | null;
  /** Hash del registro anterior en la cadena (null si es el primero). */
  previousHash: string | null;
  /** SHA-256 del contenido canónico (sin incluir este campo). */
  hash: string;
  /** Metadata libre (país, IP, user-agent, etc.). */
  metadata: Record<string, unknown>;
}

export interface GrantOptions {
  /** UUID personalizado (por defecto se genera uno). */
  id?: string;
  /** Lengua del consentimiento (por defecto es-MX). */
  language?: ConsentLanguage;
  /** Milisegundos hasta expirar. Si se omite, no expira. */
  expiresIn?: number;
  /** Metadata adicional. */
  metadata?: Record<string, unknown>;
  /** Momento de creación (por defecto Date.now()). Útil para tests. */
  at?: number;
}

export interface RevokeOptions {
  /** Motivo de la revocación. */
  reason: string;
  /** UUID personalizado. */
  id?: string;
  /** Momento de la revocación (por defecto Date.now()). */
  at?: number;
}

export interface ChainVerification {
  valid: boolean;
  reason?: string;
  brokenAt?: number;
}
