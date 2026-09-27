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
  const forbiddenTerms = [
    "fetch(",
    "XML" + "HttpRequest",
    "local" + "Storage",
    "session" + "Storage",
  ];

  for (const term of forbiddenTerms) {
    assert.equal(draft.includes(term), false, `unexpected client transmission/storage primitive: ${term}`);
  }

  assert.match(draft, /navigator\.clipboard\.writeText/);
  assert.match(draft, /new Blob/);
});

test("draft feedback is announced accessibly", () => {
  assert.match(draft, /role="status"/);
  assert.match(draft, /aria-live="polite"/);
});
