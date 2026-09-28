import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = ["2025-H2", "2026-H1", "2026-H2"];
const snapshots = [];

for (const id of files) {
  snapshots.push(JSON.parse(await readFile("data/metrics/issue-snapshots/" + id + ".json", "utf8")));
}

test("snapshot IDs and periods are unique and ordered", () => {
  assert.deepEqual(snapshots.map((item) => item.snapshot_id), files);
  const ids = new Set(snapshots.map((item) => item.snapshot_id));
  assert.equal(ids.size, snapshots.length);
});

test("snapshot provenance is explicit", () => {
  for (const snapshot of snapshots) {
    assert.ok(snapshot.created_at);
    assert.ok(snapshot.snapshot_type);
    assert.ok(snapshot.methodology_version);
    assert.ok(snapshot.source_registry_version);
    assert.ok(Array.isArray(snapshot.source_ids));
    assert.ok(Array.isArray(snapshot.indicators));
  }
});

test("historical reconstructions are labeled rather than presented as archived contemporaneous pages", () => {
  assert.equal(snapshots[0].snapshot_type, "retrospective_reconstruction");
  assert.equal(snapshots[1].snapshot_type, "retrospective_reconstruction");
  assert.equal(snapshots[2].snapshot_type, "current_partial_period");
});
