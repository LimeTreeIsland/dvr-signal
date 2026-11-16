import assert from "node:assert/strict";
import test from "node:test";
import { calendarDays, validateLedger, summarizeLedger } from "../src/lib/delay-ledger.mjs";

test("UTC calendar-day intervals are DST-safe and reject impossible dates", () => {
  assert.equal(calendarDays("2026-03-07", "2026-03-10"), 3);
  assert.equal(calendarDays("2024-02-28", "2024-03-01"), 2);
  assert.equal(calendarDays("2026-02-29", "2026-03-01"), null);
  assert.equal(calendarDays("2026-11-17", "2026-11-16"), null);
});
test("milestones and distinct named counselors are separated from interim assignments", () => {
  const ledger = validateLedger({
    version: 1, eligibility_date: "2024-01-15",
    reported_assessment_accuracy_percent: 60,
    events: [
      { date: "2024-01-20", title: "VRC A", person: "A", kind: "counselor", status: "completed", source_type: "participant_report" },
      { date: "2024-01-22", title: "Same VRC", person: "a", kind: "counselor", status: "completed", source_type: "participant_report" },
      { date: "2024-02-02", title: "Interim VRC", person: "B", kind: "interim_counselor", status: "completed", source_type: "participant_report" },
      { date: "2024-03-01", title: "IPE", kind: "ipe_signed", status: "completed", source_type: "original_document" },
      { date: "2024-04-02", title: "Correction requested", kind: "correction_request", status: "pending", source_type: "agency_correspondence" },
    ],
  });
  const result = summarizeLedger(ledger, "2024-05-02");
  assert.equal(result.counselor_count, 1);
  assert.equal(result.interim_count, 1);
  assert.equal(result.open_records_requests, 1);
  assert.equal(result.reported_accuracy_percent, 60);
  assert.equal(calendarDays(ledger.eligibility_date, result.first_ipe.date), 46);
});
test("invalid imports fail closed rather than silently producing legal conclusions", () => {
  const base = { version: 1, eligibility_date: "2024-01-15", events: [] };
  assert.throws(() => validateLedger({ ...base, reported_assessment_accuracy_percent: 120 }), /accuracy/);
  assert.throws(() => validateLedger({ ...base, events: [{date:"2024-01-01",title:"Missing evidence",kind:"decision",status:"completed"}] }), /source_type/);
  assert.throws(() => validateLedger({ ...base, eligibility_date: "2024-02-30" }), /eligibility_date/);
});
test("public tool contains no participant case facts and is connected to issue indicators", async () => {
  const { readFile } = await import("node:fs/promises");
  const page = await readFile("src/pages/tools/delay-ledger.astro", "utf8");
  const issue = await readFile("src/pages/system-status/issue-ranking.astro", "utf8");
  assert.match(issue, /href="\/tools\/delay-ledger\/"/);
  assert.match(page, /browser memory/);
  assert.match(page, /Fictional example/);
  assert.doesNotMatch(page, /104237|Lindholm|Quantiply|Eliza Lester|Amanda Kipfer/);
});
