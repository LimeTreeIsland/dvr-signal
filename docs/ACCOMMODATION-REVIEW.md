# V1B-03 Accommodation Builder source and scope review

Status: source review complete; participant-facing accommodation outputs remain disabled pending maintainer approval.

Reviewed: 2026-09-27  
Jurisdiction: Washington State DVR / DSHS  
Scope: disability-related access requests needed to participate in DVR programs, services, activities, meetings, and communications. OAH hearing accommodations are routed separately.

## Source hierarchy

This review separates:

1. **Federal regulation — ADA Title II**
   - 28 CFR 35.130(b)(7)(i): reasonable modifications to policies, practices, or procedures when necessary to avoid disability discrimination, unless the public entity demonstrates a fundamental alteration.
   - 28 CFR 35.160: effective communication and appropriate auxiliary aids/services, including primary consideration to the individual's requested aid/service.
2. **Federal VR regulation**
   - 34 CFR 361.51(c): providers of VR services must be able to communicate using appropriate modes of communication used by applicants and eligible individuals.
   - 34 CFR 361.52: information and support for informed choice must be provided through appropriate modes of communication.
3. **Washington DVR rule**
   - WAC 388-891A-0211: when a DVR counselor makes a decision to deny a request for reasonable accommodation, VR service, or another request affecting participation, the counselor responds orally and in writing within ten working days of receiving the request. The written response gives reasons and appeal rights, or explains additional time and supplemental information needed.
4. **Current DVR policy/manual**
   - The current DVR Customer Services Manual states that accommodation requests may be verbal or written and are reviewed case-by-case.
   - The manual identifies disability-related accommodation areas including communication, meeting participation, physical/sensory access, and modifications of standard policies or procedures.
   - The manual says DVR follows the response timeframe in WAC 388-891A-0211.
5. **Current public contact guidance**
   - DSHS/DVR's Resolving Concerns page directs effective-communication auxiliary-aid/service requests to `dvr.languageaccess@dshs.wa.gov`.
   - It directs accommodation or policy/procedure modification requests for participation in DSHS programs, services, or activities to `dvradacoordinator@dshs.wa.gov`.
6. **OAH is a separate entity**
   - Washington OAH maintains its own disability accommodation process. A request concerning participation in an OAH hearing or prehearing conference should be routed to OAH rather than treated as a DVR accommodation request.

## What the builder should ask

The builder should start with the **barrier and requested change**, not a forced diagnosis field.

Core inputs:

- where the accommodation is needed: DVR / OAH proceeding / unsure;
- barrier category;
- plain-language description of the barrier;
- requested change, aid, service, or modification;
- how the requested change would support participation;
- preferred communication method;
- optional disability-related context the participant chooses to include.

Suggested barrier/request categories:

- written or email communication;
- written summaries or follow-up;
- accessible electronic documents / alternate format;
- plain/direct language or communication aid;
- additional processing time;
- shorter meetings or breaks;
- remote participation;
- support person;
- captioning/interpreter/other auxiliary aid;
- physical or sensory access;
- modification of a policy, practice, or procedure;
- other.

The builder must not require a diagnosis narrative merely to generate a request. DVR may request medical documentation in some circumstances; the current manual specifically identifies requests that require medical documentation or raise questions about ADA coverage as matters staff must escalate.

## Safe legal statements

### Reasonable modification

28 CFR 35.130(b)(7)(i) supports stating that a public entity must make reasonable modifications to policies, practices, or procedures when necessary to avoid disability discrimination, unless it demonstrates that the modification would fundamentally alter the nature of the program, service, or activity.

Do not tell the participant that a requested change is automatically reasonable or legally required.

### Effective communication

28 CFR 35.160 supports stating that public entities must take appropriate steps to ensure communications with applicants and participants with disabilities are as effective as communications with others and must provide appropriate auxiliary aids/services where necessary for equal participation.

For Title II entities, the regulation requires primary consideration to the individual's requested auxiliary aid or service. It does not mean every requested method must always be provided; the legal limitations and effective-alternative analysis remain relevant.

### DVR denial / response rule

WAC 388-891A-0211 is safe to use as follows:

- if a DVR counselor **makes a decision to deny** a request for reasonable accommodation or another request affecting participation, the counselor responds orally and in writing within ten working days of receiving the request;
- the written response provides reasons and appeal rights, or explains additional time and what supplemental information is needed.

Do not convert this into a universal promise that every accommodation request must be finally decided within ten working days.

The DVR manual separately states that DVR follows the response timeframe in WAC 388-891A-0211 for accommodation requests. The tool should label that as **agency policy**, not rewrite it as a broader statutory deadline.

## Current DVR destinations

### Effective communication / auxiliary aid or service

Current public DVR guidance:
`dvr.languageaccess@dshs.wa.gov`

### Accommodation or modification of policies/procedures

Current public DVR guidance:
`dvradacoordinator@dshs.wa.gov`

A participant may also send or copy their DVR counselor. The tool should not imply that sending only to the counselor is the sole official route.

## OAH-specific route

If the participant says the accommodation concerns an OAH proceeding, the builder should route to the Washington Office of Administrative Hearings accommodation process:

- online Accommodation Request: https://oah.wa.gov/resources/forms/accommodation-request
- phone: 360-407-2700 or 800-583-8271
- ADA Coordinator: OAH_ADACoordinator@oah.wa.gov

OAH's public guidance asks participants to describe what accommodation is needed and why/how disability affects participation. The DVR Signal tool should not conflate OAH and DVR accommodation processes.

## What the builder must not do

- decide that a participant is legally entitled to a particular accommodation;
- guarantee approval;
- require unnecessary diagnosis details;
- diagnose disability;
- send the request automatically;
- tell the user that every request has a universal ten-working-day approval deadline;
- route an OAH accommodation request to DVR as though DVR controls OAH;
- turn a denial into an automatic finding of discrimination.

## Safe draft structure

```
BARRIER
↓
REQUESTED CHANGE / AID / SERVICE
↓
HOW IT SUPPORTS PARTICIPATION
↓
PREFERRED COMMUNICATION
↓
OPTIONAL DISABILITY-RELATED CONTEXT
```

The generated text should be editable and local-only.

## Sources reviewed

- 28 CFR 35.130(b)(7)(i), eCFR live text checked 2026-09-27:
  https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-B/section-35.130
- 28 CFR 35.160, eCFR live text checked 2026-09-27:
  https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-E/section-35.160
- 34 CFR 361.51(c) and 361.52, supplied snapshot current through 2026-09-24.
- WAC 388-891A-0211, current Washington Code Reviser text checked 2026-09-27:
  https://app.leg.wa.gov/wac/default.aspx?cite=388-891A-0211
- DVR Customer Services Manual, current DSHS-hosted PDF checked 2026-09-27, accommodation section:
  https://www.dshs.wa.gov/sites/default/files/dvr/documents/CustomerServicesManual.pdf
- DVR Resolving Concerns, current public contact guidance checked 2026-09-27:
  https://www.dshs.wa.gov/administrations-and-offices/division-vocational-rehabilitation/services-people-disabilities/resolving-concerns
- Washington OAH Accommodation Request and Equal Access pages checked 2026-09-27:
  https://oah.wa.gov/resources/forms/accommodation-request
  https://oah.wa.gov/resources/accessibility/equal-access-nondiscrimination

## Maintainer approval gate

This review records source findings and proposed tool scope only. It does **not** activate accommodation legal outputs. The maintainer must approve this review before the tool can be marked active.
