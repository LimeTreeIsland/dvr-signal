# Privacy model

Status: design constraints and launch gates; collection is not active.

## Separation

| Information | Storage/access | Public release |
| --- | --- | --- |
| Help-tool inputs | Browser memory; user controls local export | Never transmitted by the tool |
| Anonymous survey rows | Private provider store; named minimum-access operators | Never raw or participant-level |
| Optional contact/waitlist | Separate form and store, separate consent | Never |
| Verification evidence | Outside Phase 1; future private, consent-based process | No automatic release |
| Aggregates | Separate allowlisted export after disclosure review | Suppressed, versioned cells only |
| Individual case overlay | Local-only or synthetic for Phase 1 | Real public stories require separate explicit consent and redaction |

No shared identifiers, prefilled links, timestamps exposed for joining, advertising
trackers, fingerprinting or session replay linking contact, tool and survey data.
Do not trade anonymity for duplicate prevention through sign-in or IP collection.

## Collection controls

Collect only the approved dictionary. No medical attachments, names, exact dates
in the research survey, free-text narratives, exact location or staff names.
Disable hosted-form email/sign-in/file-upload/response-summary features. Test as
an unauthenticated participant. Document any unavoidable provider metadata and
retention honestly before describing the survey as anonymous.

Staff access must be explicit, revocable and limited to need. Keep service
credentials out of git and static builds. Public repository access grants no
survey-store access. Minimize application logs and never log payloads.

## Disclosure controls

- Established policy: no public cell n<10. Text and percentage displays count as
  releases too; hiding a chart bar is insufficient.
- Review numerator and complement, totals/subtotals, overlapping filters, date
  windows, denominators, percentages, exports and successive releases together.
- Small cells may require suppressing a second cell, combining categories,
  coarsening values or withholding a release. Exact totals must not reconstruct
  hidden counts by subtraction.
- Proposed low-count display: “fewer than 10”; do not expose a live exact count
  starting with the first submission. Publish collection status instead.
- Proposed cadence: compute continuously in private; batch public releases after
  review. Never promise a live update that violates suppression or differencing.
- Use an aggregate-only dashboard source, not a raw Sheet with hidden columns.

These are privacy controls, not a claim that k=10 ensures anonymity. Obtain
approval for the complete release policy before accepting participant data.

## Launch decisions still required

Name the data controller and operators; verify provider settings; publish privacy
notice and consent; approve retention/deletion periods and backup handling;
define access removal and incident response; review minors/representatives;
document anonymous withdrawal limitations; approve duplicate handling, suppression
and update cadence. Do not invent a private reporting address or deletion promise.

If anonymous responses cannot be reliably located after submission, say so before
collection. Contact unsubscribes must be possible without linking a research row.

## Repository protection

Use synthetic fixtures. `.gitignore` reduces accidental additions but is not an
access control, privacy scanner, or erasure of committed history. Review staged
diffs and public build artifacts. If exposure occurs, restrict access, revoke
affected credentials, assess copies and notifications, and document remediation
without repeating sensitive content in a public issue.
