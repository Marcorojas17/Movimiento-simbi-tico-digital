export {
  CONSENT_SCOPES,
  SCOPE_REGISTRY,
  isKnownScope,
  hasScope,
  hasAllScopes,
  hasAnyScope,
  validateScopes,
  type ConsentScope,
  type ScopeCategory,
  type ScopeDefinition,
  type ScopeValidation,
} from './scopes.js';

export type {
  ConsentStatus,
  ConsentLanguage,
  ConsentSubject,
  ConsentGrantor,
  ConsentRecord,
  GrantOptions,
  RevokeOptions,
  ChainVerification,
} from './types.js';

export { canonicalize, sha256Hex, hashConsentContent } from './hash.js';
export { createConsent } from './grant.js';
export { revokeConsent } from './revoke.js';
export { computeStatus, isActive, isExpired, refreshStatus } from './expire.js';
export { ConsentChain } from './chain.js';
