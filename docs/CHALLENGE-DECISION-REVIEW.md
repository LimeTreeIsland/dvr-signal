# V1B-05 Challenge a DVR Decision source and scope review

Status: source review complete; participant-facing challenge-route outputs remain disabled pending maintainer approval.

Reviewed: 2026-09-27  
Jurisdiction: Washington State DVR / DSHS / OAH  
Scope: organizing dispute-resolution routes when a participant disagrees with a DVR decision or has a related concern.

## Core legal rule: more than one route may be used

WAC 388-891A-0215 provides that when a DVR counselor makes a decision affecting VR services that an applicant or recipient disagrees with, the participant may try to resolve the disagreement through one or more of the following:

- assistance from CAP, the DVR counselor, VR supervisor, or DVR director/designee;
- mediation; and
- a fair hearing.

The same rule allows a participant to request mediation or a fair hearing while continuing to work informally with DVR. If the disagreement is resolved before the scheduled mediation or hearing, the participant may withdraw the request.

This means the tool must **not** present the routes as mutually exclusive or force the participant to exhaust an informal route before preserving a hearing right.

## Federal due-process baseline

34 CFR 361.57(a) requires a timely review process for an applicant or recipient dissatisfied with a State-unit determination affecting the provision of VR services.

34 CFR 361.57(b) requires notice of:

- the right to an impartial due-process hearing;
- the right to pursue mediation;
- where requests may be filed;
- how the mediator/hearing officer is selected; and
- CAP availability.

The federal rule also allows representation by counsel or another advocate selected by the participant.

34 CFR 361.57(c) permits informal dispute resolution, but an informal process may not be used to deny the hearing right, mediation right, or other Part 361 rights.

34 CFR 361.57(d) makes mediation voluntary and prohibits using mediation to deny or delay the impartial-hearing right.

## Washington route 1: informal DVR assistance / case review

### Legal basis

WAC 388-891A-0215(1)(a) expressly permits assistance from:

- CAP;
- the DVR counselor;
- VR supervisor; or
- DVR director or designee.

### Current agency guidance

DVR's current "Resolving Concerns" page additionally describes a **case review** route and lists the counselor, supervisor, Regional Administrator, or Fair Hearing and Constituent Affairs Administrator as contacts.

The public page currently lists the Fair Hearing and Constituent Affairs Administrator phone number as:

`1-800-637-5627`

"Case review" and the specific contact chain on that page should be labeled **current agency guidance**, not a separate statutory appeal right.

The tool must not say that a case review pauses or extends the fair-hearing filing deadline.

## Washington route 2: Client Assistance Program (CAP)

WAC 388-891A-0220 states that CAP is independent of DVR, offers information and advocacy regarding DVR rights, and may assist a participant in resolving disagreements. CAP may attempt informal resolution and may represent a participant in mediation or a fair hearing.

The rule states that CAP services are available at no cost.

Current WAC contact information:

- call/text: `206-849-2939`
- website: `www.washingtoncap.org`

Current DVR public guidance also lists:

- email: `washingtoncap2@gmail.com`

The email is treated as **current agency contact guidance**, while the phone/website are also embedded in the WAC.

The tool should never imply CAP is part of DVR.

## Washington route 3: mediation

WAC 388-891A-0225 and -0230 establish that:

- mediation uses a trained mediator who does not work for DVR;
- the mediator does not decide the case;
- participation is voluntary;
- mediation may be requested when a participant disagrees with a DVR decision affecting VR services;
- DVR may not use mediation to deny or delay the fair-hearing right; and
- mediation and a fair hearing may be requested at the same time.

34 CFR 361.57(d) independently requires mediation to be voluntary and not used to deny or delay the hearing right.

The tool must not claim that merely requesting mediation pauses, tolls, or extends the 45-day fair-hearing filing period.

## Washington route 4: fair hearing

WAC 388-891A-0250 describes a fair hearing as a review conducted by an administrative law judge with OAH under the Washington APA and chapter 388-02 WAC.

WAC 388-891A-0255 requires a written hearing request to OAH containing:

- participant name, address, and telephone number;
- the DSHS program involved;
- a statement describing the decision and reasons for disagreement; and
- other information/documents relating to the matter.

The request must be submitted within 45 calendar days of the date the DVR counselor issues the challenged decision.

The Challenge tool should **not duplicate deadline arithmetic**. It should hand off deadline checking to the separate Written Decision + Deadline Checker.

Current OAH filing route should be treated as operational guidance and remain separately refreshable.

## General complaints are not identical to a fair-hearing challenge

Current DVR guidance says fair hearings are for specific issues such as approval, denial, eligibility, changes, or termination of services and are not for general complaints about DVR or staff.

The same public guidance provides a complaint path through the DVR Fair Hearing and Constituent Affairs Administrator / DSHS complaint system.

This distinction is current **agency guidance**. The tool may use it to avoid routing a pure staff-conduct/general-service complaint as though it were automatically a fair-hearing issue.

The tool must also allow an "unsure / both" state because a participant may have both a challengeable service decision and a broader complaint.

## Discrimination concerns are a distinct route

The current DVR "Resolving Concerns" page separately provides instructions for filing a discrimination complaint with DSHS Employee Relations.

That route is separate from mediation/fair-hearing review of a DVR service determination.

V1B-05 should display discrimination as a separate route only when the participant identifies discrimination as the concern. It should not decide whether discrimination occurred.

Current DSHS public guidance lists:

- phone: `1-800-737-0617 option 5`
- fax: `360-902-7540`
- email: `IRAUComplaints@DSHS.WA.Gov`

These are operational contacts, not legal elements, and should be refreshable without changing the legal rule model.

## Exception-to-rule requests are different from appeals

DVR's current public guidance also describes requesting an exception to rule through a counselor or supervisor.

An exception request is not the same as challenging a denial through mediation/fair hearing. V1B-05 may identify this as a separate option when the participant's issue is that a DVR rule itself is the barrier, but it must not imply an exception request preserves or replaces appeal rights.

The specific exception-to-rule legal logic should remain outside V1B-05 unless separately reviewed.

## Safe tool questions

The builder should ask:

1. What kind of problem are you trying to address?
   - a specific DVR service/eligibility/IPE/closure decision;
   - a general complaint about staff, communication, or process;
   - possible discrimination;
   - a rule itself appears to block the requested action;
   - unsure / more than one.

2. Do you already have a written DVR decision?
   - yes;
   - no;
   - unsure.

3. What outcome are you seeking?
   - written explanation / reconsideration by DVR;
   - advocacy help;
   - mediation;
   - fair hearing;
   - complaint review;
   - unsure / compare routes.

4. Optional:
   - brief description of the decision/concern;
   - issue date if known;
   - whether a hearing has already been requested.

The tool should not require a participant to choose only one lawful route.

## Safe output model

For each applicable route, show:

- **What it is**
- **What it can address**
- **What it does not automatically do**
- **Current contact / filing route**
- **Source type**: regulation vs agency guidance
- **Time-sensitive warning** where relevant
- **Editable draft** only when useful

Suggested route cards:

- Informal DVR assistance / case review
- CAP
- Mediation
- Fair hearing
- General complaint
- Discrimination complaint
- Unsure / preserve options

## Time-sensitive safeguard

Whenever a participant indicates a specific DVR service decision, the tool should display:

> Informal resolution, CAP assistance, case review, or mediation should not be assumed to extend the fair-hearing filing period. If you may want a fair hearing, check the issue date and filing deadline separately.

This is intentionally conservative and avoids unsupported tolling claims.

## What the tool must not do

- rank the routes or tell the participant which political/legal choice to make;
- predict hearing success;
- say CAP, case review, mediation, or complaint filing automatically extends the fair-hearing deadline;
- require informal resolution before a fair hearing;
- treat CAP as part of DVR;
- treat a general staff complaint as automatically within fair-hearing jurisdiction;
- decide that discrimination occurred;
- claim that an exception-to-rule request replaces appeal rights;
- submit anything automatically;
- merge operational contact guidance into immutable legal-rule data.

## Sources reviewed

- WAC 388-891A-0215, -0220, -0225, -0230, -0250, -0255; current Washington Code Reviser text checked 2026-09-27.
- 34 CFR 361.57(a)-(e); eCFR live text checked 2026-09-27, displaying Title 34 current through 2026-09-24.
- Current WAC 388-891A PDF supplied to the project, including the same challenge-route provisions.
- DVR "Resolving Concerns" page; current DSHS public guidance checked 2026-09-27.
- Chapter 388-02 WAC current primary-source PDF supplied to the project, used only for hearing-process context; specific DVR program rules control where more specific.

## Maintainer approval gate

This review records source findings and proposed tool scope only. It does **not** activate participant-facing challenge-route legal outputs. The maintainer must explicitly approve this review before V1B-05 can be marked active.
