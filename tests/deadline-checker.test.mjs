import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/deadline-checker.ts", "utf8");
const page = await readFile("src/pages/tools/decisions.astro", "utf8");
const tool = JSON.parse(await readFile("tools/decisions.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/written-decision-deadline-review.yaml", "utf8"));
const rules = JSON.parse(await readFile("data/washington/procedural-rules.yaml", "utf8")).rules;
const manifest = JSON.parse(await readFile("sources/primary/wa/v1b04-source-manifest.json", "utf8"));

test("deadline checker remains fail-closed pending maintainer approval", () => {
  assert.equal(tool.enabled, false);
  assert.notEqual(tool.status, "active");
  assert.equal(review.status, "review_complete_maintainer_approval_pending");
  assert.match(page, /Activation pending maintainer approval/);
});

test("WAC 388-891A-0211 is encoded as a denial-triggered rule, not a universal request clock", () => {
  assert.equal(
    review.clocks.written_denial_response.applies_when,
    "counselor_decides_to_deny_covered_request",
  );
  assert.equal(review.clocks.written_denial_response.clock_start, "DVR_receipt_of_request");
  assert.equal(review.clocks.written_denial_response.exact_calculation_enabled, false);

  const rule = rules.find((item) => item.id === "WA-WRITTEN-RESPONSE-01");
  assert.ok(rule);
  assert.equal(rule.trigger_event, "counselor_decides_to_deny_covered_request");
  assert.match(rule.exceptions.join(" "), /not a universal ten-working-day response requirement/i);
  assert.doesNotMatch(engine, /calculateWrittenResponseDeadline/);
});

test("45-day calculator remains disabled after source archive verification until activation approval", () => {
  assert.equal(review.clocks.fair_hearing_filing.exact_calculation_proposed, true);
  assert.equal(review.clocks.fair_hearing_filing.exact_calculation_enabled, false);
  assert.equal(
    review.clocks.fair_hearing_filing.source_archive_gate.status,
    "archived_and_verified_pending_activation_approval",
  );
  assert.equal(manifest.calculator_gate, "source_archive_complete_pending_activation_approval");
  assert.ok(
    manifest.required_sources.every(
      (source) => source.archive_status === "archived_and_verified",
    ),
  );

  assert.match(page, /data-deadline-calculation-enabled/);
  assert.match(page, /Exact 45-day calculation is not yet production-enabled/);
  assert.match(page, /exactFairHearingCalculationEnabled/);
});

test("implemented 45-day algorithm still requires issue date and reviewed counting concepts", () => {
  assert.match(engine, /calculateFairHearingDeadline/);
  assert.match(engine, /addDays\(issue, 45\)/);
  assert.match(engine, /isWeekend/);
  assert.match(engine, /isWashingtonLegalHoliday/);
  assert.match(page, /Do not substitute the date you received it/i);
});

test("federal 60-day exceptions require actual resolution/agreement, not mere mediation", () => {
  const exceptions = review.clocks.hearing_after_request.exceptions.join(" ");
  assert.match(exceptions, /informal resolution resolves the dispute/i);
  assert.match(exceptions, /mediation agreement resolves the dispute/i);
  assert.match(exceptions, /specific extension of time/i);
  assert.doesNotMatch(exceptions, /informal resolution or mediation$/i);

  const federal = rules.find((item) => item.id === "FED-HEARING-TIMING-01");
  assert.ok(federal);
  assert.match(federal.summary, /mediation agreement/i);
  assert.match(page, /Mere participation in mediation is not treated as an exception/i);
});

test("30-day written-decision clock is anchored to completion of hearing", () => {
  assert.equal(review.clocks.written_hearing_decision.unit, "calendar_days");
  assert.equal(review.clocks.written_hearing_decision.trigger, "completion_of_hearing");

  const federal = rules.find((item) => item.id === "FED-HEARING-DECISION-01");
  assert.ok(federal);
  assert.equal(federal.trigger_event, "hearing_completed");
  assert.match(federal.summary, /completion of the hearing/i);
  assert.match(page, /within 30 days of completion of the hearing/i);
});

test("state and federal continuation protections are modeled separately", () => {
  assert.equal(review.continuation_of_services.state.citation, "WAC 388-891A-0295");
  assert.equal(review.continuation_of_services.state.trigger, "fair_hearing_requested");
  assert.deepEqual(review.continuation_of_services.state.scope, ["agreed_upon_services"]);

  assert.equal(review.continuation_of_services.federal.citation, "34 CFR 361.57(b)(4)");
  assert.ok(review.continuation_of_services.federal.scope.includes("evaluation_and_assessment_services"));
  assert.ok(review.continuation_of_services.federal.scope.includes("individualized_plan_for_employment_development"));
  assert.equal(review.continuation_of_services.do_not_collapse_state_and_federal_scopes, true);

  assert.ok(rules.find((item) => item.id === "WA-CONTINUATION-OF-SERVICES-01"));
  assert.ok(rules.find((item) => item.id === "FED-CONTINUATION-OF-SERVICES-01"));
  assert.match(page, /state and federal protections are not treated as identical/i);
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
