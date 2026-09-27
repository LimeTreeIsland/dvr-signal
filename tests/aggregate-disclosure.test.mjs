import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const config = JSON.parse(await readFile("data/metrics/disclosure-engine.json", "utf8"));
const source = await readFile("src/lib/aggregate-disclosure.ts", "utf8");

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const moduleUrl = `data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`;
const disclosure = await import(moduleUrl);

test("public disclosure engine remains disabled pending policy approval", () => {
  assert.equal(config.enabled, false);
  assert.equal(config.public_export_enabled, false);
  assert.equal(config.accepts_raw_rows, false);
  assert.equal(config.status, "scaffold");
});

test("primary n=10 boundary is encoded", () => {
  const result = disclosure.suppressCategoricalCells([
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

test("one small categorical cell triggers secondary suppression", () => {
  const result = disclosure.suppressCategoricalCells([
    { key: "a", count: 6 },
    { key: "b", count: 14 },
    { key: "c", count: 30 },
  ]);

  const hidden = result.cells.filter((cell) => !cell.visible);
  assert.equal(hidden.length, 2);
  assert.equal(hidden.find((cell) => cell.key === "a")?.reason, "primary_small_cell");
  assert.equal(hidden.find((cell) => cell.key === "b")?.reason, "secondary_reconstruction_protection");
});

test("binary percentages protect numerator and complement", () => {
  assert.equal(disclosure.evaluateBinaryPercentage(9, 100).reportable, false);
  assert.equal(disclosure.evaluateBinaryPercentage(10, 100).reportable, true);
  assert.equal(disclosure.evaluateBinaryPercentage(90, 100).reportable, true);
  assert.equal(disclosure.evaluateBinaryPercentage(91, 100).reportable, false);
  assert.equal(disclosure.evaluateBinaryPercentage(10, 19).reportable, false);
});

test("proposed statistic stability thresholds are explicit", () => {
  assert.equal(disclosure.statisticIsDisplayable("median", 9), false);
  assert.equal(disclosure.statisticIsDisplayable("median", 10), true);
  assert.equal(disclosure.statisticIsDisplayable("p75", 19), false);
  assert.equal(disclosure.statisticIsDisplayable("p75", 20), true);
  assert.equal(disclosure.statisticIsDisplayable("p90", 29), false);
  assert.equal(disclosure.statisticIsDisplayable("p90", 30), true);
});

test("engine rejects malformed aggregate inputs", () => {
  assert.throws(
    () => disclosure.suppressCategoricalCells([{ key: "bad", count: -1 }]),
    /nonnegative integer/,
  );
  assert.throws(
    () => disclosure.evaluateBinaryPercentage(12, 10),
    /cannot exceed denominator/,
  );
});

test("engine is aggregate-only and contains no browser/network storage primitive", () => {
  assert.doesNotMatch(source, /participant_name|case_number|diagnosis/i);

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
