# Working on DVR Signal

Read README.md and all eight core specifications in docs/ before implementation:
PROJECT, ARCHITECTURE, LEGAL-BASELINE, PROCEDURAL-RULES, DATA-DICTIONARY,
PRIVACY-MODEL, DESIGN-SYSTEM, and TOOL-SAFETY. Read GITHUB-PERMISSIONS.md
before changing automation or access. The repository carries project memory.

## Scope and authority

- Implement one bounded issue at a time. Preserve the five-tool Phase 1 scope.
- Use the existing specifications; record contradictions and unresolved decisions.
- Legal, privacy, survey, and metric changes require explicit maintainer approval
  recorded in the issue or PR. An instruction to implement UI is not that approval.
- Separate statutes, regulations, agency policy, guidance, operational status,
  project methodology, participant reports, and document verification.
- Never infer a legal violation from elapsed time or an unverified report.
- Never invent a deadline, exception, contact address, source review, or approval.
- Pending rules must fail closed: no deadline or legal classification output.
- Read source text and exceptions before activating a rule. Cite pinpoint sections
  and preserve the source date, retrieval date, review status, and reviewer.

## Privacy and integrity

- Never commit participant records, raw survey rows, contact lists, medical records,
  case IDs, credentials, real-case fixtures, or screenshots containing those items.
- Do not copy help-tool answers into survey or analytics data. Help runs locally.
- Never expose participant-level data through pages, bundles, logs, URLs, source
  maps, API responses, downloadable files, or an embedded dashboard.
- Suppress public cells below n=10 and prevent complementary/difference disclosure.
  This floor is a project policy, not a legal anonymity guarantee.
- Describe a voluntary respondent sample, never all Washington DVR participants.
- Use synthetic examples. Public case stories need separate explicit consent and
  redaction review; a survey submission does not authorize a public story.

## Implementation and verification

- Target Astro + TypeScript, static-first. Do not add a backend or paid service
  without an approved scope change. No production collection in this foundation.
- Keep rules and survey definitions in versioned data, not scattered UI conditions.
- Every tool result distinguishes entered facts from rule-derived information,
  shows official sources and last-reviewed dates, explains unknowns, and includes
  text labels in addition to color. Copy/print/download require user action.
- Follow DESIGN-SYSTEM.md; use keyboard, screen-reader, mobile, zoom, contrast,
  and reduced-motion checks before launch. Do not claim audits not performed.
- Run `node scripts/validate-foundation.mjs` for foundation edits. Add meaningful
  rule, privacy, accessibility, typecheck, lint, and build gates with implementation.
- Never weaken checks merely to get a passing run. Report what was tested.

## Change delivery

- Use a branch and PR for future work; do not force-push main or bypass protections.
- Keep CI read-only, with no deployment or data-store secrets on untrusted PRs.
- CODEOWNERS routes review; it does not itself enforce approval or grant access.
- Respect existing LICENSE. Participant consent and dataset reuse are separate.
- Summarize behavior changes, validation, unresolved gates, and remaining risks.
