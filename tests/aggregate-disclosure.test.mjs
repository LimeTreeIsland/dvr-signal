import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const config = JSON.parse(await readFile("data/metrics/disclosure-engine.json", "utf8"));
const source = await readFile("src/lib/aggregate-disclosure.ts", "utf8");

test("public disclosure engine remains disabled pending policy approval", () => {
  assert.equal(config.enabled, false);
  assert.equal(config.public_export_enabled, false);
  assert.equal(config.accepts_raw_rows, false);
  assert.equal(config.status, "scaffold");
});

test("primary n=10 boundary is encoded", async () => {
  const moduleText = await import("../src/lib/aggregate-disclosure.ts");
  const result = moduleText.suppressCategoricalCells([
    { key: "zero", count: 0 },
    { key: "one", count: 1 },
    { key: "nine", count: 9 },
    { key: "ten", count: 10 },
    { key: "twenty", count: 20 },
  ], { protectReconstruction: false });

  const byKey = Object.fromEntries(result.cells.map((cell) => [cell.key, cell]));
  assert.equal(byKey.zero.visible, false);
  assert.equal(byKey.one.visible, false);
  assert.equal(byKey.nine.visible, false);
  assert.equal(byKey.ten.visible, true);
  assert.equal(byKey.twenty.visible, true);
});

test("one small categorical cell triggers secondary suppression", async () => {
  const { suppressCategoricalCells } = await import("../src/lib/aggregate-disclosure.ts");
  const result = suppressCategoricalCells([
    { key: "a", count: 6 },
    { key: "b", count: 14 },
    { key: "c", count: 30 },
  ]);

  const hidden = result.cells.filter((cell) => !cell.visible);
  assert.equal(hidden.length, 2);
  assert.equal(hidden.find((cell) => cell.key === "a")?.reason, "primary_small_cell");
  assert.equal(hidden.find((cell) => cell.key === "b")?.reason, "secondary_reconstruction_protection");
});

test("binary percentages protect numerator and complement", async () => {
  const { evaluateBinaryPercentage } = await import("../src/lib/aggregate-disclosure.ts");

  assert.equal(evaluateBinaryPercentage(9, 100).reportable, false);
  assert.equal(evaluateBinaryPercentage(10, 100).reportable, true);
  assert.equal(evaluateBinaryPercentage(90, 100).reportable, true);
  assert.equal(evaluateBinaryPercentage(91, 100).reportable, false);
  assert.equal(evaluateBinaryPercentage(10, 19).reportable, false);
});

test("proposed statistic stability thresholds are explicit", async () => {
  const { statisticIsDisplayable } = await import("../src/lib/aggregate-disclosure.ts");

  assert.equal(statisticIsDisplayable("median", 9), false);
  assert.equal(statisticIsDisplayable("median", 10), true);
  assert.equal(statisticIsDisplayable("p75", 19), false);
  assert.equal(statisticIsDisplayable("p75", 20), true);
  assert.equal(statisticIsDisplayable("p90", 29), false);
  assert.equal(statisticIsDisplayable("p90", 30), true);
});

test("engine is aggregate-only and contains no browser/network storage primitive", () => {
  assert.doesNotMatch(source, /survey_version|participant_name|case_number|diagnosis/i);

  const forbiddenTerms = [
    "fetch(",
    "XML" + "HttpRequest",
    "local" + "Storage",
    "session" + "Storage",
    "send" + "Beacon",
  ];
  for (const term of forbiddenTerms) {
    assert.equal(source.includes(term), false, `unexpected primitive: ${term}`);
  }
});
