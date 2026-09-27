export type RecordsScope = "case_record" | "public_records" | "both" | "unsure";
export type RecordsFormat = "electronic" | "inspect";

export interface RecordsAnswers {
  scope: RecordsScope;
  format: RecordsFormat;
  dateStart?: string;
  dateEnd?: string;
}

export interface RouterResult {
  applicability: "applicable" | "needs_information" | "unavailable_pending_review";
  routes: Array<"case_record" | "public_records">;
}

export function routeRecordsRequest(
  answers: RecordsAnswers,
  toolEnabled: boolean,
): RouterResult {
  if (!toolEnabled) {
    return {
      applicability: "unavailable_pending_review",
      routes: [],
    };
  }

  if (answers.scope === "unsure") {
    return {
      applicability: "needs_information",
      routes: [],
    };
  }

  if (answers.scope === "both") {
    return {
      applicability: "applicable",
      routes: ["case_record", "public_records"],
    };
  }

  return {
    applicability: "applicable",
    routes: [answers.scope],
  };
}

export function formatDateRange(start?: string, end?: string): string {
  if (start && end) return ` for the period ${start} through ${end}`;
  if (start) return ` from ${start} forward`;
  if (end) return ` through ${end}`;
  return "";
}

export function buildCaseRecordDraft(answers: RecordsAnswers): string {
  const range = formatDateRange(answers.dateStart, answers.dateEnd);
  const access =
    answers.format === "inspect"
      ? "review the information in"
      : "obtain electronic copies of information in";

  return [
    "Subject: Request for my DVR case-service record",
    "",
    "To Washington DVR:",
    "",
    `I am requesting to ${access} my DVR case-service record${range}.`,
    "",
    "Please process this request under WAC 388-891A-0140 and 34 CFR 361.38(c).",
    "",
    "If DVR cannot provide access or copies within five business days after receiving this request, please provide the written notice described in WAC 388-891A-0140(2), including the reason the request cannot be fulfilled within that period and the date access or the requested information will be provided.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}

export function buildPublicRecordsDraft(answers: RecordsAnswers): string {
  const range = formatDateRange(answers.dateStart, answers.dateEnd);
  const access =
    answers.format === "inspect"
      ? "inspect"
      : "receive electronic copies of";

  return [
    "Subject: Request for DSHS/DVR public records",
    "",
    "To the DSHS Public Records Officer:",
    "",
    `Under chapter 42.56 RCW and chapter 388-01 WAC, I request to ${access} the following identifiable DSHS/DVR public records${range}:`,
    "",
    "[Describe the policies, emails, correspondence, contracts, administrative records, or other identifiable records you want.]",
    "",
    "If any part of this request needs clarification, please identify the portion needing clarification. If material is withheld or redacted, please identify the legal basis for the withholding or redaction.",
    "",
    "I understand that the five-business-day requirement applies to DSHS's initial response under RCW 42.56.520 and WAC 388-01-090 and is not necessarily a five-business-day production deadline.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}
