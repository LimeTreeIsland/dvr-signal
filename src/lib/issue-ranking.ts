export interface TrendPoint {
  period: string;
  value: number;
  display: string;
  source_ids: string[];
}

export interface TrendSeries {
  label: string;
  unit: string | null;
  comparable: boolean;
  points: TrendPoint[];
  note: string;
}

export interface CurrentIndicator {
  label: string;
  display_value: string;
  value: number | null;
  max: number | null;
  unit: string | null;
  measurement_period: string;
  observation_date: string | null;
  source_ids: string[];
}

export interface IssueRecord {
  issue_id: string;
  title: string;
  definition: string;
  evidence_state: string;
  current_indicator: CurrentIndicator;
  supporting_indicators: Array<{
    label: string;
    display_value: string;
    source_ids: string[];
  }>;
  trend_series: TrendSeries;
  source_conflicts: string[];
  unknowns: string[];
  planned_improvements: string[];
}

export function evidenceStateLabel(value: string): string {
  const labels: Record<string, string> = {
    current_official: "Current official source",
    current_official_research: "Official research measure",
    source_conflict: "Official-source conflict",
    historical_official: "Historical official source",
    needs_review: "Needs review",
  };
  return labels[value] ?? "Evidence state not classified";
}

export function evidenceTone(value: string): "verified" | "review" | "neutral" {
  if (value === "current_official" || value === "current_official_research") return "verified";
  if (value === "source_conflict") return "review";
  return "neutral";
}

export function formatTrendLabel(series: TrendSeries): string {
  if (!series.comparable || series.points.length < 2) return "Comparable trend unavailable";

  const first = series.points[0]?.value;
  const last = series.points[series.points.length - 1]?.value;

  if (first === undefined || last === undefined) return "Comparable trend unavailable";
  if (last > first) return "Latest comparable value is higher";
  if (last < first) return "Latest comparable value is lower";
  return "No change across comparable values";
}

export function formatTrendValues(series: TrendSeries): string {
  if (!series.comparable || series.points.length < 2) return "";
  return series.points.map((point) => point.display).join(" → ");
}
