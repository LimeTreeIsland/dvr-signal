# Issue Ranking page specification

Status: implementation scaffold; ranking methodology is not approved for publication.

## Product

Route: `/system-status/issue-ranking/`

Navigation label: **Issue ranking**

Page title: **DVR Issue Pressure Index**

Supporting line: **A compact view of tracked system issues, their evidence, current
status, and change over time.**

The page is a civic-tech monitoring instrument. It must not turn a planning
document, participant report, or proposed reform into a legal finding. Public
issue scoring remains disabled until the maintainer explicitly approves both the
methodology and the source-backed issue values.

## Core visual contract

Each issue row is prepared to render:

```text
[rank] [issue name]
[pressure bar] [score] [status label] [momentum]
[one-line explanation] [history sparkline when available]
```

If a score is not approved, render **Not scored** rather than zero. Unknown is
never success, failure, or a numeric zero.

Color describes the independently reviewed current status and must never be
derived mechanically from the pressure score:

- teal `#48C7B6`: improving / relatively healthy
- yellow `#FFD84D`: needs review
- orange `#FF7A00`: documented warning / material problem
- coral `#FF5C42`: serious breakdown / highest concern
- slate `#56616B`: unknown / insufficient current data

All color states require visible text.

## Interaction

Prepare controls for:

1. Current pressure
2. Improvement momentum
3. Participant impact
4. Evidence confidence
5. Evidence source: combined / official / participant
6. Snapshot selection

Controls depending on unapproved or unavailable data remain visible but disabled
with an explanation. Participant mode must distinguish not collected, insufficient,
suppressed, and published. It must never convert missing participant evidence to 0.

Each issue expands to show definition, score components when approved, current
status, momentum, evidence-source types, timeline events, and source links.

## Scoring contract

The requested draft scoring structure is retained as a proposal only:

- severity: up to 30
- participant impact: up to 25
- breadth: up to 15
- persistence: up to 10
- evidence strength: up to 10
- downstream effects: up to 10

The application must not assign or publish issue-level values until maintainer
approval is recorded. When values are approved, the total is derived from
components and never stored as an independent editable field.

Pressure, status, momentum, and evidence confidence remain separate dimensions.

## Snapshot rules

Published snapshots are immutable and include:

- snapshot ID
- period start/end
- methodology version
- source-registry version
- created date
- issue records used

A later methodology version must not silently recalculate a historical snapshot.

## Evidence

Keep agency sources, independent/public oversight sources, and DVR Signal
participant aggregates separate. A voluntary respondent sample is never described
as representative of all Washington DVR participants.

The initial scaffold uses current official Washington DVR source entry points for
Order of Selection, the State Plan, and the Comprehensive Statewide Needs
Assessment. Source monitoring can propose changes, but cannot change public
scores, status colors, or conclusions without review.

## Accessibility

Target WCAG 2.2 AA:

- keyboard-operable expansion and controls
- visible focus
- at least 44px interactive targets
- text equivalents for bars and sparklines
- no color-only meaning
- reduced-motion support
- 320 CSS pixel reflow
- usable at 200% text zoom

## Definition of done for the scaffold

- route builds in Astro
- no framework dependency added
- page is data-driven
- issue score is derived when components exist
- null scores render as Not scored, never 0
- source links are official/public
- participant mode fails closed
- tests cover null handling, score derivation, source references, navigation, and
  conservative publication language
