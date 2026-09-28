import type { FunctionContext } from "../../_shared/cloudflare-types";
import { hasAdminBearer, jsonResponse } from "../../_shared/http";
import { suppressCategoricalCells } from "../../../src/lib/aggregate-disclosure";

interface SurveyRow {
  submitted_at: string;
  survey_version: string;
  answers_json: string;
}

interface MetricSpec {
  id: string;
  label: string;
  questionId: string;
  mode: "single" | "multi";
}

const metricSpecs: MetricSpec[] = [
  { id: "case_stage", label: "Current DVR episode stage", questionId: "CASE-001", mode: "single" },
  { id: "eligibility_status", label: "Eligibility status", questionId: "ELIG-001", mode: "single" },
  { id: "assessment_status", label: "Vocational assessment status", questionId: "ASSESS-001", mode: "single" },
  { id: "ipe_status", label: "IPE status", questionId: "IPE-001", mode: "single" },
  { id: "written_denial_response", label: "Written response after reported denial", questionId: "DEC-004", mode: "single" },
  { id: "accommodation_outcome", label: "Reported accommodation outcome", questionId: "ACC-003", mode: "single" },
  { id: "appeal_routes", label: "Dispute-resolution routes used", questionId: "APPEAL-001", mode: "multi" },
  { id: "associated_impacts", label: "Participant-reported associated impacts", questionId: "IMPACT-001", mode: "multi" },
  { id: "service_funnel", label: "Most-important-service delivery stages", questionId: "SERV-003", mode: "multi" },
  { id: "current_outcome", label: "Current DVR episode outcome", questionId: "OUT-001", mode: "single" },
];

function safeMetric(
  rows: SurveyRow[],
  spec: MetricSpec,
): Record<string, unknown> {
  const counts = new Map<string, number>();
  let eligibleN = 0;
  let missingN = 0;

  for (const row of rows) {
    let answers: Record<string, unknown>;
    try {
      answers = JSON.parse(row.answers_json) as Record<string, unknown>;
    } catch {
      missingN += 1;
      continue;
    }

    const value = answers[spec.questionId];

    if (spec.mode === "single") {
      if (typeof value !== "string" || value.length === 0) {
        missingN += 1;
        continue;
      }

      eligibleN += 1;
      counts.set(value, (counts.get(value) ?? 0) + 1);
      continue;
    }

    if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
      missingN += 1;
      continue;
    }

    eligibleN += 1;
    const unique = new Set(value as string[]);
    for (const item of unique) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }

  const suppression = suppressCategoricalCells(
    [...counts.entries()].map(([key, count]) => ({ key, count })),
    {
      minimumPublicCellN: 10,
      total: spec.mode === "single" ? eligibleN : undefined,
      protectReconstruction: spec.mode === "single",
    },
  );

  return {
    id: spec.id,
    label: spec.label,
    question_id: spec.questionId,
    response_mode: spec.mode,
    eligible_n: eligibleN >= 10 ? eligibleN : null,
    missing_n: missingN >= 10 ? missingN : null,
    total: suppression.totalVisible && suppression.total !== null &&
      suppression.total >= 10
      ? suppression.total
      : null,
    cells: suppression.cells.map((cell) => ({
      key: cell.key,
      count: cell.visible ? cell.count : null,
      suppressed: !cell.visible,
      suppression_reason: cell.reason,
    })),
  };
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

  const query = await env.RESEARCH_DB.prepare(
    "SELECT submitted_at, survey_version, answers_json FROM survey_responses ORDER BY submitted_at ASC",
  ).all<SurveyRow>();

  const rows = query.results;
  if (rows.length === 0) {
    return jsonResponse({ ok: false, code: "no_responses" }, 409);
  }

  const releaseId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const dataThrough = rows.at(-1)?.submitted_at ?? createdAt;
  const versions = [...new Set(rows.map((row) => row.survey_version))];

  const aggregate = {
    release_id: releaseId,
    status: "candidate",
    population_label: "DVR Signal survey respondents",
    voluntary_sample: true,
    data_through: dataThrough,
    survey_version: versions.length === 1 ? versions[0] : "mixed",
    metric_version: "v1c03-0.1.0",
    public_cell_floor_n: 10,
    metrics: metricSpecs.map((spec) => safeMetric(rows, spec)),
  };

  const result = await env.RESEARCH_DB.prepare(
    `INSERT INTO aggregate_candidates (
      release_id,
      created_at,
      data_through,
      survey_version,
      metric_version,
      source_row_count,
      aggregate_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      releaseId,
      createdAt,
      dataThrough,
      aggregate.survey_version,
      aggregate.metric_version,
      rows.length,
      JSON.stringify(aggregate),
    )
    .run();

  if (!result.success) {
    return jsonResponse({ ok: false, code: "candidate_storage_error" }, 500);
  }

  return jsonResponse({
    ok: true,
    release_id: releaseId,
    source_row_count: rows.length,
    message: "Disclosure-controlled aggregate candidate created. Review before publishing.",
  }, 201);
}
