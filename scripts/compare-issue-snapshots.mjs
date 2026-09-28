import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const previousPath = valueAfter("--previous", "data/metrics/issue-snapshots/2026-H1.json");
const currentPath = valueAfter("--current", "data/metrics/issue-snapshots/2026-H2.json");
const outputPath = valueAfter("--output", "artifacts/issue-snapshot-diff.json");

const previous = JSON.parse(await readFile(previousPath, "utf8"));
const current = JSON.parse(await readFile(currentPath, "utf8"));

const changes = [];
const priorSources = new Set(previous.source_ids);

for (const sourceId of current.source_ids) {
  if (!priorSources.has(sourceId)) {
    changes.push({ type: "new_source", issue_id: null, source_id: sourceId });
  }
}

const priorByIssue = new Map(previous.indicators.map((item) => [item.issue_id, item]));

for (const item of current.indicators) {
  const prior = priorByIssue.get(item.issue_id);

  if (item.data_state === "source_conflict") {
    changes.push({ type: "source_conflict", issue_id: item.issue_id, label: item.display });
    continue;
  }

  if (!prior) {
    changes.push({ type: "new_evidence", issue_id: item.issue_id, label: item.display });
    continue;
  }

  const comparable =
    item.comparison_key !== null &&
    prior.comparison_key === item.comparison_key &&
    typeof item.value === "number" &&
    typeof prior.value === "number";

  if (!comparable) continue;

  const type = item.value > prior.value ? "increase" : item.value < prior.value ? "decrease" : "unchanged";
  changes.push({
    type,
    issue_id: item.issue_id,
    previous: prior.display,
    current: item.display,
  });
}

for (const unresolved of current.unresolved_outcomes) {
  changes.push({ type: "outcome_unavailable", ...unresolved });
}

const report = {
  generated_at: new Date().toISOString(),
  previous_snapshot: previous.snapshot_id,
  current_snapshot: current.snapshot_id,
  candidate_only: true,
  changes,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8");
console.log("Wrote " + changes.length + " neutral snapshot changes to " + outputPath);
