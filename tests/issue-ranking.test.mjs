import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(await readFile("data/metrics/issue-ranking.json", "utf8"));
const sources = JSON.parse(await readFile("data/metrics/issue-source-registry.json", "utf8"));
const h1 = JSON.parse(await readFile("data/metrics/issue-snapshots/2026-H1.json", "utf8"));
const h2 = JSON.parse(await readFile("data/metrics/issue-snapshots/2026-H2.json", "utf8"));
const page = await readFile("src/pages/system-status/issue-ranking.astro", "utf8");
const sparkline = await readFile("src/components/IssueSparkline.astro", "utf8");
const header = await readFile("src/components/SiteHeader.astro", "utf8");
const heroArtwork = await readFile("public/images/dvr-generalist-bottleneck-specialist-pathways.webp");

test("issue page publishes factual indicators rather than a composite political ranking", () => {
  assert.equal(data.publication_status, "factual_indicators");
  assert.equal(data.composite_ranking.status, "not_published");
  assert.match(data.composite_ranking.reason, /factual indicators/i);
  assert.match(page, /not publishing a composite pressure score or evaluative ranking/i);
});

test("all seven issue domains have a measurable indicator and evidence limits", () => {
  assert.equal(data.issues.length, 7);
  for (const issue of data.issues) {
    assert.ok(issue.current_indicator.label);
    assert.ok(issue.current_indicator.display_value);
    assert.ok(Array.isArray(issue.current_indicator.source_ids));
    assert.ok(issue.current_indicator.source_ids.length > 0);
    assert.ok(Array.isArray(issue.unknowns));
    assert.ok(issue.unknowns.length > 0);
  }
});

test("source registry separates agency, federal/oversight, and participant aggregate layers", () => {
  const layers = new Set(sources.sources.map((source) => source.source_layer));
  assert.ok(layers.has("dvr_dshs"));
  assert.ok(layers.has("federal_oversight"));
  assert.ok(layers.has("participant_aggregate"));

  for (const source of sources.sources) {
    assert.ok(source.id);
    assert.ok(source.title);
    assert.ok(source.url);
    assert.ok(Array.isArray(source.pinpoints));
  }
});

test("official source conflicts remain visible rather than being silently reconciled", () => {
  const workload = data.issues.find((issue) => issue.issue_id === "counselor-workload");
  const continuity = data.issues.find((issue) => issue.issue_id === "staff-continuity");
  assert.equal(workload.evidence_state, "source_conflict");
  assert.match(workload.current_indicator.display_value, /64%.*40%/);
  assert.ok(workload.source_conflicts.length > 0);
  assert.ok(continuity.source_conflicts.length > 0);
});

test("historical snapshots are versioned and distinguish retrospective from current records", () => {
  assert.equal(h1.snapshot_type, "retrospective_reconstruction");
  assert.equal(h2.snapshot_type, "current_partial_period");
  assert.equal(h1.methodology_version, h2.methodology_version);
  assert.equal(h1.source_registry_version, h2.source_registry_version);
  assert.ok(h2.source_ids.length > h1.source_ids.length);
});

test("sparklines are accessible and fail closed when trend comparability is unavailable", () => {
  assert.match(sparkline, /role="img"/);
  assert.match(sparkline, /aria-label/);
  assert.match(sparkline, /Comparable trend unavailable/);
  assert.match(page, /Comparable trend unavailable/);
});

test("participant evidence remains disabled pending disclosure-reviewed aggregates", () => {
  assert.equal(data.participant_mode.status, "not_published");
  assert.equal(data.participant_mode.public_cell_floor_n, 10);
  assert.match(page, /DVR Signal survey respondents/);
  assert.match(page, /disabled/);
});

test("issue ranking remains linked from primary navigation", () => {
  assert.match(header, /href="\/system-status\/issue-ranking\/"/);
  assert.match(header, />Issue ranking</);
});

test("page includes source drawer, unknowns, and planned improvements", () => {
  assert.match(page, /Source drawer/);
  assert.match(page, /What remains unknown/);
  assert.match(page, /Agency responses or planned improvements/);
  assert.match(page, /Pinpoint propositions/);
});

test("visual implementation includes mobile and reduced-motion rules", () => {
  assert.match(page, /@media \(max-width: 40rem\)/);
  assert.match(page, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(page, /min-height: 2\.75rem/);
});


test("Issue Ranking includes the approved bottleneck hero artwork with source framing", () => {
  assert.ok(heroArtwork.length > 100000);
  assert.equal(heroArtwork.subarray(0, 4).toString("ascii"), "RIFF");
  assert.match(page, /dvr-generalist-bottleneck-specialist-pathways\.webp/);
  assert.match(page, /loading="eager"/);
  assert.match(page, /fetchpriority="high"/);
  assert.match(page, /Conceptual systems visualization/);
  assert.match(page, /Comprehensive Statewide Needs Assessment 2022–2025/);
  assert.match(page, /not a statement that DVR has formally\s+adopted this exact staffing architecture/);
  assert.match(page, /generalist counselor at left.*specialist pathways at right/);
});
