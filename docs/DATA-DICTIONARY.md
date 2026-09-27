# Data dictionary and metrics

Status: proposed initial dictionary, not an approved live survey. Timing,
burden, skip logic and disclosure review are required before collecting data.
Target one response per participant per Washington DVR service episode. A
fully anonymous survey cannot guarantee uniqueness; disclose duplicate risk.

## Fields

All experience questions allow unknown/prefer-not-to-answer and appropriate
not-applicable states. Missing, unknown and not-applicable are distinct values.
Only eligibility/consent to the survey is mandatory. Do not require diagnoses.

| Field | Type / allowed values | Meaning and handling |
| --- | --- | --- |
| survey_version | Fixed version | Links questions and metric definitions |
| participation_consent | Boolean | No consent → do not submit |
| wa_dvr_experience | yes / no / unsure | Scope screen; unsure does not establish WA eligibility |
| episode_status | applying / active / waiting / closed / unsure | Current reported status |
| application_month | YYYY-MM / unknown | Month of application, not first inquiry |
| eligibility_status | eligible / ineligible / waiting / unsure | Eligibility is separate from service availability |
| eligibility_month | YYYY-MM / unknown | Month notified of determination |
| waitlist_status | yes / no / unsure | Reported order-of-selection waiting |
| service_release_month | YYYY-MM / unknown / not_applicable | Reported release from waitlist |
| assessment_status | not_started / underway / completed / unsure | Participant understanding, not legal sufficiency |
| ipe_status | none / draft / signed / unsure | Signed means reported agreement/signatures, not proven compliance |
| ipe_month | YYYY-MM / unknown / not_applicable | Reported signed-plan month |
| ipe_extension | agreed / not_agreed / unsure / not_applicable | Do not assume an extension was valid |
| services_status | none / some / all / unsure / not_applicable | Services received relative to reported plan |
| first_service_month | YYYY-MM / unknown / not_applicable | Exclude intake-only contacts from service-delivery metric |
| counselor_count | 1 / 2 / 3 / 4_plus / unsure | Assigned counselors within this episode |
| issue_types | Multi-select | delay, missing_step, denial, communication, record_dispute, accommodation, turnover, appeal, none, unsure |
| accommodation_requested | yes / no / unsure | Denominator for accommodation outcomes |
| accommodation_result | granted / partial / denied / pending / unsure / not_applicable | Reported result |
| denial_received | yes / no / unsure | Denominator for denial-related questions |
| written_denial | yes / no / unsure / not_applicable | Does not prove required content or timing |
| appeal_status | not_requested / requested / pending / resolved / unsure | Reported activity only |
| employment_status | working / not_working / unsure | Not automatically a DVR employment outcome |
| employment_month | YYYY-MM / unknown / not_applicable | Approximate event interval |
| closure_month | YYYY-MM / unknown / not_applicable | Approximate event interval |
| closure_reason | employment / withdrawal / ineligible / other / unsure / not_applicable | Broad category; no free-text details |

Do not collect names, case numbers, exact addresses, counselor names, diagnosis
details, attachments, narratives or email in this survey. Raw provider timestamps
stay private and are minimized under the approved retention plan.

## Metric contracts

| Metric | Numerator / population | Denominator / treatment |
| --- | --- | --- |
| Issue prevalence | Respondents selecting an issue | Respondents answering that item; multi-select totals may exceed 100% |
| Counselor continuity | Respondents selecting 2, 3 or 4_plus | Known counselor-count responses |
| Written denial reported | Reported written denial = yes | Respondents reporting a denial with known written-response status |
| Accommodation result | Each reported outcome | Respondents requesting an accommodation with known result; pending displayed separately |
| Service delivery | Some/all received | Respondents with a reported signed IPE and applicable known service status |
| Stage reach | Respondents reaching specified stage | Defined cohort with known stage status; show who remains waiting |
| Completed-event duration | Event minus anchor | Valid completed pairs; label survivor/completion bias and missingness |
| Time-to-event | Entire at-risk cohort | Include ongoing episodes as censored, handle other closures as competing events |

Survey months are interval-valued. Calculate a duration range from possible date
bounds, not invented day-1 dates. Do not publish exact-day medians, 60/90-day
compliance percentages, or ordinary Kaplan–Meier estimates from month-only data.
Choose a reviewed interval-censoring method or publish elapsed-month bands.
More detailed dates, if later justified, require a separate privacy decision.

No binary “promised help on time” measure is defined until promise, service,
deadline, applicability, extensions, ongoing cases, and denominator are explicit.
Do not force the participant journey into a strictly decreasing funnel: assessment
and service activity can overlap or occur in different orders.

## Release and change rules

Always show respondent population, valid denominator, missingness, collection
window, survey/method version, as-of date, and voluntary-sample caveat. Report
“DVR Signal survey respondents,” never statewide prevalence. No significance or
population inference from self-selection alone.

The established minimum public cell is n=10. Proposed additional policy: keep
total responses below 10 as “fewer than 10”; suppress outcome complements below
10; avoid exact live counters; batch releases and review differencing. Obtain
maintainer approval before adopting additional publication thresholds. n=10 alone
does not guarantee privacy or stable percentiles. See PRIVACY-MODEL.md.
