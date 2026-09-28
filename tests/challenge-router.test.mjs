import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/challenge-router.ts", "utf8");
const page = await readFile("src/pages/tools/challenge.astro", "utf8");
const tool = JSON.parse(await readFile("tools/challenge.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/challenge-decision-review.yaml", "utf8"));

test("Challenge a DVR Decision is active only after recorded maintainer approval", () => {
  assert.equal(tool.enabled, true);
  assert.equal(tool.status, "active");
  assert.equal(review.status, "approved_for_activation");
  assert.match(review.approval_reference, /maintainer approval recorded 2026-09-27/);
  assert.match(engine, /unavailable_pending_review/);
});

test("multiple lawful challenge routes are preserved", () => {
  assert.equal(review.route_compatibility.multiple_routes_allowed, true);
  assert.equal(review.route_compatibility.informal_resolution_required_before_hearing, false);
  assert.match(engine, /"informal_dvr", "cap", "mediation", "fair_hearing"/);
  assert.match(page, /does not limit you to one route/i);
});

test("CAP remains independent of DVR", () => {
  assert.equal(review.route_compatibility.cap_is_independent_of_dvr, true);
  assert.match(page, /CAP is independent of DVR/i);
});

test("mediation does not claim deadline tolling", () => {
  assert.equal(review.route_compatibility.mediation_tolls_hearing_deadline, false);
  assert.equal(review.routes.mediation.deadline_tolling_claim_allowed, false);
  assert.match(page, /should not be assumed to extend the fair-hearing filing period/i);
  assert.match(page, /Mere participation in mediation is not presented as pausing or extending/i);
});

test("general complaints and discrimination complaints remain distinct from fair hearing", () => {
  assert.equal(review.routes.general_complaint.fair_hearing_equivalence_claim_allowed, false);
  assert.equal(review.routes.discrimination_complaint.discrimination_finding_allowed, false);
  assert.match(page, /distinguishes general complaints about DVR or staff from fair hearings/i);
  assert.match(page, /does not decide whether discrimination occurred/i);
});

test("fair-hearing deadline arithmetic is delegated to V1B-04", () => {
  assert.equal(
    review.routes.fair_hearing.deadline_calculation_delegated_to,
    "Written Decision + Deadline Checker",
  );
  assert.match(page, /Open the Written Decision \+ Deadline Checker/);
  assert.doesNotMatch(engine, /calculateFairHearingDeadline|addDays\(/);
});

test("challenge implementation contains no network or persistent-storage primitive", () => {
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
