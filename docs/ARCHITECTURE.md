# Architecture

Status: planned architecture; application not scaffolded.

## Runtime and boundaries

Use Astro with TypeScript and static output, progressive enhancement, and small
interactive components only where needed. Pin supported dependencies and commit
the lockfile when scaffolding. Plan GitHub → Cloudflare Pages previews/production.

| Layer | Responsibility | Forbidden coupling |
| --- | --- | --- |
| Versioned authority/rule data | Source provenance, conditions, review state | UI hard-coded legal thresholds |
| Shared tool engine | Input validation, routing, pure rule evaluation, output model | Network transmission of answers |
| Presentation | Accessible forms, source cards, editable drafts, print/save | Legal reasoning hidden in components |
| Survey definition | Approved questions, options, version, skip logic | Importing help-tool state |
| Private aggregation | Validate rows, compute metrics, suppress disclosure | Raw rows in static build or GitHub |
| Public export | Allowlisted, reviewed aggregate cells | Live browser access to raw Sheets |

The tools operate in browser memory. No local storage, URL parameters, telemetry,
or session replay for answers by default. Local export occurs only on user action.
Use safe text rendering, not HTML interpolation of participant input.

## Tool engine contract

Input: tool ID/version, structured answers, explicit unknowns, and date precision.
Output: entered facts; applicability (`applicable`, `not_applicable`,
`needs_information`, `unavailable_pending_review`); rule-derived information;
conditions/uncertainties; source and review metadata; editable draft; next steps.

Only rules marked approved, current, and enabled may drive legal outputs. Each
applicable rule needs a documented trigger, exceptions, units, and version.
Never treat `unknown` as false. Do not calculate when precision is insufficient.
Derived outputs must be deterministic for the same versioned inputs.

## Survey and aggregation

Maintain survey definition in this repo before mirroring to a hosted form.
Google Forms → private Google Sheet → separate aggregate-only export → dashboard
is a proposed Phase 1 route. Validate provider settings before calling it anonymous:
no email collection, required sign-in, upload, or public response summaries.
Disclose provider metadata handling; app-level anonymity is not a promise that
providers collect no network metadata.

Looker Studio, if used, must connect only to an approved aggregate data source.
Hidden columns and disabled download controls do not make a raw source safe.
No Google service credentials or private Sheet identifiers in the frontend.

Proposed update policy: compute privately as responses arrive; publish only on
privacy-approved releases. A continuously changing public counter can reveal
individual submissions through differences. Label public refresh time honestly.

## Validation and deployment

Current CI: foundation validation only, read-only token, no secrets or deploy.
Scaffold CI next: locked install, lint, Astro/typecheck, targeted unit tests, static
build. Test public bundles and network behavior for data leakage. Add meaningful
rules-engine boundary tests and aggregate suppression tests before launch.

Use preview environments with synthetic data. Production collection, external
connections, and deployment credentials are separate configuration work, not
implicit consequences of adding YAML files.
