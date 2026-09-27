import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const engine = await readFile("src/lib/records-router.ts", "utf8");
const tool = JSON.parse(await readFile("tools/records.yaml", "utf8"));
const review = JSON.parse(await readFile("data/washington/records-routing-review.yaml", "utf8"));

test("records tool remains fail-closed until maintainer approval", () => {
  assert.equal(tool.enabled, false);
  assert.notEqual(tool.status, "active");
  assert.equal(review.status, "review_complete_maintainer_approval_pending");
  assert.match(engine, /unavailable_pending_review/);
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
