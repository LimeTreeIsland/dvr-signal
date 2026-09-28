# Issue Ranking page specification

Status: factual-indicator implementation in progress.

## Product

Route: `/system-status/issue-ranking/`

Navigation label: **Issue ranking**

Page title: **DVR Issue Pressure Index**

The page is a civic-tech monitoring instrument. It must not turn a planning
document, participant report, or proposed reform into a legal finding.

## Publication rule

The current public implementation uses **factual indicators**, not an assistant-authored
composite political/public-policy ranking. The proposed 0-100 composite scoring model
remains disabled. Do not publish an issue score, rank, severity winner, or color derived
from an overall evaluative judgment unless an independently approved project methodology
is supplied.

Current page order is a stable presentation order, not a best/worst ranking.

## Current issue-row anatomy

Each issue row renders:

```text
[stable order] [issue name] [evidence-state label]
[current factual indicator]
[source-linked signal ribbon]
[comparable sparkline when available]
[evidence drawer]
```

Evidence-state color describes source status, not the quality of DVR performance:

- teal: current official source / official research measure
- yellow: official-source conflict or review needed
- slate: neutral / unknown

The project-wide warning/serious colors remain available for other reviewed
methodologies but are not used here as an unsourced government-performance grade.

## Factual indicators

The initial seven domains are:

1. Resource capacity / Order of Selection
2. Counselor workload
3. Staff turnover and continuity
4. Funding and resource pressure
5. Communication reliability and service timeliness
6. Qualified-staff pipeline
7. Accessibility and accommodation implementation

Each issue stores:

- current indicator
- supporting indicators
- comparable trend series, if any
- source conflicts
- unknowns
- agency responses or planned improvements
- source IDs

No missing value is converted to zero.

## Historical snapshots

Initial files:

- `2025-H2.json`
- `2026-H1.json`
- `2026-H2.json`

The first two are explicitly labeled retrospective reconstructions because the site did
not publish contemporaneous snapshots at those dates. Future approved snapshots should
be immutable contemporaneous records.

Each snapshot records its methodology and source-registry version.

## Trends

A sparkline appears only when values are comparable measures. If a source supplies a
single cross-sectional result, conflicting values, or unlike metrics, display:

**Comparable trend unavailable.**

Do not manufacture a numeric series from narrative evidence.

## Evidence drawer

Every issue exposes three source layers:

1. DVR / DSHS material
2. Federal / oversight material
3. DVR Signal participant aggregates

Each attached source shows publisher, source type, status, dates when known, and
pinpoint propositions. Participant aggregates remain disabled until a disclosure-reviewed
public release exists.

## Participant data

When activated later:

- label the population **DVR Signal survey respondents**
- never imply statewide representativeness
- enforce the established n >= 10 public-cell floor plus complementary/differencing review
- distinguish not collected, not published, insufficient, suppressed, and published
- do not combine participant reports with official evidence into an automatic legal conclusion

## Source conflicts

Conflicts must remain visible. Current examples include:

- the final 2026-2028 State Plan text reporting 64% of VRC4 caseloads above 100;
- the 2026 draft update reporting 40%;
- the CSNA narrative summary versus Table 10 on the number of respondents with three
  or more counselors.

Do not silently pick one figure.

## Accessibility

Target WCAG 2.2 AA and preserve:

- keyboard-operable `details/summary` evidence drawers
- visible focus
- 44px minimum interactive targets
- text labels in addition to color
- accessible SVG descriptions
- reduced-motion support
- 320 CSS-pixel reflow
- layouts that survive 200% text zoom

Manual screen-reader and zoom testing remains a release gate; code structure alone is
not a conformance claim.
