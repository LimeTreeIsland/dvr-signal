# V1B-04 Written Decision + Deadline Checker source and scope review

Status: source review complete; participant-facing deadline calculations remain disabled pending maintainer approval.

Reviewed: 2026-09-27  
Jurisdiction: Washington State DVR / DSHS / OAH  
Scope: DVR written denial-response requirements, fair-hearing filing deadline, hearing timing, written hearing decision timing, and safe date calculation.

## Source hierarchy

This review separates:

1. **Washington DVR rule — written denial response**
   - WAC 388-891A-0211.
2. **Washington DVR appeal rules**
   - WAC 388-891A-0215, -0250, -0255, -0260, -0265, -0270, -0275, and -0295.
3. **Washington DSHS hearing-time calculation**
   - WAC 388-02-0010 and 388-02-0035.
4. **Washington legal holidays**
   - RCW 1.16.050.
5. **Federal VR due process**
   - 34 CFR 361.57.
6. **Current operational guidance**
   - DVR Resolving Concerns and Washington OAH filing pages.

## Written response when DVR denies a request

WAC 388-891A-0211 applies when a DVR counselor makes a decision to deny:

- a VR service request;
- a reasonable-accommodation request; or
- another request affecting participation in VR program services.

For a covered denial, the counselor responds orally and in writing within ten working days of receiving the request.

The written response must provide either:

- the reason(s) for denial and appeal rights; or
- if additional time is needed to gather supplemental information, an explanation of the additional time needed and what supplemental information is needed.

### Safe checker treatment

The checker may ask:

- what was requested;
- whether DVR received the request;
- the date DVR received it, if known;
- whether DVR denied it;
- whether a written response was received;
- whether the response contains reasons and appeal rights, or instead explains additional time and supplemental information needed.

The tool may state the ten-working-day rule textually.

### Exact ten-working-day calculation remains disabled

Chapter 388-891A uses the term "working days" but does not define that term in WAC 388-891A-0010. WAC 388-02-0035 governs hearing-process deadlines, not necessarily the pre-hearing counselor-response clock in WAC 388-891A-0211.

Therefore DVR Signal should **not** silently import the chapter 388-02 counting method into the ten-working-day counselor-response rule. Exact calendar calculation for WAC 388-891A-0211 remains disabled pending a clearer source basis.

## Fair-hearing filing deadline

WAC 388-891A-0255(2) states that a participant must submit a fair-hearing request within **45 calendar days of the date the DVR counselor issues the decision**.

This is a participant filing deadline and has a sufficiently clear trigger when the decision issue date is known.

### Counting rule

WAC 388-02-0035 governs hearing-process deadline calculation:

- exclude the day of the action, notice, or order;
- for periods over seven days, count every day, including Saturdays, Sundays, and legal holidays;
- if the last day is a Saturday, Sunday, or legal holiday, move the deadline to the next business day;
- the deadline ends at 5:00 p.m. on the last day.

RCW 1.16.050 identifies Washington state legal holidays and their observed dates.

### Safe exact calculation

After maintainer approval, the checker may calculate the 45-calendar-day filing deadline when:

- the user enters the **date DVR issued the decision**; and
- the calculator applies WAC 388-02-0035 and RCW 1.16.050.

The output must display:

- the decision issue date entered by the participant;
- the unadjusted 45th calendar day;
- any weekend/legal-holiday adjustment;
- the resulting 5:00 p.m. filing deadline;
- the source citations and last-reviewed date;
- a warning that an inaccurate issue date produces an inaccurate deadline.

If the participant knows only when they **received** the decision, the tool must not substitute the receipt date for the issue date. It should mark the exact filing deadline as unavailable until the issue date is known.

## Current fair-hearing filing route

WAC 388-891A-0255 requires a written request to the Office of Administrative Hearings and specifies required information.

Current OAH guidance identifies Vocational Rehabilitation (DVR) as eligible for the Public Assistance online hearing-request form:

https://oah.wa.gov/resources/forms/hearing-request-public-assistance-form

Current OAH guidance also states that material submitted after 5:00 p.m. Pacific Time is not considered filed until the following business day.

The DVR Resolving Concerns page states that a DVR fair hearing may be requested through OAH and currently lists OAH phone assistance at 800-583-8271.

## Other appeal timing that should be shown textually

### Hearing timing

WAC 388-891A-0260 states that OAH holds the fair hearing within 60 days after receipt of the written hearing request unless the participant or DVR asks for a later hearing date and OAH finds reasonable cause for delay.

34 CFR 361.57(e)(1) similarly requires the hearing within 60 days of the request for review unless informal resolution or mediation resolves the dispute or the parties agree to a specific extension.

This is not a participant filing deadline. The checker should initially show it as an expected procedural timeframe rather than a hard user deadline.

### Written hearing decision

WAC 388-891A-0270 states that OAH sends a written findings-and-decision report within 30 days of the fair hearing. 34 CFR 361.57(e)(3)(ii) likewise requires a full written report within 30 days after completion of the hearing.

This is an agency/OAH action timeframe, not a participant filing deadline.

## Mediation and fair hearing are distinct

WAC 388-891A-0215 and -0230 allow a participant to seek mediation and a fair hearing, including at the same time. Mediation must not be used to deny or delay the right to a fair hearing.

The checker must not imply that requesting mediation automatically pauses or extends the 45-day fair-hearing filing deadline.

## Continuation of agreed services

WAC 388-891A-0295 states that DVR must not suspend, reduce, or terminate agreed-upon services after a fair hearing is requested unless DVR provides evidence of false information, fraud, or other criminal acts related to receipt of VR services.

34 CFR 361.57(b)(4) contains a related federal continuation-of-services protection with stated exceptions.

The checker may surface this as a separate informational safeguard but must not automatically decide whether a disputed service is an "agreed upon service" in a particular case.

## What the checker must not do

- calculate the WAC 388-891A-0211 ten-working-day clock until its counting rule is separately approved;
- use the date the participant received a DVR decision as a substitute for the date DVR issued it;
- promise that mediation tolls or extends the fair-hearing filing deadline;
- describe the 60-day hearing timeframe as a participant filing deadline;
- describe the 30-day written-hearing-decision timeframe as a participant filing deadline;
- predict whether an appeal will succeed;
- treat a missing written response as an automatic adjudicated legal violation;
- automatically submit a hearing request.

## Proposed tool states

| Situation | Output |
| --- | --- |
| Covered DVR request denied; written response missing | Explain WAC 388-891A-0211 and generate editable request for written reasons/appeal rights |
| Written denial received; decision issue date known | Calculate 45-day fair-hearing filing deadline after approval |
| Decision issue date unknown | Show deadline calculation unavailable; ask user to locate the issue date |
| Participant wants hearing | Show OAH filing route and editable hearing-request summary |
| Participant wants mediation | Explain mediation is voluntary and does not deny/delay hearing rights |
| Hearing already requested | Show 60-day hearing timeframe, 30-day written-decision timeframe, and continuation-of-services safeguard with exceptions |

## Sources reviewed

- WAC 388-891A-0211, -0215, -0230, -0250, -0255, -0260, -0265, -0270, -0275, -0295; Washington Code Reviser live text checked 2026-09-27.
- WAC 388-02-0010 and -0035; Washington Code Reviser live text checked 2026-09-27.
- RCW 1.16.050; Washington Code Reviser live text checked 2026-09-27.
- 34 CFR 361.57; eCFR live text checked 2026-09-27, displaying Title 34 current through 2026-09-24.
- DVR Resolving Concerns; DSHS public guidance checked 2026-09-27.
- Washington OAH How to File an Appeal and Public Assistance Hearing Request form; checked 2026-09-27.

## Maintainer approval gate

This review records source findings and proposed tool scope only. It does **not** activate deadline calculations or participant-facing legal outputs. The maintainer must approve this review before the tool can be marked active.
