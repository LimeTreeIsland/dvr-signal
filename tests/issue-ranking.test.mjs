import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const data = JSON.parse(await readFile("data/metrics/issue-ranking.json", "utf8"));
const page = await readFile("src/pages/system-status/issue-ranking.astro", "utf8");
const rankingLib = await readFile("src/lib/issue-ranking.ts", "utf8");
const header = await readFile("src/components/SiteHeader.astro", "utf8");

test("issue ranking scaffold fails closed on unapproved scores", () => {
  assert.equal(data.publication_status, "methodology_pending");
  assert.ok(data.issues.length >= 7);
  for (const issue of data.issues) {
    assert.equal(issue.scores, null);
    assert.equal(issue.status, "unknown");
  }
  assert.match(page, /Not scored/);
  assert.match(page, /never as zero/i);
});

test("issue ranking keeps pressure separate from status", () => {
  assert.match(page, /pressure score, current status color, momentum/i);
  assert.match(rankingLib, /calculatePressureScore/);
  assert.doesNotMatch(rankingLib, /score\s*>\s*80.*serious/i);
});

test("draft scoring components sum to 100 maximum points", () => {
  const values = Object.values(data.methodology.component_maxima);
  assert.equal(values.reduce((sum, value) => sum + value, 0), 100);
});

test("official source entry points are present and current-source scoped", () => {
  const ids = new Set(data.sources.map((source) => source.id));
  for (const required of ["DVR_STATE_PLAN_CURRENT", "DVR_OOS_CURRENT", "DVR_CSNA_2025"]) {
    assert.ok(ids.has(required));
  }
  for (const source of data.sources) {
    assert.match(source.url, /^https:\/\/(www\.)?dshs\.wa\.gov\//);
  }
});

test("participant evidence is unavailable rather than treated as zero", () => {
  for (const issue of data.issues) {
    assert.equal(issue.participant_evidence_state, "not_published");
  }
  assert.match(page, /Participant mode remains unavailable/i);
});

test("issue ranking is linked from primary navigation", () => {
  assert.match(header, /href="\/system-status\/issue-ranking\/"/);
  assert.match(header, />Issue ranking</);
});
