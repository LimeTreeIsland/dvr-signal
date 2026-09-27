import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/accommodation-builder.ts", "utf8");
const page = await readFile("src/pages/tools/accommodations.astro", "utf8");
const tool = JSON.parse(await readFile("tools/accommodations.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/accommodation-review.yaml", "utf8"));

test("Accommodation Builder remains fail-closed pending maintainer approval", () => {
  assert.equal(tool.enabled, false);
  assert.notEqual(tool.status, "active");
  assert.equal(review.status, "review_complete_maintainer_approval_pending");
  assert.match(engine, /unavailable_pending_review/);
  assert.match(page, /Activation pending maintainer approval/);
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
