# TinyFish source monitor

Status: implemented monitoring contract and scheduled GitHub change detector.

## Purpose

TinyFish is the public-source reading/extraction layer for DVR Signal's Issue Ranking
page. It is not an autonomous publisher or methodology authority.

The machine-readable allowlist is:

`sources/issue-ranking-watch.json`

Only those public official URLs may be checked by the scheduled monitor unless the
maintainer explicitly updates the allowlist.

## Two-stage monitoring

### Stage 1 — GitHub read-only source watch

`.github/workflows/issue-source-watch.yml` runs weekly and on manual dispatch.

It:

1. fetches only the allowlisted public sources;
2. hashes response bytes with SHA-256;
3. compares each source to the prior cached monitoring state;
4. records ETag and Last-Modified when available;
5. emits `issue-source-watch.json` as a review artifact;
6. stores only public-source fingerprints in an Actions cache for the next comparison.

First successful observation establishes a baseline. A later hash difference is a
candidate change, not a factual conclusion.

The workflow has `contents: read` only. It cannot edit the repository.

### Stage 2 — TinyFish candidate extraction

When Stage 1 reports `change_state: changed`, a Codex/Work review should use TinyFish
on the exact changed URL.

For each changed source:

1. fetch the current source with TinyFish;
2. identify the source ID and affected issue IDs from the allowlist;
3. extract only propositions relevant to those issue IDs;
4. record the page/section/table or other available pinpoint;
5. distinguish new text, removed text, changed values, unchanged context, and ambiguity;
6. compare the candidate proposition with the existing source registry and snapshot;
7. produce a candidate report;
8. do not edit a public indicator unless the evidence supports the change and the
   resulting PR preserves conflicts and unknowns.

TinyFish output must never automatically change:

- a legal interpretation;
- an evidence class;
- a participant privacy threshold;
- a source hierarchy;
- an issue definition;
- a composite government-performance rating;
- a historical published snapshot.

## Candidate report shape

The GitHub source-watch artifact conforms conceptually to
`schemas/source-monitor-candidate.schema.json`.

A TinyFish enrichment may add:

```json
{
  "source_id": "DVR_OOS_CURRENT",
  "candidate_impacts": ["resource-capacity"],
  "propositions": [
    {
      "pinpoint": "Order of Selection status",
      "existing": "All five categories closed",
      "current": "Example changed text",
      "interpretation": "candidate_change",
      "review_required": true
    }
  ]
}
```

This is review material only.

## Formal update cadence

`.github/workflows/issue-status-review.yml` runs Jan. 1 and July 1, plus manual
dispatch. It creates a read-only review packet containing:

- source-monitor report;
- neutral snapshot diff;
- issue-data validation output;
- normal application tests/build results.

The repository intentionally does not let GitHub Actions create or approve pull
requests. Codex/Work may use the review packet and TinyFish to prepare a draft PR.
The maintainer reviews and merges that PR.

## Event-driven changes

Official DVR pages do not expose a repository-style change webhook. Weekly source
watching is therefore the event detector. A detected hash change is the event that
triggers TinyFish/Codex review.

High-priority sources include:

- DVR State Plan and current plan PDF;
- Order of Selection;
- current CSNA;
- current federal Order of Selection regulation.

Additional federal awards, audits, or RSA corrective-action sources should be added
to the allowlist only after the source URL is verified and the issue mapping is clear.
