import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile("sources/issue-ranking-watch.json", "utf8"));
const sourceWorkflow = await readFile(".github/workflows/issue-source-watch.yml", "utf8");
const reviewWorkflow = await readFile(".github/workflows/issue-status-review.yml", "utf8");
const monitor = await readFile("scripts/source-watch.mjs", "utf8");
const docs = await readFile("docs/TINYFISH-SOURCE-MONITOR.md", "utf8");

test("source monitor is limited to approved public hosts", () => {
  const allowed = new Set([
    "www.dshs.wa.gov",
    "live-dshs-dshs2.pantheonsite.io",
    "www.ecfr.gov",
    "rsa.ed.gov",
  ]);

  assert.equal(manifest.policy.candidate_only, true);
  assert.equal(manifest.policy.may_change_public_conclusions, false);

  for (const source of manifest.sources) {
    assert.ok(allowed.has(new URL(source.url).hostname), source.url);
    assert.ok(source.issue_ids.length > 0);
  }
});

test("scheduled source and status workflows stay read-only", () => {
  for (const workflow of [sourceWorkflow, reviewWorkflow]) {
    assert.match(workflow, /permissions:\n  contents: read/);
    assert.doesNotMatch(workflow, /contents:\s*write/);
    assert.doesNotMatch(workflow, /pull-requests:\s*write/);
    assert.doesNotMatch(workflow, /secrets\./);
  }
});

test("source monitoring only emits candidate reports and fingerprints", () => {
  assert.match(monitor, /candidate_only: true/);
  assert.match(monitor, /review_required/);
  assert.doesNotMatch(monitor, /issue-ranking\.json.*writeFile/s);
  assert.match(docs, /not an autonomous publisher/i);
  assert.match(docs, /must never automatically change/i);
});

test("formal review is scheduled for January and July", () => {
  assert.match(reviewWorkflow, /cron: "15 17 1 1,7 \*"/);
  assert.match(reviewWorkflow, /snapshot:diff/);
  assert.match(reviewWorkflow, /validate:issue-status/);
});
