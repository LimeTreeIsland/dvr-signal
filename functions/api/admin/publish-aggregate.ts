import type { FunctionContext } from "../../_shared/cloudflare-types";
import { hasAdminBearer, jsonResponse } from "../../_shared/http";

interface CandidateRow {
  release_id: string;
  data_through: string;
  survey_version: string;
  metric_version: string;
  aggregate_json: string;
}

export async function onRequestPost(context: FunctionContext): Promise<Response> {
  const { request, env } = context;

  if (env.AGGREGATION_ENABLED !== "true") {
    return jsonResponse({ ok: false, code: "aggregation_disabled" }, 503);
  }

  if (!env.RESEARCH_DB) {
    return jsonResponse({ ok: false, code: "research_db_unavailable" }, 503);
  }

  if (!hasAdminBearer(request, env.AGGREGATION_ADMIN_TOKEN)) {
    return jsonResponse({ ok: false, code: "admin_auth_required" }, 401);
  }

  let payload: { release_id?: unknown };
  try {
    payload = await request.json() as { release_id?: unknown };
  } catch {
    return jsonResponse({ ok: false, code: "invalid_json" }, 400);
  }

  if (typeof payload.release_id !== "string" || !payload.release_id) {
    return jsonResponse({ ok: false, code: "release_id_required" }, 400);
  }

  const candidate = await env.RESEARCH_DB.prepare(
    `SELECT release_id, data_through, survey_version, metric_version, aggregate_json
     FROM aggregate_candidates
     WHERE release_id = ?`,
  )
    .bind(payload.release_id)
    .first<CandidateRow>();

  if (!candidate) {
    return jsonResponse({ ok: false, code: "candidate_not_found" }, 404);
  }

  let aggregate: Record<string, unknown>;
  try {
    aggregate = JSON.parse(candidate.aggregate_json) as Record<string, unknown>;
  } catch {
    return jsonResponse({ ok: false, code: "candidate_invalid" }, 500);
  }

  aggregate.status = "published";
  const publishedAt = new Date().toISOString();
  aggregate.published_at = publishedAt;

  const result = await env.RESEARCH_DB.prepare(
    `INSERT INTO published_releases (
      release_id,
      published_at,
      data_through,
      survey_version,
      metric_version,
      aggregate_json
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(release_id)
    DO UPDATE SET
      published_at = excluded.published_at,
      aggregate_json = excluded.aggregate_json`,
  )
    .bind(
      candidate.release_id,
      publishedAt,
      candidate.data_through,
      candidate.survey_version,
      candidate.metric_version,
      JSON.stringify(aggregate),
    )
    .run();

  if (!result.success) {
    return jsonResponse({ ok: false, code: "publish_error" }, 500);
  }

  return jsonResponse({
    ok: true,
    release_id: candidate.release_id,
    published_at: publishedAt,
  });
}
