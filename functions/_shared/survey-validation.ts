import surveyDefinition from "../../data/survey/survey-v1-preview.json";

type AnswerValue = string | string[];

interface SurveyEnvelope {
  consent_affirmed?: unknown;
  age_18_or_over?: unknown;
  turnstile_token?: unknown;
  answers?: unknown;
}

interface ValidationSuccess {
  ok: true;
  turnstileToken: string;
  surveyVersion: string;
  consentVersion: string;
  respondentCohort: string;
  answers: Record<string, AnswerValue>;
}

interface ValidationFailure {
  ok: false;
  error: string;
}

export type SurveyValidationResult = ValidationSuccess | ValidationFailure;

const yesNoUnsure = new Set(["Yes", "No", "Unsure"]);
const yesNoUnsureNa = new Set(["Yes", "No", "Unsure", "Not applicable"]);
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

const questionById = new Map(
  surveyDefinition.sections.flatMap((section) => section.core)
    .map((question) => [question.id, question] as const),
);

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validateQuestionValue(
  question: { type: string; options?: string[] },
  value: unknown,
): value is AnswerValue {
  if (question.type === "multi" || question.type === "multi_stage") {
    if (!isStringArray(value)) return false;
    if (!question.options) return false;
    return value.every((item) => question.options?.includes(item));
  }

  if (question.type === "month_or_unknown") {
    return typeof value === "string" &&
      (value === "Unknown" || monthPattern.test(value));
  }

  if (question.type === "yes_no_unsure") {
    return typeof value === "string" && yesNoUnsure.has(value);
  }

  if (question.type === "yes_no_unsure_na") {
    return typeof value === "string" && yesNoUnsureNa.has(value);
  }

  if (question.type === "single") {
    return typeof value === "string" &&
      Array.isArray(question.options) &&
      question.options.includes(value);
  }

  // V1 collection stays fail-closed for question types whose controlled
  // option vocabulary has not yet been approved in the versioned instrument.
  return false;
}

export function validateSurveyEnvelope(input: unknown): SurveyValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "invalid_payload" };
  }

  const envelope = input as SurveyEnvelope;

  if (envelope.consent_affirmed !== true) {
    return { ok: false, error: "consent_required" };
  }

  if (envelope.age_18_or_over !== true) {
    return { ok: false, error: "age_scope_not_met" };
  }

  if (typeof envelope.turnstile_token !== "string" || envelope.turnstile_token.length === 0) {
    return { ok: false, error: "turnstile_required" };
  }

  if (!envelope.answers || typeof envelope.answers !== "object" || Array.isArray(envelope.answers)) {
    return { ok: false, error: "answers_required" };
  }

  const cleanAnswers: Record<string, AnswerValue> = {};

  for (const [questionId, value] of Object.entries(envelope.answers as Record<string, unknown>)) {
    const question = questionById.get(questionId);
    if (!question) {
      return { ok: false, error: `unknown_question:${questionId}` };
    }

    if (!validateQuestionValue(question, value)) {
      return { ok: false, error: `invalid_answer:${questionId}` };
    }

    cleanAnswers[questionId] = value;
  }

  const respondentCohortRaw = cleanAnswers["RESP-002"];
  const respondentCohort = typeof respondentCohortRaw === "string"
    ? respondentCohortRaw
    : "Unknown";

  return {
    ok: true,
    turnstileToken: envelope.turnstile_token,
    surveyVersion: surveyDefinition.version,
    consentVersion: surveyDefinition.consent.id,
    respondentCohort,
    answers: cleanAnswers,
  };
}
