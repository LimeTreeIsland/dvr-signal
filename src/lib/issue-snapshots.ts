export interface SnapshotIndicator {
  issue_id: string;
  comparison_key: string | null;
  value: number | null;
  display: string;
  data_state: string;
  source_ids: string[];
}

export interface IssueSnapshot {
  snapshot_id: string;
  label: string;
  period_start: string;
  period_end: string;
  created_at: string;
  snapshot_type: string;
  methodology_version: string;
  source_registry_version: string;
  source_ids: string[];
  indicators: SnapshotIndicator[];
  unresolved_outcomes: Array<{
    issue_id: string;
    label: string;
  }>;
}

export interface SnapshotChange {
  type: "new_source" | "new_evidence" | "increase" | "decrease" | "unchanged" | "source_conflict" | "outcome_unavailable";
  issue_id: string | null;
  label: string;
}

function hasComparableNumbers(
  prior: SnapshotIndicator,
  current: SnapshotIndicator,
): prior is SnapshotIndicator & { value: number } {
  return (
    current.comparison_key !== null &&
    prior.comparison_key === current.comparison_key &&
    current.value !== null &&
    prior.value !== null
  );
}

export function compareSnapshots(previous: IssueSnapshot, current: IssueSnapshot): SnapshotChange[] {
  const changes: SnapshotChange[] = [];
  const previousSources = new Set(previous.source_ids);

  for (const sourceId of current.source_ids) {
    if (!previousSources.has(sourceId)) {
      changes.push({
        type: "new_source",
        issue_id: null,
        label: "New source in current snapshot: " + sourceId,
      });
    }
  }

  const previousByIssue = new Map(previous.indicators.map((item) => [item.issue_id, item]));

  for (const item of current.indicators) {
    const prior = previousByIssue.get(item.issue_id);

    if (item.data_state === "source_conflict") {
      changes.push({
        type: "source_conflict",
        issue_id: item.issue_id,
        label: item.display,
      });
      continue;
    }

    if (!prior) {
      changes.push({
        type: "new_evidence",
        issue_id: item.issue_id,
        label: "New evidence available: " + item.display,
      });
      continue;
    }

    if (!hasComparableNumbers(prior, item) || item.value === null) continue;

    if (item.value > prior.value) {
      changes.push({
        type: "increase",
        issue_id: item.issue_id,
        label: prior.display + " → " + item.display,
      });
    } else if (item.value < prior.value) {
      changes.push({
        type: "decrease",
        issue_id: item.issue_id,
        label: prior.display + " → " + item.display,
      });
    } else {
      changes.push({
        type: "unchanged",
        issue_id: item.issue_id,
        label: item.display + " — unchanged across the two snapshots",
      });
    }
  }

  for (const unresolved of current.unresolved_outcomes) {
    changes.push({
      type: "outcome_unavailable",
      issue_id: unresolved.issue_id,
      label: unresolved.label,
    });
  }

  return changes;
}
