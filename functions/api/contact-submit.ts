import type { FunctionContext } from "../_shared/cloudflare-types";
import { isSameOrigin, jsonResponse } from "../_shared/http";
import { verifyTurnstileToken } from "../_shared/turnstile";

interface ContactPayload {
  consent_affirmed?: unknown;
  email?: unknown;
  purpose?: unknown;
  turnstile_token?: unknown;
}

const allowedPurposes = new Set(["project_updates"]);

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function validEmail(value: string): boolean {
  return value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequestPost(context: FunctionContext): Promise<Response> {
  const { request, env } = context;

  if (env.CONTACT_COLLECTION_ENABLED !== "true") {
    return jsonResponse({
      ok: false,
      code: "contact_collection_disabled",
      message: "Contact signup is not currently enabled.",
    }, 503);
  }

  if (!env.CONTACT_DB || !env.TURNSTILE_SECRET_KEY) {
    return jsonResponse({
      ok: false,
      code: "contact_collection_unavailable",
    }, 503);
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ ok: false, code: "origin_rejected" }, 403);
  }

  let payload: ContactPayload;
  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return jsonResponse({ ok: false, code: "invalid_json" }, 400);
  }

  if (payload.consent_affirmed !== true) {
    return jsonResponse({ ok: false, code: "consent_required" }, 400);
  }

  if (typeof payload.email !== "string") {
    return jsonResponse({ ok: false, code: "email_required" }, 400);
  }

  if (typeof payload.purpose !== "string" || !allowedPurposes.has(payload.purpose)) {
    return jsonResponse({ ok: false, code: "invalid_purpose" }, 400);
  }

  if (typeof payload.turnstile_token !== "string" || !payload.turnstile_token) {
    return jsonResponse({ ok: false, code: "turnstile_required" }, 400);
  }

  const email = normalizeEmail(payload.email);
  if (!validEmail(email)) {
    return jsonResponse({ ok: false, code: "invalid_email" }, 400);
  }

  const turnstileOk = await verifyTurnstileToken(
    payload.turnstile_token,
    env.TURNSTILE_SECRET_KEY,
  );

  if (!turnstileOk) {
    return jsonResponse({ ok: false, code: "turnstile_failed" }, 400);
  }

  const subscriptionId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const result = await env.CONTACT_DB.prepare(
    `INSERT INTO contact_subscriptions (
      subscription_id,
      created_at,
      email,
      consent_version,
      purpose,
      unsubscribed_at
    ) VALUES (?, ?, ?, ?, ?, NULL)
    ON CONFLICT(email, purpose)
    DO UPDATE SET
      consent_version = excluded.consent_version,
      unsubscribed_at = NULL`,
  )
    .bind(
      subscriptionId,
      createdAt,
      email,
      "CONTACT-001",
      payload.purpose,
    )
    .run();

  if (!result.success) {
    return jsonResponse({ ok: false, code: "storage_error" }, 500);
  }

  return jsonResponse({
    ok: true,
    message: "Contact preference received.",
  }, 201);
}
