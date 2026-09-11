import { isActive, hasAllScopes } from '@kronos/consent';
import type { ConsentRecord } from '@kronos/consent';
import type { ConsentScope } from '@kronos/consent';

export interface ConsentCheck {
  ok: boolean;
  reason?: string;
  record: ConsentRecord | null;
  score: number;
}

const REQUIRED_SCOPES: ConsentScope[] = ['voice:capture', 'voice:analyze'];

export function checkConsent(
  consent: ConsentRecord | null,
  subjectId: string,
  at: number,
): ConsentCheck {
  if (!consent) {
    return { ok: false, reason: 'no consent record provided', record: null, score: 0 };
  }

  if (consent.subject.id !== subjectId) {
    return {
      ok: false,
      reason: `consent subject (${consent.subject.id}) does not match target (${subjectId})`,
      record: consent,
      score: 0,
    };
  }

  if (!isActive(consent, at)) {
    return {
      ok: false,
      reason: `consent is not active (status: ${consent.status})`,
      record: consent,
      score: 0,
    };
  }

  if (!hasAllScopes(consent.scopes, REQUIRED_SCOPES)) {
    return {
      ok: false,
      reason: `missing required scopes: ${REQUIRED_SCOPES.join(', ')}`,
      record: consent,
      score: 0,
    };
  }

  // Score = 1.0 si scopes exactos, baja proporcionalmente si sobran restricciones
  // En esta versión simplificada: consentimiento válido → score 1.0
  return { ok: true, record: consent, score: 1.0 };
}
