import type { FunctionContext } from "../_shared/cloudflare-types";
import { isSameOrigin, jsonResponse } from "../_shared/http";
import { validateSurveyEnvelope } from "../_shared/survey-validation";
import { verifyTurnstileToken } from "../_shared/turnstile";

export async function onRequestPost(context: FunctionContext): Promise<Response> {
  const { request, env } = context;

  if (env.COLLECTION_ENABLED !== "true") {
    return jsonResponse({
      ok: false,
      code: "collection_disabled",
      message: "Survey collection is not currently enabled.",
    }, 503);
  }

  if (!env.RESEARCH_DB || !env.TURNSTILE_SECRET_KEY) {
    return jsonResponse({
      ok: false,
      code: "collection_unavailable",
      message: "Survey storage is not fully configured.",
    }, 503);
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ ok: false, code: "origin_rejected" }, 403);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, code: "invalid_json" }, 400);
  }

  const validated = validateSurveyEnvelope(payload);
  if (!validated.ok) {
    return jsonResponse({
      ok: false,
      code: "invalid_submission",
      detail: validated.error,
    }, 400);
  }

  const turnstileOk = await verifyTurnstileToken(
    validated.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
  );

  if (!turnstileOk) {
    return jsonResponse({ ok: false, code: "turnstile_failed" }, 400);
  }

  const responseId = crypto.randomUUID();
  const submittedAt = new Date().toISOString();

  const result = await env.RESEARCH_DB.prepare(
    `INSERT INTO survey_responses (
      response_id,
      submitted_at,
      survey_version,
      consent_version,
      respondent_cohort,
      answers_json
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      responseId,
      submittedAt,
      validated.surveyVersion,
      validated.consentVersion,
      validated.respondentCohort,
      JSON.stringify(validated.answers),
    )
    .run();

  if (!result.success) {
    return jsonResponse({
      ok: false,
      code: "storage_error",
      message: "The response could not be stored.",
    }, 500);
  }

  return jsonResponse({
    ok: true,
    message: "Response received.",
  }, 201);
}
