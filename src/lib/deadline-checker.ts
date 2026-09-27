export type DecisionCheckMode =
  | "written_response"
  | "fair_hearing_deadline"
  | "hearing_requested";

export interface DeadlineResult {
  issueDate: string;
  unadjustedDate: string;
  deadlineDate: string;
  adjusted: boolean;
  cutoff: string;
}

function parseDateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Expected YYYY-MM-DD date.");
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Invalid calendar date.");
  }
  return date;
}

function formatDateOnly(date: Date): string {
  return [
    String(date.getUTCFullYear()).padStart(4, "0"),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function nthWeekday(year: number, month: number, weekday: number, occurrence: number): Date {
  const first = new Date(Date.UTC(year, month, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, month, 1 + offset + 7 * (occurrence - 1)));
}

function lastWeekday(year: number, month: number, weekday: number): Date {
  const last = new Date(Date.UTC(year, month + 1, 0));
  const offset = (last.getUTCDay() - weekday + 7) % 7;
  return new Date(Date.UTC(year, month, last.getUTCDate() - offset));
}

function observedFixedHoliday(year: number, month: number, day: number): Date {
  const holiday = new Date(Date.UTC(year, month, day));
  if (holiday.getUTCDay() === 6) return addDays(holiday, -1);
  if (holiday.getUTCDay() === 0) return addDays(holiday, 1);
  return holiday;
}

function legalHolidayDates(year: number): Date[] {
  const thanksgiving = nthWeekday(year, 10, 4, 4);
  return [
    observedFixedHoliday(year, 0, 1),
    nthWeekday(year, 0, 1, 3),
    nthWeekday(year, 1, 1, 3),
    lastWeekday(year, 4, 1),
    observedFixedHoliday(year, 5, 19),
    observedFixedHoliday(year, 6, 4),
    nthWeekday(year, 8, 1, 1),
    observedFixedHoliday(year, 10, 11),
    thanksgiving,
    addDays(thanksgiving, 1),
    observedFixedHoliday(year, 11, 25),
  ];
}

function isWeekend(date: Date): boolean {
  return date.getUTCDay() === 0 || date.getUTCDay() === 6;
}

function isWashingtonLegalHoliday(date: Date): boolean {
  const value = formatDateOnly(date);
  for (const year of [date.getUTCFullYear() - 1, date.getUTCFullYear(), date.getUTCFullYear() + 1]) {
    if (legalHolidayDates(year).some((holiday) => formatDateOnly(holiday) === value)) return true;
  }
  return false;
}

export function calculateFairHearingDeadline(decisionIssueDate: string): DeadlineResult {
  const issue = parseDateOnly(decisionIssueDate);
  const unadjusted = addDays(issue, 45);
  let deadline = new Date(unadjusted);

  while (isWeekend(deadline) || isWashingtonLegalHoliday(deadline)) {
    deadline = addDays(deadline, 1);
  }

  return {
    issueDate: formatDateOnly(issue),
    unadjustedDate: formatDateOnly(unadjusted),
    deadlineDate: formatDateOnly(deadline),
    adjusted: formatDateOnly(unadjusted) !== formatDateOnly(deadline),
    cutoff: "5:00 p.m. Pacific Time",
  };
}

export function buildWrittenResponseDraft(
  requestDescription: string,
  requestReceivedDate?: string,
): string {
  const received = requestReceivedDate
    ? ` DVR received my request on ${requestReceivedDate}.`
    : "";

  return [
    "Subject: Request for written response regarding DVR decision",
    "",
    "To Washington DVR:",
    "",
    `I requested the following VR service, reasonable accommodation, or other action affecting my participation: ${requestDescription.trim()}.${received}`,
    "",
    "If DVR has made a decision to deny this request, please provide the oral and written response described in WAC 388-891A-0211, including the reason(s) for the denial and my appeal rights. If additional time is needed to gather supplemental information, please identify the additional time needed and the supplemental information required.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}

export function buildFairHearingSummary(
  decisionDescription: string,
  disagreementReason: string,
  decisionIssueDate?: string,
): string {
  return [
    "DVR fair-hearing request summary",
    "",
    ...decisionIssueDate ? [`DVR decision issue date: ${decisionIssueDate}`] : [],
    `Decision I disagree with: ${decisionDescription.trim()}`,
    `Why I disagree: ${disagreementReason.trim()}`,
    "",
    "I am requesting a fair hearing regarding this DVR decision.",
    "",
    "Contact information:",
    "[Name]",
    "[Address]",
    "[Telephone]",
  ].join("\n");
}
