import type { Decision, Explanation } from './types.js';

export function explainDecision(decision: Decision, threshold: number): Explanation {
  const { factors } = decision;
  const details: string[] = [
    `anchorScore: ${factors.anchorScore.toFixed(3)} (peso 45%)`,
    `energyScore: ${factors.energyScore.toFixed(3)} (peso 20%)`,
    `durationScore: ${factors.durationScore.toFixed(3)} (peso 15%)`,
    `consentScore: ${factors.consentScore.toFixed(3)} (peso 20%)`,
  ];

  let summary: string;
  if (decision.verdict === 'abstain') {
    summary = `KRONOS se abstiene: ${decision.reason}`;
  } else if (decision.verdict === 'human') {
    summary = `KRONOS confirma firma vocal humana con confianza ${decision.confidence.toFixed(3)}`;
  } else {
    summary = `KRONOS clasifica como ${decision.verdict} con confianza ${decision.confidence.toFixed(3)}`;
  }

  return { summary, details, factors, thresholdUsed: threshold };
}
