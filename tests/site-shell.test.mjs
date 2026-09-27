import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const header = await readFile("src/components/SiteHeader.astro", "utf8");
const home = await readFile("src/pages/index.astro", "utf8");
const privacy = await readFile("src/pages/privacy.astro", "utf8");
const methods = await readFile("src/pages/methods.astro", "utf8");
const process = await readFile("src/pages/process/index.astro", "utf8");

test("site shell exposes the four primary navigation paths", () => {
  for (const href of ["/process/", "/tools/", "/methods/", "/privacy/"]) {
    assert.match(header, new RegExp(`href="${href}"`));
  }
  assert.match(header, /aria-label="Primary navigation"/);
});

test("homepage describes collection and tool status conservatively", () => {
  assert.match(home, /No survey collection is active/i);
  assert.match(home, /no tool automatically submits/i);
});

test("privacy page states that survey collection is not active", () => {
  assert.match(privacy, /No survey collection is active/i);
  assert.match(privacy, /does not currently collect anonymous survey responses/i);
});

test("methods page preserves voluntary-sample caveat", () => {
  assert.match(methods, /voluntary respondent sample/i);
  assert.match(methods, /represent all Washington DVR participants/i);
});

test("healthy process page preserves unresolved branches and timing", () => {
  assert.match(process, /research map/i);
  assert.match(process, /does not treat every elapsed-time difference\s+as a legal violation/i);
  assert.match(process, /Assessment can occur before eligibility/i);
});
