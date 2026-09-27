import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/accommodation-builder.ts", "utf8");
const page = await readFile("src/pages/tools/accommodations.astro", "utf8");
const tool = JSON.parse(await readFile("tools/accommodations.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/accommodation-review.yaml", "utf8"));
const rules = JSON.parse(await readFile("data/washington/procedural-rules.yaml", "utf8")).rules;

test("Accommodation Builder is active only after recorded maintainer approval", () => {
  assert.equal(tool.enabled, true);
  assert.equal(tool.status, "active");
  assert.equal(review.status, "approved_for_activation");
  assert.equal(review.exact_deadline_calculation_enabled, false);
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

test("builder starts from barrier and requested change without forcing diagnosis", () => {
  assert.equal(review.diagnosis_required_by_builder, false);
  assert.match(page, /What barrier are you experiencing\?/);
  assert.match(page, /What change, aid, service, or modification are you asking for\?/);
  assert.match(page, /Optional disability-related context/);
});

test("DVR and OAH accommodation routes stay separate", () => {
  assert.match(engine, /dvr_effective_communication/);
  assert.match(engine, /dvr_modification/);
  assert.match(engine, /oah_accommodation/);
  assert.match(page, /OAH controls accommodations for its hearings and prehearing conferences/);
});

test("ten-working-day rule is not represented as universal approval deadline", () => {
  assert.equal(review.denial_response.is_universal_approval_deadline, false);
  assert.equal(review.exact_deadline_calculation_enabled, false);
  assert.match(page, /not presented as a universal ten-working-day final-approval deadline/i);
  assert.doesNotMatch(engine, /calculateDueDate|addWorkingDays|calendarDueDate/);
});

test("Accommodation Builder implementation contains no network or persistent-storage primitive", () => {
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
