import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const choices = await readFile("src/components/ChoiceGroup.astro", "utf8");
const records = await readFile("src/pages/tools/records.astro", "utf8");
const status = await readFile("src/components/ToolStatus.astro", "utf8");

test("choice groups use semantic fieldset and legend", () => {
  assert.match(choices, /<fieldset/);
  assert.match(choices, /<legend>/);
  assert.match(choices, /type="radio"/);
});

test("records tool remains visibly fail-closed pending maintainer approval", () => {
  assert.match(records, /legal activation still requires maintainer approval/i);
  assert.match(records, /disabled={!toolEnabled}/);
  assert.match(records, /Activation pending maintainer approval/);
});

test("status component always includes text labels in addition to color", () => {
  assert.match(status, /Needs review/);
  assert.match(status, /Not yet available/);
  assert.match(status, /status-dot/);
});
