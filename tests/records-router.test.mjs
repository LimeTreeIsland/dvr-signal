import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/records-router.ts", "utf8");
const tool = JSON.parse(await readFile("tools/records.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/records-routing-review.yaml", "utf8"));
const rules = JSON.parse(await readFile("data/washington/procedural-rules.yaml", "utf8")).rules;

test("records tool is active only after recorded maintainer approval", () => {
  assert.equal(tool.enabled, true);
  assert.equal(tool.status, "active");
  assert.equal(review.status, "approved_for_activation");
  assert.equal(review.calendar_due_date_calculation_enabled, false);
  assert.match(review.approval_reference, /maintainer approval recorded 2026-09-27/);

  for (const ruleId of tool.rule_ids) {
    const rule = rules.find((item) => item.id === ruleId);
    assert.ok(rule, `missing rule: ${ruleId}`);
    assert.equal(rule.enabled, true, `disabled active-tool rule: ${ruleId}`);
    assert.equal(rule.review_status, "approved");
    assert.equal(rule.source_status, "live_text_checked");
    assert.match(rule.approval_reference, /maintainer approval recorded 2026-09-27/);
  }
});

test("router implements all four declared output choices", () => {
  for (const route of ["case_record", "public_records", "both", "unsure"]) {
    assert.ok(tool.output_routes.includes(route));
    assert.match(engine, new RegExp(route));
  }
});

test("timing language distinguishes case-record fulfillment from PRA initial response", () => {
  assert.equal(review.routes.case_record.timing_is_production_deadline, true);
  assert.equal(review.routes.public_records.timing_is_production_deadline, false);
  assert.match(review.routes.public_records.timing_text, /initial response/i);
  assert.match(engine, /not necessarily a five-business-day production deadline/i);
});

test("records router does not expose exact calendar due-date calculation", () => {
  assert.equal(review.calendar_due_date_calculation_enabled, false);
  assert.doesNotMatch(engine, /addBusinessDays|calculateDueDate|calendarDueDate/);
});

test("records router implementation contains no network or persistent-storage primitive", () => {
  const forbiddenTerms = [
    "fetch(",
    "XML" + "HttpRequest",
    "local" + "Storage",
    "session" + "Storage",
    "send" + "Beacon",
  ];

  for (const term of forbiddenTerms) {
    assert.equal(engine.includes(term), false, `unexpected primitive: ${term}`);
  }
});
