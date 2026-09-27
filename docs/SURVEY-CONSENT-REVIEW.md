# V1C-01 Survey + Consent review

Status: research and product-safety review complete; data collection remains disabled pending maintainer approval of the launch decisions below.

Prepared: 2026-09-27
Scope: anonymous 3–5 minute Washington DVR participant-experience survey, skip logic, consent, privacy boundary, and public-use limitations.

## Measurement purpose

The survey is designed to test process hypotheses rather than solicit or confirm allegations.

The core unit is a **reported Washington DVR service episode**, not a complaint. The instrument should measure events and states such as:

application → eligibility → order of selection → vocational assessment / planning → IPE → services → employment → closure

and cross-stage issues such as counselor continuity, written decisions, accommodations, records, dispute activity, communication, and participant-reported associated impacts.

The survey must include healthy/positive response options as well as problems so the resulting dataset can show both successful and unsuccessful experiences.

## Target burden

Target completion time: **3–5 minutes for the core path**.

The survey should use approximately 20–24 core prompts, with conditional modules shown only when relevant. Multi-selects and branch questions may generate more stored variables than visible questions.

The survey should not require a narrative to participate.

## Proposed V1 respondent scope

### Primary analytical cohort

Proposed primary dashboard cohort:

- a current or former Washington DVR participant answering about their own experience; or
- a person who applied for Washington DVR services but did not proceed to services.

### Authorized representatives

Authorized parent/guardian/representative responses may be collected only if clearly labeled and analyzed as a **separate respondent cohort**. They should not silently be pooled with first-person participant responses in primary percentages.

### Minors / youth

**Open approval decision:** the initial public survey should not intentionally collect direct responses from people under 18 until the project separately approves youth/minor consent, privacy, and provider-handling rules.

The survey may still ask adult respondents whether the episode involved a student/youth transition pathway because that process context materially changes interpretation.

## One episode per response

The analytical unit is one Washington DVR service episode.

A participant with multiple DVR episodes should answer about one selected episode per submission. If a later version permits multiple submissions for different episodes, it must ask the respondent to identify which period the response concerns without creating a cross-response identifier.

Because the survey is anonymous and does not require sign-in, DVR Signal cannot guarantee one response per person or reliably deduplicate repeated submissions. This limitation must be disclosed.

## Consent gate

Before any survey questions are saved, the participant must affirm consent.

Proposed consent text:

> DVR Signal is an independent project, not Washington DVR or DSHS. This voluntary survey asks about one Washington DVR experience for research and aggregate reporting. Do not enter your name, case number, address, counselor name, diagnosis, medical details, or other identifying information. Survey responses will never be published as raw participant-level records. Public results will be aggregate and subject to disclosure controls. Because the research survey is designed without a response identifier, DVR Signal may be unable to locate or delete a particular anonymous response after submission. Participation does not affect DVR services, benefits, appeals, or legal rights.

Required consent choices:

- **I am 18 or older, understand the notice above, and voluntarily agree to participate.**
- **I do not agree.**

No consent → no response is submitted.

## Core V1 privacy boundary

The current repository privacy model is more conservative than some earlier survey design drafts. For V1, use the repository boundary unless the maintainer later approves an expansion.

### Do collect

- process stage/status;
- approximate month/year event timing;
- order-of-selection status;
- counselor count / turnover effects;
- vocational-assessment status/components;
- IPE status / extension / review;
- informed-choice experience;
- self-employment branch where applicable;
- service-delivery funnel;
- written-decision safeguards;
- accommodation request/result;
- records/correction activity;
- dispute/appeal activity;
- broad employment/outcome status;
- broad categorical associated impacts;
- whether supporting records exist.

### Do not collect in V1 research rows

- name;
- email or phone;
- mailing/street address;
- DVR or OAH case number;
- counselor/staff names;
- diagnosis or medical narrative;
- race/ethnicity;
- gender identity;
- sexual orientation;
- exact age/date of birth;
- income or exact dollar losses;
- ZIP/city/county;
- document uploads;
- medical records;
- free-text narrative;
- contact information for press, legal help, or verification.

Optional contact/waitlist information must use a **separate form/store and separate consent** with no shared identifier or prefilled value connecting it to the anonymous survey.

## Date precision

V1 core research dates should use **YYYY-MM or unknown**, not exact day.

This supports:

- application/eligibility/IPE/service/closure month bands;
- elapsed-month or interval-censored analysis;
- broad cohort/era analysis.

Month-only data do **not** support definitive exact-day legal timeliness classifications. The dashboard therefore must not publish claims such as "X% violated the 60-day rule" solely from month-level survey dates.

Adding exact-day dates later requires a separate privacy and metric-method approval.

## Core question groups

The V1 survey definition should preserve stable question IDs and skip logic.

### A. Entry and stage
- respondent relationship to the DVR experience;
- current/episode status;
- application month;
- whether DVR said additional application materials were required.

### B. Eligibility and order of selection
- eligibility status/month;
- reported eligibility extension status;
- order-of-selection waiting status;
- release-from-waitlist status/month.

### C. Counselor continuity
- number of counselors;
- transition effects when 2+;
- longest reported interruption band.

### D. Vocational assessment
- participant-understood assessment status;
- assessment subjects/components remembered;
- whether an important goal/service decision occurred while a relevant assessment was still pending.

### E. IPE
- IPE status/month;
- whether a specific-date extension was agreed;
- copy received;
- annual review reported when applicable.

### F. Employment goal / informed choice
- how employment goal was selected;
- useful alternatives information;
- participant-reported option restriction.

### G. Self-employment branch
Only when self-employment was proposed:
- feasibility-analysis status;
- sequence of feasibility and decision events at month precision.

### H. Service funnel
For the most important reported service:
- requested;
- discussed;
- included in IPE;
- approved;
- authorized;
- received;
- completed.

These stages must remain separate.

### I. Decisions / denials
When a denial/refusal is reported:
- written response;
- reasons;
- appeal-rights information;
- additional-time / supplemental-information response.

Do not ask the participant to decide whether the response was legally compliant.

### J. Accommodations
When requested:
- broad accommodation type;
- implemented / partial / alternative / denied / no response / pending / unsure.

No diagnosis is required.

### K. Records and correction
- case-service-record request status/result;
- material inaccuracy reported;
- correction-request status/outcome.

### L. Communication / continuity control
Include both problem options and positive controls such as:
- communication generally clear / case progressed consistently;
- no significant problem.

### M. Dispute / appeal activity
Allow multiple routes:
- counselor/supervisor review;
- DVR leadership/case review;
- CAP;
- mediation;
- fair hearing/OAH;
- discrimination complaint;
- other;
- none.

Do not ask the participant whether filing was legally timely.

### N. Associated impacts
Use categorical, non-causal wording:
- delayed employment;
- lost employment opportunity;
- reduced earnings/lost income;
- increased debt/financial hardship;
- housing instability/loss of housing;
- education/training interruption;
- increased reliance on family/community help;
- reduced DVR participation;
- withdrew from DVR;
- no significant negative impact;
- prefer not to answer.

Public wording must remain **participant-reported associated impacts**, not "damages caused by DVR."

### O. Outcome and evidence status
- current outcome/status;
- participant-perceived DVR contribution to employment, if employed;
- whether records exist that could support some/all events;
- broad record types only.

No uploads in the survey.

## Skip-logic principles

1. Ask only questions relevant to the reported episode/stage.
2. Preserve unknown, unsure, and not applicable as distinct values.
3. Do not treat missing/unknown as "no."
4. Do not show self-employment, accommodation, record-correction, appeal, or employment follow-ups unless triggered.
5. Skip legal-timing classification questions; collect underlying events instead.
6. Never import answers from participant help tools into the survey.

## Public reporting rules already established

- voluntary sample: describe only **DVR Signal survey respondents**, never all Washington DVR clients;
- raw respondent rows never public;
- public cell floor n=10;
- percentages inherit the cell-suppression rules;
- complementary/differencing disclosure must also be suppressed;
- no office-level V1 public display;
- no exact dates public;
- no live exact response counter that reveals new submissions;
- public releases should be batch-reviewed;
- medians/P75/P90 require separately defined usable-denominator and stability thresholds;
- contact data never joins the research table.

## Provider requirements before collection

V1C-02 must verify, in the actual hosted collection system:

- no required sign-in;
- no email collection;
- no file upload;
- no public response summary;
- no prefilled identifier connecting contact and survey forms;
- raw response store private;
- named minimum-access operators only;
- no advertising/session-replay instrumentation added by DVR Signal;
- unavoidable provider metadata disclosed accurately;
- test from an unauthenticated browser;
- no survey payload appears in public frontend logs or static build.

A hosted form may still receive network/provider metadata. DVR Signal must not promise that the infrastructure provider collects nothing.

## Anonymous withdrawal limitation

Because the proposed survey intentionally avoids names, account IDs, case numbers, and a respondent lookup token, a specific response may be impossible to identify after submission.

The consent/privacy notice must say this **before** submission. Do not promise individual deletion on request unless the system actually provides a privacy-preserving way to locate that response.

## Decisions that still require maintainer approval before V1C-01 can be marked approved

1. **Age scope:** proposed initial direct respondents are age 18+; youth/minor direct collection deferred.
2. **Representative cohort:** authorized representatives may respond but remain analytically separate from first-person respondents.
3. **Date precision:** V1 core uses month/year or unknown; exact-day research dates are deferred.
4. **Narratives:** no free-text narrative in V1 anonymous survey.
5. **Geography:** no city/ZIP/county; no office-level public output.
6. **Contact separation:** any optional contact/waitlist uses a separate unlinked system.
7. **Retention:** raw anonymous-response retention/deletion period must be selected before collection.
8. **Operators/controller:** identify the project/operator roles that can access raw responses.
9. **Update cadence:** public aggregates are batch releases after disclosure review, not live per-response updates.
10. **Duplicate handling:** disclose that anonymous duplicate submissions cannot be reliably prevented; use validation/analysis rather than sign-in or fingerprinting.

## Retention proposal for approval

Recommended V1 policy:

- retain raw anonymous survey rows while the V1 collection is active and for **24 months after the final V1 public aggregate release**;
- after that period, delete V1 raw rows and retain only disclosure-reviewed aggregate tables, methodology/version records, and non-identifying code/configuration;
- do not promise deletion of a specific anonymous row on demand when it cannot be reliably located;
- backup/provider deletion behavior must be verified in V1C-02 before this policy is published as a promise.

This balances the ability to audit/recompute V1 findings against indefinite retention of sensitive row-level experience data.

## Maintainer approval gate

This document is a proposed V1 survey/privacy contract. It does **not** authorize collection.

Collection remains disabled until the maintainer explicitly approves the listed decisions and the actual provider configuration is verified under V1C-02.
