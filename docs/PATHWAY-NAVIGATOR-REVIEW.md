# V1B-06 Pathway Navigator source and scope review

Status: source review complete; participant-facing pathway outputs remain disabled pending maintainer approval.

Reviewed: 2026-09-27  
Jurisdiction: Washington State DVR  
Scope: identify the participant's current VR stage, show the healthy-process reference for that stage, preserve important branches/unknowns, and generate source-based questions without adjudicating violations.

## Design principle

The VR process is not a single rigid line.

The Navigator uses the explanatory spine:

**application → eligibility → assessment / VR-needs development → IPE → services → employment → closure**

but it must preserve branches including:

- referral before application;
- trial work experience;
- order of selection / waiting list;
- additional assessment before or after IPE;
- annual IPE review and amendments;
- dispute-resolution activity;
- post-employment services;
- different closure reasons.

The tool must not infer that a case is unlawful merely because the participant's experience differs from the simplified sequence.

## Stage 1 — application

### Washington rule

WAC 388-891A-0410 states that the application requirements are completed when the individual:

- provides information needed to begin assessment of eligibility and priority;
- is available to participate in necessary assessment services; and
- signs a DVR application form or otherwise provides a written request containing the required identifying/contact information and date.

### Federal rule

34 CFR 361.41 distinguishes **referrals** from **applications**.

A referral requires prompt and equitable handling and good-faith efforts to inform the person of application requirements and gather information needed to begin the eligibility/priority assessment.

Under 34 CFR 361.41(b)(2), an application exists when the person or representative has requested VR services through an accepted application/request mechanism, supplied information necessary to initiate the eligibility/priority assessment, and is available to complete the assessment process.

### Safe Navigator output

The tool may ask:

- Have you signed an application or otherwise made a written request for VR services?
- Did DVR receive enough information to begin eligibility assessment?
- Are you available to complete the eligibility assessment?

If the user only reports a referral, inquiry, orientation, or first contact, the tool should not automatically classify that as a completed application.

## Stage 2 — eligibility

WAC 388-891A-0510 states that DVR makes an eligibility determination as soon as enough information is available, but no longer than 60 days after receiving completed application materials, subject to the rule's extension/trial-work provisions.

34 CFR 361.41(b)(1) similarly requires the eligibility determination within 60 days of application unless:

- exceptional and unforeseen circumstances beyond DVR's control prevent a decision and DVR and the individual agree to a specific extension; or
- exploration of abilities/capabilities/capacity to perform in work situations is carried out under § 361.42(e).

34 CFR 361.42 supplies the eligibility-assessment framework and states that eligibility decisions should be based on existing data where possible, with additional assessment when necessary.

### Navigator treatment

The tool may state the 60-day framework textually and ask whether:

- eligibility has been determined;
- an extension to a specific date was agreed;
- DVR identified a trial work experience / work-situation exploration; or
- relevant dates are unknown.

V1B-06 should not calculate an exact eligibility due date in its first release. Deadline arithmetic belongs in a reviewed procedural-rule calculator, not in the general pathway tool.

## Stage 3 — vocational assessment / VR-needs development

WAC 388-891A-0900 states that each person determined eligible completes a vocational assessment to identify VR needs. A comprehensive vocational assessment may be completed where more specific information is needed.

34 CFR 361.45(b) requires an assessment for determining VR needs **if appropriate** for each eligible individual (or each eligible individual who can be served under order of selection). Its purpose is to determine the employment outcome and the nature/scope of services to be included in the IPE.

34 CFR 361.45(f) provides that, to the extent possible, the employment outcome and services should be determined from the eligibility/priority data; a comprehensive assessment is used when additional data are necessary.

### Important nonlinearity

The tool must not create a false universal rule that one standalone comprehensive assessment must always be completed before any IPE work can begin.

The safe distinction is:

- Washington requires a vocational assessment to identify VR needs;
- federal law uses existing information to the extent possible and calls for additional comprehensive assessment when needed.

### Navigator questions

- Has DVR identified your employment goal or possible goal?
- Has DVR identified the VR services needed to pursue that goal?
- Has existing information been reviewed?
- Has DVR said additional assessment is needed?
- If additional assessment is pending, what specific question is it intended to answer?

No universal assessment-completion deadline is asserted.

## Stage 4 — IPE development

WAC 388-891A-0916 states that the IPE is developed within 90 days after eligibility, or—when DVR is operating under an order of selection—within 90 days after the case is released from the waiting list for services. The participant and counselor may agree to extend the timeframe to a **specific date**.

34 CFR 361.45(e) likewise requires the IPE as soon as possible and no later than 90 days after eligibility unless the State unit and eligible individual agree to extend the deadline to a specific completion date.

34 CFR 361.45(d) requires the IPE to be written, agreed to/signed by the participant and signed by a qualified DVR counselor, with a copy provided to the participant.

34 CFR 361.46 requires the IPE to contain the employment outcome, specific needed services, service-initiation and outcome timelines, providers/procurement methods, progress criteria, and applicable responsibilities.

### Navigator treatment

The tool may ask:

- Is there an IPE?
- Is it signed by you and DVR?
- Do you have a copy?
- Does it identify the employment outcome?
- Does it identify specific services and service-initiation timelines?
- Was a specific extension date agreed?
- If order of selection applies, when was the case released from the waiting list?

The tool should not silently use eligibility date as the 90-day trigger if the participant indicates a waiting-list release branch may apply.

## Stage 5 — IPE review / amendment

WAC 388-891A-0950 states that the participant and DVR counselor review the IPE at least once a year, or more often, to assess progress and determine whether an amendment is necessary.

34 CFR 361.45(d)(5) similarly requires review at least annually.

34 CFR 361.45(d)(6)-(7) addresses substantive amendments and requires participant/counselor agreement and signatures before amendments take effect.

### Navigator treatment

For a participant with an existing IPE, the tool may ask:

- When was the IPE last reviewed with you?
- Have the employment outcome, services, or service providers materially changed?
- If so, has an amendment been discussed and signed?

The first release should show "annual review may be due / date unknown" rather than calculating a legal breach classification from incomplete dates.

## Stage 6 — services

34 CFR 361.45(a)(2) requires services to be provided in accordance with the IPE.

34 CFR 361.46(a)(2), (4), and (5) requires the IPE to identify specific services, timelines for service initiation and employment outcome, and providers/procurement methods.

Washington's chapter 388-891A contains service-specific rules and purchasing conditions that vary by service.

### Navigator treatment

There is no universal legal "services must begin within X days" rule for all VR services.

The tool should instead ask:

- What service is written into the IPE?
- What initiation timeline does the IPE state?
- Who is the named provider/entity?
- Has DVR authorized the service where authorization is required?
- Is the issue a delay, denial, provider problem, comparable-benefit issue, or disagreement about the IPE itself?

If a service was denied, hand off to the Written Decision + Deadline Checker / Challenge a DVR Decision tools.

## Stage 7 — employment and successful closure

34 CFR 361.56 permits successful-employment closure only when all required conditions are met, including:

- the IPE employment outcome has been achieved;
- the outcome has been maintained for an appropriate period, not less than 90 days;
- the participant and counselor consider the outcome satisfactory and agree the participant is performing well; and
- the participant has been informed of post-employment services.

Employment alone is therefore not equivalent to successful closure.

## Stage 8 — closure / other closure routes

WAC 388-891A-1320 requires that before closure the participant have an opportunity to discuss the decision with a DVR counselor. DVR provides notice of the reason for closure and information about appeal rights and CAP.

Different closure types have different legal prerequisites. The Navigator must ask what kind of closure occurred or preserve "unknown" rather than applying the successful-employment closure test to every closed case.

## Cross-cutting branch — disagreement / denial

If a participant reports a service denial, closure disagreement, eligibility denial, or other determination affecting VR services, the Navigator should hand off to:

- Written Decision + Deadline Checker; and/or
- Challenge a DVR Decision.

It must not recreate their legal-routing or deadline calculations.

## Cross-cutting branch — accommodation / communication

If the participant identifies a disability-related participation or communication barrier, hand off to the Accommodation Builder.

## Cross-cutting branch — records / missing documentation

If the participant cannot tell what stage they are in because key records are missing, hand off to the Records Router.

## Safe status vocabulary

The Navigator should use:

- **Healthy/reference** — the source-based expected function for the stage;
- **Needs information** — a required fact/date/document is unknown;
- **Needs review** — the participant reports something that differs from the reference and may warrant closer review;
- **Route to another tool** — a more specific reviewed workflow applies.

The Navigator must not label a participant's case "illegal," "violating," "abusive," or "noncompliant" from the questionnaire alone.

## What the Navigator must not do

- force every case into a perfectly linear sequence;
- treat referral as automatically equivalent to application;
- calculate eligibility or IPE deadlines in V1B-06;
- invent a universal deadline for completing vocational assessment;
- assume a comprehensive assessment is mandatory in every case;
- ignore order-of-selection/waiting-list branches;
- infer successful closure merely because employment occurred;
- apply the successful-employment closure test to every closure type;
- duplicate appeal/deadline/accommodation/records logic maintained by the other four tools;
- automatically classify a deviation as unlawful conduct.

## Sources reviewed

### Washington regulations, live checked 2026-09-27

- WAC 388-891A-0410
- WAC 388-891A-0510
- WAC 388-891A-0900
- WAC 388-891A-0916
- WAC 388-891A-0950
- WAC 388-891A-1320

### Federal regulations, live checked 2026-09-27

- 34 CFR 361.41
- 34 CFR 361.42
- 34 CFR 361.45
- 34 CFR 361.46
- 34 CFR 361.56

The eCFR displayed Title 34 as current through 2026-09-24.

## Maintainer approval gate

This review records stage logic and safe question/output boundaries only. It does **not** activate participant-facing Navigator outputs. The maintainer must explicitly approve the V1B-06 review before the tool can be marked active.
