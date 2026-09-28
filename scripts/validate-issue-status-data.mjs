import { readFile } from "node:fs/promises";

const ranking = JSON.parse(await readFile("data/metrics/issue-ranking.json", "utf8"));
const registry = JSON.parse(await readFile("data/metrics/issue-source-registry.json", "utf8"));
const watch = JSON.parse(await readFile("sources/issue-ranking-watch.json", "utf8"));

const snapshotIds = ["2025-H2", "2026-H1", "2026-H2"];
const snapshots = [];
for (const id of snapshotIds) {
  snapshots.push(JSON.parse(await readFile("data/metrics/issue-snapshots/" + id + ".json", "utf8")));
}

const failures = [];
const sourceIds = new Set(registry.sources.map((source) => source.id));
const issueIds = new Set(ranking.issues.map((issue) => issue.issue_id));

if (ranking.issues.length !== 7) failures.push("Expected exactly seven tracked issue domains in V1.");

for (const issue of ranking.issues) {
  if (!issue.current_indicator?.display_value) {
    failures.push(issue.issue_id + ": missing current display value");
  }

  const references = new Set([
    ...(issue.current_indicator?.source_ids ?? []),
    ...(issue.supporting_indicators ?? []).flatMap((item) => item.source_ids ?? []),
    ...(issue.trend_series?.points ?? []).flatMap((point) => point.source_ids ?? []),
  ]);

  if (references.size === 0) failures.push(issue.issue_id + ": no source references");

  for (const sourceId of references) {
    if (!sourceIds.has(sourceId)) failures.push(issue.issue_id + ": missing source " + sourceId);
  }

  if (!Array.isArray(issue.unknowns) || issue.unknowns.length === 0) {
    failures.push(issue.issue_id + ": missing explicit unknowns");
  }

  if (issue.current_indicator.value === 0 && /unknown|unavailable|not available/i.test(issue.current_indicator.display_value)) {
    failures.push(issue.issue_id + ": unknown state must not be encoded as numeric zero");
  }

  if (issue.trend_series.comparable && issue.trend_series.points.length < 2) {
    failures.push(issue.issue_id + ": comparable trend requires at least two points");
  }
}

if (ranking.participant_mode.status !== "not_published") {
  failures.push("Participant mode must remain not_published until an approved aggregate release exists.");
}

if (ranking.participant_mode.public_cell_floor_n !== 10) {
  failures.push("Participant public-cell floor must remain n=10 unless methodology approval changes it.");
}

for (const source of watch.sources) {
  if (!sourceIds.has(source.source_id)) failures.push("Watch source not in registry: " + source.source_id);
  if (!/^https:\/\//.test(source.url)) failures.push("Watch source must use HTTPS: " + source.source_id);
  if (!source.issue_ids.every((id) => issueIds.has(id))) failures.push("Watch source has unknown issue ID: " + source.source_id);

  const host = new URL(source.url).hostname;
  const allowed = [
    "www.dshs.wa.gov",
    "live-dshs-dshs2.pantheonsite.io",
    "www.ecfr.gov",
    "rsa.ed.gov",
  ];
  if (!allowed.includes(host)) failures.push("Watch source host is not allowlisted: " + host);
}

for (const snapshot of snapshots) {
  if (!snapshot.methodology_version || !snapshot.source_registry_version) {
    failures.push(snapshot.snapshot_id + ": missing snapshot provenance version");
  }
  for (const sourceId of snapshot.source_ids) {
    if (!sourceIds.has(sourceId)) failures.push(snapshot.snapshot_id + ": missing registry source " + sourceId);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  "Issue status validation passed for " +
  ranking.issues.length +
  " issues, " +
  registry.sources.length +
  " sources, and " +
  snapshots.length +
  " snapshots."
);
