# Private delay ledger — review notes

## Scope and deployment

Adds a static Astro route at `/tools/delay-ledger/`, linked from the public Issue Ranking page. All imported data stays inside the browser's memory, and it can be cleared. Only a fictional example is bundled with the site. No participant-specific event, identifier, counselor name, record, assessment percentage, or source file is committed.

The private timeline is intentionally **not** a new official indicator, participant aggregate, or government-performance score. It is not connected to the survey, dashboard, GitHub Actions source watch, or public metrics API. The tracker will not auto-publish or commit new events. It does not contact official sites, read email, or auto-detect new DVR replies.

## Supported data

JSON v1: exact eligibility date; event date, title, type, status, source classification; optional person and source note; optional request resolution date; optional participant-estimated vocational-assessment accuracy. The import validates dates, enums, counts and size. Local downloads are user-initiated.

Counts of counselors and business consultants are distinct entered names, not the number of transfers or unique people who ever briefly held a case. Interim transfers are tracked separately. Calendar-day differences exclude the start date. Unresolved requests show time since request but **not** a legal deadline. A reported percentage is not a verified quality measure.

## Review gates

- Maintainer review of whether a personal timeline tool belongs on a separate route: **required**.
- Privacy and legal methodology approval under `AGENTS.md`: **required before merge/public deployment**.
- Run `npm run validate` with Node >=22 in a cloned checkout.
- Manual keyboard, screen-reader, 200% zoom, 320px reflow, screen-reader error announcement and browser Network inspection: **not yet verified**.
- Confirm the site's deployment does not inject analytics that collect file inputs.
- Review real participant evidence and any explicit public-story consent separately. Never commit a real-case import file.
- Source-event dates in private ledgers must be verified against original documents before being cited as proven in legal proceedings.

## Follow-on features (not in this bounded PR)

Evidence-aware status transitions, legally reviewed conditional deadlines, exact source-document provenance and reference hashes, optional local case exports suitable for counsel, and one-way opt-in redaction-reviewed publication. None are authorized by this PR.
