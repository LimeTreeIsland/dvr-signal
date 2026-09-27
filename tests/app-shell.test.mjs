import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile("src/styles/global.css", "utf8");
const layout = await readFile("src/layouts/BaseLayout.astro", "utf8");
const home = await readFile("src/pages/index.astro", "utf8");

test("design-system status colors are defined", () => {
  for (const value of ["#121417", "#f4f2ed", "#48c7b6", "#56616b", "#ff7a00", "#ffd84d", "#ff5c42"]) {
    assert.match(css, new RegExp(value, "i"));
  }
});

test("base layout provides core landmarks and skip navigation", () => {
  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /<main id="main-content"/);
  assert.match(layout, /<SiteHeader \/>/);
  assert.match(layout, /<SiteFooter \/>/);
});

test("homepage preserves current launch gates", () => {
  assert.match(home, /No survey collection is active/i);
  assert.match(home, /no tool automatically submits information to DVR/i);
  assert.match(home, /Records Router available/i);
});
