import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const manifestPath = valueAfter("--manifest", "sources/issue-ranking-watch.json");
const outputPath = valueAfter("--output", "artifacts/issue-source-watch.json");
const statePath = valueAfter("--state", ".source-watch-state/state.json");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
let previousState = { version: 1, sources: {} };

try {
  previousState = JSON.parse(await readFile(statePath, "utf8"));
} catch {
  // First run intentionally establishes a monitoring baseline.
}

const nextState = {
  version: 1,
  generated_at: new Date().toISOString(),
  sources: { ...previousState.sources },
};

const report = {
  generated_at: new Date().toISOString(),
  manifest_version: manifest.version,
  candidate_only: true,
  sources: [],
  summary: {
    checked: manifest.sources.length,
    changed: 0,
    unchanged: 0,
    baseline_established: 0,
    fetch_errors: 0,
  },
};

for (const source of manifest.sources) {
  const prior = previousState.sources[source.source_id] ?? null;
  let result;

  try {
    const response = await fetch(source.url, {
      redirect: "follow",
      headers: {
        "user-agent": "DVR-Signal-source-monitor/1.0 (+https://github.com/LimeTreeIsland/dvr-signal)",
        accept: "*/*",
      },
      signal: AbortSignal.timeout(90_000),
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status + " " + response.statusText);
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const etag = response.headers.get("etag");
    const lastModified = response.headers.get("last-modified");

    const changeState = prior
      ? prior.sha256 === sha256
        ? "unchanged"
        : "changed"
      : "baseline_established";

    result = {
      source_id: source.source_id,
      url: source.url,
      final_url: response.url,
      issue_ids: source.issue_ids,
      priority: source.priority,
      fetch_status: "ok",
      changed: changeState === "changed",
      change_state: changeState,
      sha256,
      previous_sha256: prior?.sha256 ?? null,
      etag,
      last_modified: lastModified,
      content_length: bytes.byteLength,
      checked_at: new Date().toISOString(),
      review_required: changeState === "changed",
    };

    nextState.sources[source.source_id] = {
      sha256,
      etag,
      last_modified: lastModified,
      content_length: bytes.byteLength,
      final_url: response.url,
      checked_at: result.checked_at,
    };

    report.summary[changeState] += 1;
  } catch (error) {
    result = {
      source_id: source.source_id,
      url: source.url,
      final_url: null,
      issue_ids: source.issue_ids,
      priority: source.priority,
      fetch_status: "error",
      changed: false,
      change_state: "fetch_error",
      sha256: null,
      previous_sha256: prior?.sha256 ?? null,
      etag: null,
      last_modified: null,
      content_length: null,
      checked_at: new Date().toISOString(),
      review_required: false,
      error: error instanceof Error ? error.message : String(error),
    };
    report.summary.fetch_errors += 1;
  }

  report.sources.push(result);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await mkdir(path.dirname(statePath), { recursive: true });
await writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", "utf8");
await writeFile(statePath, JSON.stringify(nextState, null, 2) + "\n", "utf8");

console.log(JSON.stringify(report.summary));
if (report.summary.fetch_errors === report.summary.checked) process.exitCode = 2;
