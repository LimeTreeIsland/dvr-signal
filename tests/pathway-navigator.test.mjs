import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/pathway-navigator.ts", "utf8");
const page = await readFile("src/pages/tools/navigator.astro", "utf8");
const tool = JSON.parse(await readFile("tools/navigator.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/pathway-navigator-review.yaml", "utf8"));

test("Pathway Navigator remains fail-closed pending maintainer approval", () => {
  assert.equal(tool.enabled, false);
  assert.notEqual(tool.status, "active");
  assert.equal(review.status, "review_complete_maintainer_approval_pending");
  assert.match(page, /Activation pending maintainer approval/);
  assert.match(engine, /unavailable_pending_review/);
});

test("Navigator preserves application/referral and order-of-selection uncertainty", () => {
  assert.ok(review.stages.application.must_not_assume.includes("referral_equals_application"));
  assert.equal(review.stages.ipe.order_of_selection_branch_required, true);
  assert.match(page, /order of selection or a waiting list/i);
});

test("Navigator does not calculate eligibility or IPE deadlines", () => {
  assert.equal(review.deadline_calculation_enabled, false);
  assert.equal(review.stages.eligibility.exact_calculation_enabled, false);
  assert.equal(review.stages.ipe.exact_calculation_enabled, false);
  assert.match(page, /does not calculate an exact stage deadline here/i);
  assert.doesNotMatch(engine, /calculateDueDate|addDays\(|addBusinessDays/);
});

test("Navigator does not invent a universal assessment deadline or mandatory comprehensive assessment", () => {
  assert.equal(review.stages.assessment.universal_standalone_deadline, false);
  assert.equal(review.stages.assessment.comprehensive_assessment_always_required, false);
});

test("employment is not equated with successful closure", () => {
  assert.match(review.stages.employment.reference, /Employment alone is not successful closure/i);
  assert.equal(review.stages.closure.successful_employment_test_applies_to_all_closures, false);
});

test("specific concerns hand off to the other tools instead of duplicating their logic", () => {
  assert.match(engine, /handoffs\.push\("records"\)/);
  assert.match(engine, /handoffs\.push\("accommodations"\)/);
  assert.match(engine, /handoffs\.push\("decisions", "challenge"\)/);
  assert.match(page, /Written Decision \+ Deadline Checker/);
  assert.match(page, /Challenge a DVR Decision/);
});

test("Navigator contains no network or persistent-storage primitive", () => {
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
