# V1C-02 Cloudflare collection/storage architecture

Status: implementation approved by maintainer on 2026-09-27; live participant collection remains fail-closed until V1C-01 survey/privacy decisions are approved and production bindings/secrets are verified.

## Approved architecture

```
dvr-signal.pages.dev
        |
anonymous survey
        |
Cloudflare Turnstile
        |
Pages Function / Workers runtime
        |
        v
D1: dvr_signal_research
        |
private aggregation candidate
        |
n >= 10 + secondary suppression
        |
manual publish gate
        |
public aggregate JSON endpoint
        |
DVR Signal dashboard
```

Optional email/contact contributions use a second database:

```
D1: dvr_signal_contact
```

There is no survey response identifier, foreign key, hidden token, email hash, or other join field connecting the research and contact databases.

## Privacy boundary

The research database stores only:

- server-generated random internal response ID;
- submission timestamp;
- survey version;
- consent version;
- respondent cohort;
- allowlisted survey answers as JSON.

It does **not** intentionally store:

- name;
- email;
- phone;
- address;
- DVR/OAH case number;
- staff names;
- diagnosis/medical narrative;
- document uploads;
- IP address;
- user-agent;
- Turnstile token.

The submission Function does not send the requester's IP address to Turnstile Siteverify. Cloudflare may still process ordinary network/security metadata as infrastructure provider; DVR Signal must not promise that the provider receives no network metadata.

## Separate contact database

The contact database stores:

- random internal subscription ID;
- timestamp;
- normalized email address;
- consent version;
- requested contact purpose;
- unsubscribe timestamp when applicable.

It stores no survey answers and no research response ID.

## Turnstile

Server-side verification is mandatory.

The Worker:

1. receives the Turnstile token;
2. sends only the secret key, token, and one-time idempotency key to Siteverify;
3. requires `success: true`;
4. discards the token;
5. then validates/records the submission.

No survey row is inserted before successful Turnstile verification.

## Collection gates

Production survey insertion requires all of:

- `COLLECTION_ENABLED=true`;
- `RESEARCH_DB` binding;
- `TURNSTILE_SECRET_KEY`;
- valid same-origin request;
- valid Turnstile verification;
- consent affirmation;
- age 18+ affirmation under the current V1 proposal;
- strict allowlist validation.

Contact collection independently requires:

- `CONTACT_COLLECTION_ENABLED=true`;
- `CONTACT_DB` binding;
- `TURNSTILE_SECRET_KEY`;
- valid same-origin request;
- contact consent;
- valid email.

## Private aggregation

Raw rows never go to the public dashboard.

The admin candidate builder:

- requires `AGGREGATION_ADMIN_TOKEN`;
- reads private research rows;
- computes only allowlisted metrics;
- applies the aggregate disclosure helpers;
- writes an aggregate candidate into `aggregate_candidates`.

The admin publish route separately:

- requires `AGGREGATION_ADMIN_TOKEN`;
- copies an explicitly selected candidate to `published_releases`.

This preserves a human review step between aggregation and publication.

## Public aggregate endpoint

`/api/public/metrics` queries only the newest row in `published_releases`.

It never queries `survey_responses` or `aggregate_candidates`.

If no reviewed release exists, it returns a no-release status rather than raw or unsuppressed data.

## Dashboard

The dashboard consumes only `/api/public/metrics`.

The public response contains:

- release ID;
- data-through date;
- survey version;
- metric version;
- population label;
- disclosure-reviewed aggregate metrics.

It contains no raw response rows.

## Databases

### dvr_signal_research

Migration:
`migrations/research/0001_initial.sql`

Tables:

- `survey_responses`
- `aggregate_candidates`
- `published_releases`

### dvr_signal_contact

Migration:
`migrations/contact/0001_initial.sql`

Table:

- `contact_subscriptions`

## Cloudflare bindings

Production Pages project bindings:

- `RESEARCH_DB` -> `dvr_signal_research`
- `CONTACT_DB` -> `dvr_signal_contact`

Secrets/variables:

- `TURNSTILE_SECRET_KEY` — secret
- `AGGREGATION_ADMIN_TOKEN` — secret
- `COLLECTION_ENABLED` — initially `false`
- `CONTACT_COLLECTION_ENABLED` — initially `false`

Public Turnstile site key is safe to expose in the survey/contact HTML when collection is activated.

## Launch sequence

1. Merge/deploy fail-closed code.
2. Create both D1 databases.
3. Apply migrations.
4. Bind both databases to the Pages project.
5. Create Turnstile widget for the production hostname.
6. store Turnstile secret as a Cloudflare secret;
7. set both collection flags to `false`;
8. test the production endpoints return fail-closed responses;
9. use synthetic/local data to test aggregation and public release;
10. approve V1C-01 survey/privacy decisions;
11. verify unauthenticated production behavior and provider metadata;
12. only then enable participant collection.
