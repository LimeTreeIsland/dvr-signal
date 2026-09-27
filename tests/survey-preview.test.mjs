import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const definition = JSON.parse(await readFile("data/survey/survey-v1-preview.json", "utf8"));
const page = await readFile("src/pages/survey/index.astro", "utf8");
const review = JSON.parse(await readFile("data/survey/survey-consent-review.json", "utf8"));

test("survey preview cannot collect data", () => {
  assert.equal(definition.collection_enabled, false);
  assert.equal(review.collection_enabled, false);
  assert.match(page, /Collection is not active/);
  assert.doesNotMatch(page, /<form\b/i);
  assert.doesNotMatch(page, /action=/i);
});

test("survey preview contains a consent gate and privacy-minimized V1 boundary", () => {
  assert.match(definition.consent.required_affirmation, /18 or older/i);
  assert.equal(review.privacy.collect_case_numbers, false);
  assert.equal(review.privacy.collect_diagnosis, false);
  assert.equal(review.privacy.collect_contact_in_research_table, false);
  assert.equal(review.privacy.collect_document_uploads, false);
  assert.equal(review.privacy.collect_free_text_narrative, false);
});

test("V1 core avoids exact-day research dates", () => {
  assert.equal(review.privacy.collect_exact_day_dates, false);
  assert.deepEqual(review.privacy.date_precision, ["month", "unknown"]);
  const allTypes = definition.sections.flatMap((section) => section.core.map((q) => q.type));
  assert.equal(allTypes.includes("date"), false);
  assert.equal(allTypes.includes("datetime"), false);
});

test("survey includes positive controls rather than only problem answers", () => {
  const questions = definition.sections.flatMap((section) => section.core);
  const continuity = questions.find((q) => q.id === "CONT-002");
  const communication = questions.find((q) => q.id === "COMM-001");
  const impacts = questions.find((q) => q.id === "IMPACT-001");
  assert.ok(continuity?.options.includes("No significant problem"));
  assert.ok(communication?.options.includes("Communication generally clear/case progressed consistently"));
  assert.ok(impacts?.options.includes("No significant negative impact"));
});

test("service funnel keeps distinct delivery states", () => {
  const questions = definition.sections.flatMap((section) => section.core);
  const service = questions.find((q) => q.id === "SERV-003");
  assert.deepEqual(
    service?.options,
    ["Requested", "Discussed", "Included in IPE", "Approved", "Authorized", "Received", "Completed"],
  );
});

test("survey preview contains no network or persistent-storage primitive", () => {
  const forbiddenTerms = [
    "fetch(",
    "XML" + "HttpRequest",
    "local" + "Storage",
    "session" + "Storage",
    "send" + "Beacon",
  ];
  for (const term of forbiddenTerms) {
    assert.equal(page.includes(term), false, `unexpected primitive: ${term}`);
  }
});
