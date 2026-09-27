# Procedural rules

Status: schema and disabled seed definitions; no operational deadline calculator.

Each rule has a stable ID, version, jurisdiction, authority type, official URL,
pinpoint citation, plain-language summary, applicability, trigger event, required
inputs, explicit exceptions, timing units, source status, last-reviewed date,
reviewer, approval reference, and enabled flag. Review state and source status
are separate: checking a source is not approval of an automated interpretation.

## Calculation contract

1. Establish which procedure and authority apply. A case-service record request,
   public-records request, service denial, administrative review, fair hearing,
   and judicial review are distinct routes.
2. Establish the actual triggering event and reliable date. Sent, received,
   decided, served and learned-of dates must not be interchanged.
3. Apply verified exceptions/extensions, holidays, counting rules, and terminal
   day rules only where sourced. Preserve original and extended deadlines.
4. Show assumptions and missing facts. Month/year survey dates cannot support
   exact-day deadline conclusions. Unknown extension status prevents a definitive
   overdue classification.
5. Return a review prompt instead of a deadline when required facts or review
   are missing. Do not claim an appeal is timely, late, or tolled without support.

No support request or informal complaint is assumed to pause an appeal clock.
The dashboard's elapsed time is descriptive; it is not a legal adjudication.

## Initial rules

| ID | Purpose | Current status |
| --- | --- | --- |
| WA-WRITTEN-RESPONSE-01 | Correct WAC 388-891A-0211 request-receipt anchor | Live source checked; disabled pending applicability/counting review |
| FED-ELIGIBILITY-01 | Eligibility timing framework | Snapshot lead; disabled pending full verification |
| FED-IPE-01 | IPE development framework | Snapshot checked; disabled pending full verification |
| FED-IPE-REVIEW-01 | Annual IPE review | Snapshot checked; disabled pending full verification |
| FED-RECORDS-01 | Access/correction of own record | Snapshot checked; disabled pending Washington routing review |

Seeds are in `data/washington/procedural-rules.yaml`. Empty timing fields mean
unimplemented, never an unlimited deadline or absence of legal protection.

## Required behavior tests before activation

Test the exact threshold and adjacent dates; leap years/month boundaries;
working-day/holiday rules; unknown or approximate dates; invalid date ordering;
extensions and waitlist applicability; excluded procedures; and missing facts.
For records routing test own file, internal correspondence/policies, both, and
unsure. Drafts remain editable and must never assert unentered facts.

Preserve old rule versions with published aggregate versions. Reclassification
requires a documented migration and correction note, not silent replacement.
