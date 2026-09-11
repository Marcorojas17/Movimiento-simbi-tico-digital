export interface ProvenanceRecord {
  acta: string;
  sha256: string;
  author: string;
  registeredAt: Date;
}

export interface VerificationResult {
  valid: boolean;
  reason: string;
  confidence: number;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
