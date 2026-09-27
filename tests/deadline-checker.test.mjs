import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/deadline-checker.ts", "utf8");
const page = await readFile("src/pages/tools/decisions.astro", "utf8");
const tool = JSON.parse(await readFile("tools/decisions.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/written-decision-deadline-review.yaml", "utf8"));

test("deadline checker remains fail-closed pending maintainer approval", () => {
  assert.equal(tool.enabled, false);
  assert.notEqual(tool.status, "active");
  assert.equal(review.status, "review_complete_maintainer_approval_pending");
  assert.match(page, /Activation pending maintainer approval/);
});

test("ten-working-day counselor-response clock remains text-only", () => {
  assert.equal(review.clocks.written_denial_response.exact_calculation_enabled, false);
  assert.doesNotMatch(engine, /calculateWrittenResponseDeadline/);
  assert.match(page, /does not calculate the exact date/i);
});

test("fair-hearing calculator uses issue date and reviewed 45-day counting concepts", () => {
  assert.equal(review.clocks.fair_hearing_filing.exact_calculation_proposed, true);
  assert.match(engine, /calculateFairHearingDeadline/);
  assert.match(engine, /addDays\(issue, 45\)/);
  assert.match(engine, /isWeekend/);
  assert.match(engine, /isWashingtonLegalHoliday/);
  assert.match(page, /Do not substitute the date you received it/i);
  assert.match(page, /5:00 p\.m\. Pacific Time|filing cutoff/i);
});

test("Washington holiday calculator includes required fixed and floating holidays", () => {
  for (const marker of [
    "nthWeekday(year, 0, 1, 3)",
    "nthWeekday(year, 1, 1, 3)",
    "lastWeekday(year, 4, 1)",
    "observedFixedHoliday(year, 5, 19)",
    "observedFixedHoliday(year, 6, 4)",
    "nthWeekday(year, 8, 1, 1)",
    "observedFixedHoliday(year, 10, 11)",
    "addDays(thanksgiving, 1)",
    "observedFixedHoliday(year, 11, 25)",
  ]) {
    assert.ok(engine.includes(marker), `missing holiday calculation: ${marker}`);
  }
});

test("mediation tolling is not claimed", () => {
  assert.equal(review.routes.mediation.tolling_claim_allowed, false);
  assert.match(page, /does not automatically extend this filing deadline/i);
});

test("deadline checker contains no network or persistent-storage primitive", () => {
  const combined = engine + page;
  const forbiddenTerms = [
    "fetch(",
    "XML" + "HttpRequest",
    "local" + "Storage",
    "session" + "Storage",
    "send" + "Beacon",
  ];
  for (const term of forbiddenTerms) {
    assert.equal(combined.includes(term), false, `unexpected primitive: ${term}`);
  }
});
