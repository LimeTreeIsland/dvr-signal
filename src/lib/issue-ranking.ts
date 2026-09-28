export interface IssueScores {
  severity: number;
  participant_impact: number;
  breadth: number;
  persistence: number;
  evidence_strength: number;
  downstream_effects: number;
}

export type IssueStatus = "healthy" | "review" | "warning" | "serious" | "unknown";
export type EvidenceConfidence = "high" | "moderate" | "limited" | "insufficient" | "pending_review";
export type RankingMode = "pressure" | "momentum" | "participant_impact" | "evidence_confidence";

export const SCORE_MAXIMA: IssueScores = {
  severity: 30,
  participant_impact: 25,
  breadth: 15,
  persistence: 10,
  evidence_strength: 10,
  downstream_effects: 10,
};

export function calculatePressureScore(scores: IssueScores | null): number | null {
  if (scores === null) return null;

  const keys = Object.keys(SCORE_MAXIMA) as Array<keyof IssueScores>;
  for (const key of keys) {
    const value = scores[key];
    if (!Number.isFinite(value) || value < 0 || value > SCORE_MAXIMA[key]) {
      throw new RangeError(`Invalid issue-ranking score component: ${key}`);
    }
  }

  return keys.reduce((total, key) => total + scores[key], 0);
}

export function formatMomentum(momentum: number | null): string {
  if (momentum === null) return "Trend not established";
  if (momentum === 2) return "Clearly improving";
  if (momentum === 1) return "Improving";
  if (momentum === 0) return "No established directional change";
  if (momentum === -1) return "Deteriorating";
  return "Substantially deteriorating";
}

export function statusLabel(status: IssueStatus): string {
  const labels: Record<IssueStatus, string> = {
    healthy: "Improving or relatively healthy",
    review: "Needs review",
    warning: "Documented warning",
    serious: "Serious current condition",
    unknown: "Unknown or under review",
  };
  return labels[status];
}

export function evidenceConfidenceOrder(value: EvidenceConfidence): number {
  const order: Record<EvidenceConfidence, number> = {
    high: 4,
    moderate: 3,
    limited: 2,
    insufficient: 1,
    pending_review: 0,
  };
  return order[value];
}
