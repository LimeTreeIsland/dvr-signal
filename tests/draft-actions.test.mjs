import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const draft = await readFile("src/components/EditableDraft.astro", "utf8");

test("draft actions are explicit user actions", () => {
  assert.match(draft, /data-action="copy"/);
  assert.match(draft, /data-action="print"/);
  assert.match(draft, /data-action="save"/);
  assert.match(draft, /addEventListener\("click"/);
});

test("draft actions stay local-only", () => {
  assert.doesNotMatch(draft, /\bfetch\s*\(/);
  assert.doesNotMatch(draft, /XMLHttpRequest/);
  assert.doesNotMatch(draft, /localStorage/);
  assert.doesNotMatch(draft, /sessionStorage/);
  assert.match(draft, /navigator\.clipboard\.writeText/);
  assert.match(draft, /new Blob/);
});

test("draft feedback is announced accessibly", () => {
  assert.match(draft, /role="status"/);
  assert.match(draft, /aria-live="polite"/);
});
