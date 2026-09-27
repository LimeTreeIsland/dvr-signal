# V1C-03 Metrics + Disclosure Controls review

Status: methodology/privacy review complete; aggregate publication logic remains disabled pending maintainer approval.

Prepared: 2026-09-27
Scope: rules for converting private anonymous survey rows into public aggregate cells without exposing raw responses or implying population representativeness.

## Core publication boundary

The public website must never query or receive the raw survey-response table.

The data path is:

private survey rows → private validation/aggregation → disclosure review → allowlisted aggregate export → public dashboard

The public frontend may consume only the final aggregate export.

## Population language

Every public survey display must identify the population as:

**DVR Signal survey respondents**

Required context:

- collection window;
- survey version;
- methodology/metric version;
- valid denominator;
- missing/unknown count or rate;
- as-of/release date;
- voluntary self-selected sample caveat.

Do not describe a voluntary respondent percentage as the prevalence among all Washington DVR clients.

## Established privacy floor

Project policy already establishes:

**MIN_PUBLIC_CELL_N = 10**

A count, percentage, tooltip, table cell, filtered result, chart value, API/export value, or other public representation with a final visible cohort below 10 must not be released as an exact value.

The threshold is applied **after all filters and cohort restrictions**.

A large parent population does not make a small filtered subgroup safe to publish.

## Primary suppression

For any public categorical cell:

- n >= 10 → potentially reportable, subject to complementary/differencing review;
- n < 10 → suppress exact count and any percentage derived from that count.

Proposed display text:

**Suppressed — fewer than 10 survey responses**

Do not publish exact low counts such as 0, 1, or 9 in a public breakdown when the cell is subject to this rule.

## Complementary / secondary suppression

Suppressing one cell is not enough if the hidden value can be reconstructed from visible totals or sibling cells.

Proposed deterministic V1 behavior:

1. Apply primary n<10 suppression.
2. For each complete table/breakdown, test whether visible totals/subtotals and visible sibling cells would reveal a suppressed value by subtraction.
3. If exactly one hidden cell would be reconstructable, either:
   - suppress the total/subtotal; or
   - suppress at least one additional reportable sibling cell.
4. Prefer suppressing an additional smallest reportable sibling when the total is analytically important.
5. Re-run the reconstruction test after secondary suppression.
6. Never expose an exact denominator elsewhere in the same view if it makes a suppressed numerator/complement recoverable.

The implementation should return a suppression reason, not merely remove the value.

## Binary percentages

For binary outcomes, an apparently safe numerator can reveal a small complement.

Proposed V1 rule:

Publish a binary percentage only when:

- denominator >= 20;
- numerator >= 10; and
- denominator - numerator >= 10.

This follows directly from the n=10 privacy floor for both the reported outcome and its complement.

If the complement is smaller than 10, suppress the percentage even when the numerator is large.

This 20-person minimum is a mathematical consequence of requiring both binary cells to satisfy the existing n=10 floor, not a claim that n=20 guarantees anonymity or statistical reliability.

## Multi-select questions

Multi-select categories do not sum to 100%.

Each option is independently evaluated against:

- the final filtered respondent cohort;
- n=10 primary suppression;
- any complement/differencing risks created by the display.

The dashboard must clearly label that respondents may select more than one option.

## Missing / unknown / not applicable

These values are analytically distinct.

Do not silently drop unknowns from both the numerator and denominator without disclosing the resulting valid denominator.

For every percentage, the metric contract must define:

- eligible population;
- excluded not-applicable responses;
- missing/unknown treatment;
- pending treatment, where applicable.

## Survey timing and dates

The current proposed V1 survey uses month/year or unknown rather than exact days.

Therefore:

- do not manufacture day 1 or month-end dates;
- do not publish exact-day medians;
- do not publish definitive exact 60-day / 90-day compliance rates from month-only pairs;
- derive elapsed-month bands or interval-valued durations;
- if a later method estimates interval-censored distributions, version and approve that method separately.

The help-tool legal deadline calculator is a separate system and must not be used to convert imprecise research dates into false precision.

## Funnel metrics

Service delivery must preserve distinct stages:

requested → discussed → included in IPE → approved → authorized → received → completed

The funnel is not automatically a strictly decreasing legal process. Participants may report uncertainty, overlapping activity, or unusual order.

For each stage:

- define the eligible denominator;
- show missingness;
- do not infer that failing to reach a later stage was unlawful;
- preserve "pending" separately from "denied" where relevant.

## Time-to-event metrics

Completed-case medians alone can hide ongoing long waits.

V1 should distinguish:

1. **completed-event durations** — among respondents with a valid completed start/end pair; and
2. **at-risk ongoing episodes** — respondents who have started but not yet reached the event.

Month-only timing creates interval censoring.

A Kaplan–Meier curve should not be published as though month-only dates were exact event times. A reviewed interval-censoring method or broad elapsed-month bands is required.

## Proposed stability thresholds

These are proposed analytical-display thresholds in addition to the privacy floor:

- Count/percentage: usable n >= 10, subject to complement suppression.
- Median: usable n >= 10.
- P75: usable n >= 20.
- P90: usable n >= 30.
- Survival/time-to-event tail: stop display once risk set < 10.
- Office-level analysis: disabled in V1 even if a local cell happens to exceed 10.

The P75/P90 thresholds are statistical-stability policy, not anonymity guarantees. They require maintainer approval before implementation as public-display rules.

## Geography

V1 public output should not show individual DVR-office results.

The current survey/privacy proposal also avoids city, ZIP, and county.

If region is introduced later, it must be derived/reviewed and still pass final-cohort suppression and differencing review.

## Era / historical analysis

Historical cohorts can be collected from the start using application/service year or broad period, but serious era comparison should use stronger maturity thresholds than ordinary cells.

No era comparison should be presented as representative of all DVR clients.

A future era-analysis policy may use stronger per-era sample thresholds; that is outside the initial V1 dashboard release unless separately approved.

## Associated impacts

Public wording must remain:

**participant-reported associated impacts**

Do not relabel survey association as causation or legal damages.

## Evidence status

Self-report, records-believed-to-exist, document-verified cases, agency responses, and adjudicated findings are different evidence classes.

The aggregate dashboard may stratify by evidence status only when the cohorts remain disclosure-safe.

A participant saying "I have records" is not equivalent to document verification.

## Release cadence and differencing

A continuously updating public count can reveal individual submissions by comparing successive views.

Proposed V1 release policy:

- aggregate continuously only in the private environment;
- publish in reviewed batches;
- show a public "data through" date, not a live response counter;
- retain versioned public snapshots;
- review whether successive snapshots allow small changes to be inferred;
- coarsen, delay, or withhold updates when differencing risk is material.

## Export/API rule

Any downloadable table or future public API is another public release surface.

It must apply the same:

- allowlist;
- cohort restrictions;
- primary suppression;
- complementary suppression;
- missingness rules;
- version metadata.

No client-side filter may receive unsuppressed hidden rows and merely hide them visually.

## Synthetic testing requirements

Before a public dashboard:

- n=0/1/9/10 boundary tests;
- binary 9/91, 10/90, 90/10, 91/9 complement tests;
- one-suppressed-cell + visible-total reconstruction tests;
- multiple suppressed cells;
- filtered cohort suppression;
- multi-select category tests;
- missing/unknown denominator tests;
- sequential-release differencing fixtures;
- no raw-response fields in public export fixture.

Use synthetic data only in the repository.

## Approval decisions

The following remain pending explicit maintainer approval:

1. deterministic complementary-suppression strategy;
2. binary numerator/complement rule;
3. proposed median/P75/P90 display thresholds;
4. exact low-cell display wording;
5. public batch-release cadence;
6. interval-duration display method for month-only dates;
7. whether any regional grouping is permitted in V1;
8. historical/era maturity thresholds.

## Activation gate

This review does not authorize public survey metrics or a dashboard.

Metric/disclosure code may be implemented against synthetic fixtures in fail-closed mode, but public aggregate publication remains disabled until the policy and survey instrument are approved and V1C-02 collection/storage boundaries are verified.
