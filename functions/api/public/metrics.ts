import type { FunctionContext } from "../../_shared/cloudflare-types";
import { jsonResponse } from "../../_shared/http";

interface PublishedRow {
  aggregate_json: string;
}

export async function onRequestGet(context: FunctionContext): Promise<Response> {
  const { env } = context;

  if (env.PUBLIC_METRICS_ENABLED !== "true") {
    return jsonResponse({
      status: "not_published",
      message: "Public survey metrics are not currently enabled.",
    }, 200);
  }

  if (!env.RESEARCH_DB) {
    return jsonResponse({
      status: "unavailable",
      message: "Public aggregate storage is not available.",
    }, 503);
  }

  const row = await env.RESEARCH_DB.prepare(
    `SELECT aggregate_json
     FROM published_releases
     ORDER BY published_at DESC
     LIMIT 1`,
  ).first<PublishedRow>();

  if (!row) {
    return jsonResponse({
      status: "no_release",
      message: "No disclosure-reviewed aggregate release has been published.",
    }, 200);
  }

  let aggregate: Record<string, unknown>;
  try {
    aggregate = JSON.parse(row.aggregate_json) as Record<string, unknown>;
  } catch {
    return jsonResponse({ status: "unavailable" }, 500);
  }

  return jsonResponse(aggregate, 200);
}
