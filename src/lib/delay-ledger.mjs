// Client-only, pure calculations. This module contains no participant records.
// Calendar days use UTC date-only arithmetic so DST cannot change the count.

export const EVENT_KINDS = Object.freeze([
  "counselor",
  "interim_counselor",
  "consultant",
  "ipe_signed",
  "assessment_synthesis",
  "regulatory_guidance",
  "correction_request",
  "records_request",
  "service",
  "decision",
  "other",
]);
export const SOURCE_TYPES = Object.freeze([
  "participant_report",
  "agency_correspondence",
  "original_document",
  "adjudicated_finding",
  "not_verified",
]);
export const STATUSES = Object.freeze(["completed", "pending", "disputed"]);

export function parseDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const ms = Date.UTC(year, month - 1, day);
  const d = new Date(ms);
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    return null;
  }
  return ms;
}

export function calendarDays(start, end) {
  const a = parseDateOnly(start);
  const b = parseDateOnly(end);
  if (a === null || b === null || b < a) return null;
  return Math.round((b - a) / 86400000);
}

export function validateLedger(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Expected a JSON object.");
  }
  if (input.version !== 1) throw new Error("Unsupported ledger version; expected version 1.");
  if (parseDateOnly(input.eligibility_date) === null) {
    throw new Error("An exact eligibility_date (YYYY-MM-DD) is required.");
  }
  if (!Array.isArray(input.events) || input.events.length > 150) {
    throw new Error("events must be an array of no more than 150 milestones.");
  }
  const events = input.events.map((event, index) => {
    const n = index + 1;
    if (!event || typeof event !== "object") throw new Error("Invalid event #" + n);
    if (parseDateOnly(event.date) === null) throw new Error("Invalid date for event #" + n);
    if (typeof event.title !== "string" || !event.title.trim() || event.title.length > 180) {
      throw new Error("Invalid title for event #" + n);
    }
    if (!EVENT_KINDS.includes(event.kind)) throw new Error("Invalid kind for event #" + n);
    if (!SOURCE_TYPES.includes(event.source_type)) throw new Error("Invalid source_type for event #" + n);
    if (!STATUSES.includes(event.status)) throw new Error("Invalid status for event #" + n);
    for (const field of ["person", "source_note"]) {
      if (event[field] !== undefined && (typeof event[field] !== "string" || event[field].length > 600)) {
        throw new Error("Invalid " + field + " for event #" + n);
      }
    }
    if (event.resolved_date !== undefined &&
      (parseDateOnly(event.resolved_date) === null ||
       calendarDays(event.date, event.resolved_date) === null)) {
      throw new Error("Invalid resolved_date for event #" + n);
    }
    return {
      date: event.date,
      title: event.title.trim(),
      kind: event.kind,
      status: event.status,
      source_type: event.source_type,
      person: (event.person || "").trim(),
      source_note: (event.source_note || "").trim(),
      ...(event.resolved_date ? { resolved_date: event.resolved_date } : {}),
    };
  });
  let accuracy = null;
  if (input.reported_assessment_accuracy_percent !== undefined &&
    input.reported_assessment_accuracy_percent !== null) {
    const v = input.reported_assessment_accuracy_percent;
    if (!Number.isFinite(v) || v < 0 || v > 100) {
      throw new Error("Reported accuracy must be a number between 0 and 100.");
    }
    accuracy = v;
  }
  return {
    version: 1,
    eligibility_date: input.eligibility_date,
    reported_assessment_accuracy_percent: accuracy,
    events,
  };
}

export function summarizeLedger(ledger, asOf) {
  if (parseDateOnly(asOf) === null) throw new Error("An exact as-of date is required.");
  const visible = ledger.events.filter((event) => calendarDays(event.date, asOf) !== null);
  const first = (kind) => [...visible].filter((event) => event.kind === kind)
    .sort((a, b) => a.date.localeCompare(b.date))[0] || null;
  const uniquePeople = (kind) => new Set(visible
    .filter((event) => event.kind === kind && event.person)
    .map((event) => event.person.toLocaleLowerCase("en-US"))).size;
  const ongoing = visible.filter((event) =>
    event.status === "pending" && !event.resolved_date &&
    (event.kind === "records_request" || event.kind === "correction_request"));
  return {
    elapsed_days: calendarDays(ledger.eligibility_date, asOf),
    first_ipe: first("ipe_signed"),
    first_synthesis: first("assessment_synthesis"),
    first_regulatory_guidance: first("regulatory_guidance"),
    counselor_count: uniquePeople("counselor"),
    interim_count: uniquePeople("interim_counselor"),
    consultant_count: uniquePeople("consultant"),
    open_records_requests: ongoing.length,
    reported_accuracy_percent: ledger.reported_assessment_accuracy_percent,
  };
}
