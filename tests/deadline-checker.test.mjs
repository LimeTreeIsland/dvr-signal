import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const engine = await readFile("src/lib/deadline-checker.ts", "utf8");
const page = await readFile("src/pages/tools/decisions.astro", "utf8");
const tool = JSON.parse(await readFile("tools/decisions.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/written-decision-deadline-review.yaml", "utf8"));
const rules = JSON.parse(await readFile("data/washington/procedural-rules.yaml", "utf8")).rules;
const manifest = JSON.parse(await readFile("sources/primary/wa/v1b04-source-manifest.json", "utf8"));

const transpiled = ts.transpileModule(engine, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const deadline = await import(moduleUrl);

test("corrected V1B-04 is active only after recorded maintainer approval", () => {
  assert.equal(tool.enabled, true);
  assert.equal(tool.status, "active");
  assert.equal(review.status, "approved_for_activation");
  assert.match(review.approval_reference, /maintainer approval recorded 2026-09-27/);

  for (const ruleId of tool.rule_ids) {
    const rule = rules.find((item) => item.id === ruleId);
    assert.ok(rule, `missing rule: ${ruleId}`);
    assert.equal(rule.enabled, true, `disabled active-tool rule: ${ruleId}`);
    assert.equal(rule.review_status, "approved");
  }
});

test("WAC 388-891A-0211 stays denial-triggered and exact working-day calculation stays disabled", () => {
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

test("45-day calculator source archive and activation gates are satisfied", () => {
  assert.equal(review.clocks.fair_hearing_filing.exact_calculation_proposed, true);
  assert.equal(review.clocks.fair_hearing_filing.exact_calculation_enabled, true);
  assert.equal(
    review.clocks.fair_hearing_filing.source_archive_gate.status,
    "archived_verified_and_activation_approved",
  );
  assert.equal(manifest.calculator_gate, "source_archive_complete_activation_approved");
  assert.ok(
    manifest.required_sources.every(
      (source) => source.archive_status === "archived_and_verified",
    ),
  );
  assert.match(page, /data-deadline-calculation-enabled/);
  assert.match(page, /exactFairHearingCalculationEnabled/);
});

test("45-day calculation excludes the issue date and leaves an ordinary weekday unchanged", () => {
  const result = deadline.calculateFairHearingDeadline("2026-09-01");
  assert.deepEqual(result, {
    issueDate: "2026-09-01",
    unadjustedDate: "2026-10-16",
    deadlineDate: "2026-10-16",
    adjusted: false,
    cutoff: "5:00 p.m. Pacific Time",
  });
});

test("45-day calculation moves a Saturday endpoint to the next business day", () => {
  const result = deadline.calculateFairHearingDeadline("2026-09-02");
  assert.equal(result.unadjustedDate, "2026-10-17");
  assert.equal(result.deadlineDate, "2026-10-19");
  assert.equal(result.adjusted, true);
});

test("45-day calculation moves a Washington legal holiday endpoint", () => {
  const veteransDay = deadline.calculateFairHearingDeadline("2026-09-27");
  assert.equal(veteransDay.unadjustedDate, "2026-11-11");
  assert.equal(veteransDay.deadlineDate, "2026-11-12");

  const thanksgivingFriday = deadline.calculateFairHearingDeadline("2026-10-13");
  assert.equal(thanksgivingFriday.unadjustedDate, "2026-11-27");
  assert.equal(thanksgivingFriday.deadlineDate, "2026-11-30");
});

test("calculator rejects malformed or impossible date-only inputs", () => {
  assert.throws(() => deadline.calculateFairHearingDeadline("09/01/2026"), /Expected YYYY-MM-DD/);
  assert.throws(() => deadline.calculateFairHearingDeadline("2026-02-30"), /Invalid calendar date/);
});

test("federal 60-day exceptions require actual resolution/agreement, not mere mediation", () => {
  const exceptions = review.clocks.hearing_after_request.exceptions.join(" ");
  assert.match(exceptions, /informal resolution resolves the dispute/i);
  assert.match(exceptions, /mediation agreement resolves the dispute/i);
  assert.match(exceptions, /specific extension of time/i);

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

test("state and federal continuation protections remain separate", () => {
  assert.equal(review.continuation_of_services.state.citation, "WAC 388-891A-0295");
  assert.equal(review.continuation_of_services.state.trigger, "fair_hearing_requested");
  assert.deepEqual(review.continuation_of_services.state.scope, ["agreed_upon_services"]);

  assert.equal(review.continuation_of_services.federal.citation, "34 CFR 361.57(b)(4)");
  assert.ok(review.continuation_of_services.federal.scope.includes("evaluation_and_assessment_services"));
  assert.ok(review.continuation_of_services.federal.scope.includes("individualized_plan_for_employment_development"));
  assert.equal(review.continuation_of_services.do_not_collapse_state_and_federal_scopes, true);
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
