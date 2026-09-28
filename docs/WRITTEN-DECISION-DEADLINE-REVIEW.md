# V1B-04 Written Decision + Deadline Checker source and scope review

Status: corrected V1B-04 review approved by the maintainer on 2026-09-27. The Written Decision + Deadline Checker and exact 45-calendar-day fair-hearing filing calculation are approved for activation using the archived WAC 388-02 and RCW 1.16 sources. Exact calculation of the WAC 388-891A-0211 ten-working-day response period remains disabled.

Reviewed: 2026-09-27  
Audit correction: 2026-09-27  
Jurisdiction: Washington State DVR / DSHS / OAH  
Scope: DVR written denial-response requirements, fair-hearing filing deadline, hearing timing, written hearing decision timing, mediation, continuation of services, and safe date calculation.

## Primary audit basis

The correction audit uses the current primary-law files already supplied to the project for:

- WAC 388-891A; and
- 34 CFR Part 361, current through 2026-09-24.

The audit also identified two additional primary sources that must be archived in the repository legal corpus before the exact 45-day calendar calculator may be activated:

- current WAC 388-02 primary-source PDF; and
- current RCW 1.16 primary-source PDF.

Live official text for those provisions has been reviewed, but live verification alone is not treated as equivalent to the repository's primary-source archive requirement.

## 1. Written response when DVR denies a covered request

WAC 388-891A-0211 is **not** a universal ten-working-day response rule for every request made to DVR.

It applies when a DVR counselor **makes a decision to deny**:

- a VR service request;
- a reasonable-accommodation request; or
- another request that affects participation in the VR program.

The rule then measures the response period from DVR's receipt of that request.

The written response must provide either:

- the reason(s) for denial and appeal rights; or
- if additional time is needed to gather supplemental information, an explanation of the additional time needed and the supplemental information needed.

### Machine-rule encoding

```
applies_when: counselor_decides_to_deny_covered_request
clock_start: DVR_receipt_of_request
amount: 10
unit: working_days
```

### Exact ten-working-day calculation remains disabled

Chapter 388-891A uses the term "working days" but does not define a counting convention in WAC 388-891A-0010. Chapter 388-02 governs hearing-process deadlines and is not silently imported into this pre-hearing counselor-response clock.

DVR Signal therefore states this rule textually but does not calculate its exact calendar due date.

## 2. Fair-hearing filing deadline

WAC 388-891A-0255(2) states that a participant must submit a fair-hearing request within **45 calendar days of the date the DVR counselor issues the decision**.

The issue date is the legal trigger. DVR Signal must not substitute the date the participant received the decision.

WAC 388-891A-0250 expressly places DVR fair hearings within the Washington Administrative Procedure Act and chapter 388-02 WAC hearing framework.

### Approved counting rule

Live review of WAC 388-02-0035 supports the following hearing-deadline calculation:

- exclude the day of the action, notice, or order;
- for periods over seven days, count every day, including Saturdays, Sundays, and legal holidays;
- if the final day falls on a Saturday, Sunday, or legal holiday, move the deadline to the next business day;
- the deadline ends at 5:00 p.m. on the last day.

Live review of RCW 1.16.050 identifies the Washington state legal holidays and observed-holiday rules used for that adjustment.

### Source-archive and activation gate

The required current primary-source PDFs are now archived in the repository legal corpus:

1. `sources/primary/wa/WAC-388-02-current.pdf`; and
2. `sources/primary/wa/RCW-1.16-current.pdf`.

The relevant sections were rechecked against the encoded calculator, and the maintainer approved exact 45-calendar-day calculation on 2026-09-27.

The calculator remains fail-closed unless both the tool and the exact-calculation flag are active. The separate WAC 388-891A-0211 ten-working-day calculator remains disabled.

## 3. Sixty-day hearing timeframe

Washington and federal rules should be described separately.

### Washington rule

WAC 388-891A-0260 states that OAH holds a fair hearing within sixty days of receipt of the written hearing request unless:

- the participant or DVR asks for a later hearing date; and
- OAH determines there is reasonable cause for the delay.

### Federal rule

34 CFR 361.57(e)(1) requires the impartial due process hearing within sixty days of the request for review unless:

- informal resolution **resolves the dispute** before day 60;
- a **mediation agreement** resolves the dispute before day 60; or
- the parties agree to a specific extension of time.

Mere participation in mediation is **not** an exception to the federal sixty-day hearing requirement. Section 361.57(d)(2)(ii) separately prohibits using mediation to deny or delay the hearing right.

The machine-readable rule therefore must not use the broader phrase "informal resolution or mediation" as a clock exception.

## 4. Thirty-day written hearing decision

WAC 388-891A-0270 states that OAH sends a written report of findings and decision within thirty days of the fair hearing.

34 CFR 361.57(e)(3)(ii) is more precise about the federal trigger: the full written report is due within thirty days **of completion of the hearing**.

The machine model therefore uses:

```
amount: 30
unit: calendar_days
trigger: completion_of_hearing
```

The tool must not assume the first hearing session is the completion date when a hearing spans multiple sessions.

This is an agency/OAH procedural timeframe, not a participant filing deadline.

## 5. Mediation and the fair-hearing filing deadline

WAC 388-891A-0230 and 34 CFR 361.57(d) support treating mediation as a distinct, voluntary process.

Mediation may be requested at the same time as a fair hearing, and it must not be used to deny or delay the fair-hearing right.

DVR Signal therefore does not claim that requesting or participating in mediation automatically tolls, pauses, or extends the 45-day fair-hearing filing deadline.

## 6. Continuation of services: state and federal protections must remain separate

The Washington and federal provisions are related but materially different. They must not be collapsed into one identical safeguard.

### Washington — WAC 388-891A-0295

Trigger:

- a fair hearing has been requested.

Scope:

- agreed-upon services.

Protection:

- DVR must not suspend, reduce, or terminate those agreed-upon services.

Stated exception:

- DVR provides evidence that the participant provided false information or committed fraud or other criminal acts related to receipt of VR services.

The tool must not automatically decide whether a disputed service is an "agreed-upon service."

### Federal — 34 CFR 361.57(b)(4)

The federal rule protects vocational rehabilitation services **being provided** while specified review processes are pending. It expressly includes:

- evaluation and assessment services; and
- individualized plan for employment development.

The protection applies while:

- resolution through mediation is pending;
- a hearing officer decision is pending;
- a reviewing official decision is pending; or
- informal resolution is pending.

Federal exceptions include:

- the individual or representative requests suspension, reduction, or termination; or
- the State agency has evidence the services were obtained through misrepresentation, fraud, collusion, or criminal conduct.

The UI may show both protections when potentially relevant, but it must label them separately and must not state that their triggers, scope, or exceptions are identical.

## 7. Current OAH filing information

OAH filing information remains classified as current **official guidance**, not statute or regulation.

Current OAH guidance identifies Vocational Rehabilitation (DVR) as eligible for the Public Assistance hearing-request process and states that submissions after 5:00 p.m. Pacific Time are not considered filed until the following business day.

Operational contact/routing data should remain separately refreshable from the legal rules.

## What the checker must not do

- treat every DVR request as subject to WAC 388-891A-0211's ten-working-day rule;
- calculate the WAC 388-891A-0211 ten-working-day clock without a separately approved counting rule;
- activate the 45-day exact date calculator before WAC 388-02 and RCW 1.16 primary-source files are archived and rechecked;
- use the participant's receipt date as a substitute for the DVR decision issue date;
- claim that mere participation in mediation suspends the federal sixty-day hearing clock;
- claim that mediation automatically tolls or extends the 45-day filing deadline;
- treat the 60-day hearing timeframe as a participant filing deadline;
- treat the 30-day written-hearing-decision timeframe as a participant filing deadline;
- collapse the Washington and federal continuation-of-services protections into one rule;
- predict whether an appeal will succeed;
- treat a missing written response as an automatic adjudicated legal violation;
- automatically submit a hearing request.

## Corrected proposed tool states

| Situation | Output |
| --- | --- |
| Counselor has denied a covered DVR request; written response missing | Explain WAC 388-891A-0211 and generate an editable request for written reasons/appeal rights |
| DVR decision issue date known; source archive incomplete | Explain the 45-day rule but withhold exact calculated date |
| DVR decision issue date known; source archive complete and calculator separately approved | Calculate the 45-day filing deadline |
| Decision issue date unknown | Mark exact filing deadline unavailable; ask participant to locate the issue date |
| Participant wants hearing | Show OAH filing route and editable hearing-request summary |
| Participant wants mediation | Explain mediation is voluntary and does not itself suspend the hearing clock or automatically extend the filing deadline |
| Hearing already requested | Show Washington/federal 60-day rules accurately, the 30-day completion-of-hearing rule, and separate state/federal continuation protections |

## Sources reviewed

### Primary files already in project corpus

- Current WAC 388-891A PDF supplied to the project.
- 34 CFR Part 361 PDF current through 2026-09-24 supplied to the project.

### Archived primary sources used for the exact 45-day calculator

- WAC 388-02-0010 and WAC 388-02-0035, archived in `sources/primary/wa/WAC-388-02-current.pdf`.
- RCW 1.16.050, archived in `sources/primary/wa/RCW-1.16-current.pdf`.

### Official operational guidance

- DVR Resolving Concerns.
- Washington OAH How to File an Appeal.
- Washington OAH Public Assistance Hearing Request.

## Maintainer approval

The maintainer approved the corrected V1B-04 review and structured rule model on 2026-09-27.

The approval expressly authorizes:

1. activation of the Written Decision + Deadline Checker;
2. exact calculation of the 45-calendar-day fair-hearing filing deadline using the archived WAC 388-02 and RCW 1.16 primary sources; and
3. continued disabling of exact calculation for the WAC 388-891A-0211 ten-working-day response period.

The source-archive requirement is satisfied. The ten-working-day calculation remains fail-closed until separately reviewed and approved.
