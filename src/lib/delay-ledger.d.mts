export interface DelayEvent {
  date: string;
  title: string;
  kind: string;
  status: string;
  source_type: string;
  person: string;
  source_note: string;
  resolved_date?: string;
}
export interface DelayLedger {
  version: number;
  eligibility_date: string;
  reported_assessment_accuracy_percent: number | null;
  events: DelayEvent[];
}
export function parseDateOnly(value: unknown): number | null;
export function calendarDays(start: string, end: string): number | null;
export function validateLedger(input: unknown): DelayLedger;
export function summarizeLedger(ledger: DelayLedger, asOf: string): {
  elapsed_days: number | null;
  first_ipe: DelayEvent | null;
  first_synthesis: DelayEvent | null;
  first_regulatory_guidance: DelayEvent | null;
  counselor_count: number;
  interim_count: number;
  consultant_count: number;
  open_records_requests: number;
  reported_accuracy_percent: number | null;
};
