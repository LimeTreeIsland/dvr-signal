# V1B-01 Records law and destination review

Status: source review complete; executable legal outputs remain disabled pending maintainer approval.

Reviewed: 2026-09-27  
Jurisdiction: Washington State DVR / DSHS  
Scope: participant access to their own DVR case-service record, Public Records Act requests for agency records, correction of inaccurate case-record information, and safe timing language.

## Source hierarchy

This review separates:

1. **Federal regulation** — 34 CFR 361.38(c)(1)-(4).
2. **Washington regulation** — WAC 388-891A-0120 and 388-891A-0140.
3. **Washington Public Records Act / DSHS public-record rules** — chapter 42.56 RCW and chapter 388-01 WAC.
4. **Agency operational policy** — DVR Customer Services Manual, Chapter 1 records guidance and SOP references.

The DVR Customer Services Manual is operational guidance. It does not replace the governing federal regulation, WAC, or RCW.

## Route A — participant's own DVR case-service record

### Verified rule

A DVR participant may request to review or obtain copies of information in their case-service record by submitting a request to DVR.

Washington's rule states that DVR provides access or copies within **five business days** after receiving the request. If DVR cannot fulfill the request within five business days, DVR must provide written notice explaining why and stating the date access or the requested information will be provided.

Federal regulation independently requires a written request for access to the individual's record of services and requires release in a timely manner.

### Important limitations

DVR may not release some information directly to the participant when:

- DVR determines medical, psychological, or other information may be harmful; the information must instead be provided through a third party chosen by the participant, subject to the court-appointed-representative rule.
- Information came from another agency or service provider and the originating entity imposed release conditions.
- A court-appointed representative exists; release must be made to that representative.

### Destination

The governing WAC says the request is submitted **to DVR**. The reviewed authorities do not establish a single participant-facing central DVR email address for this route.

Safe participant guidance:

- send the request to the participant's DVR counselor or DVR office; and
- keep a dated copy/proof of transmission.

The current DVR Customer Services Manual states that staff must forward certain requests to the DVR Public Records Unit internally, including full-file requests, requests likely to require redaction, review-only requests, closed-case requests, third-party requests, and requests staff are unsure about. That is an internal processing rule and should not be presented as requiring the participant to know which internal unit will process the request.

## Route B — Public Records Act request

Use this route for identifiable DSHS/DVR agency records such as policies, internal correspondence, contracts, administrative records, emails, or other records used to conduct agency business, subject to exemptions.

A request for a participant's own case-service record is distinct from an ordinary PRA request. Mixed requests should be split into the participant-record route and the PRA route so the legal standards remain clear.

### Current DSHS public-record destination

DSHS Public Records Officer  
Office of Information Governance  
P.O. Box 45135  
Olympia, WA 98504-5135  
Telephone: (360) 902-8484  
Fax: (360) 902-7855  
Email: DSHSPublicDisclosure@dshs.wa.gov

DSHS prefers the Request for DSHS Records form, DSHS 17-041, but WAC 388-01-060 permits verbal or written requests and does not make the form mandatory.

### Timing

The PRA's **five-business-day rule is an initial-response deadline, not a production deadline**.

Within five business days, DSHS must take an allowed response action, such as producing records, providing a link, acknowledging the request with a reasonable estimate, seeking clarification, or denying the request in writing.

Do not generate a promised production date from the five-business-day PRA rule.

## Exemptions, redactions, and fees

DSHS records are public unless a law exempts disclosure. WAC 388-01-120 identifies common exemptions, including confidential client information and protected health information.

If only part of a public record is exempt, DSHS may release the nonexempt portion and explain the exemption applied to redacted material. It may deny an entire record where appropriate and must provide the legal basis.

Inspection is free. DSHS may charge authorized copy/custom-service fees. WAC 388-01-080 states that DSHS may waive fees for a client, or an authorized person, receiving the first copy of the client's file; this is a discretionary waiver and should not be presented as a guaranteed free-copy rule.

## Correction of inaccurate or misleading case-record information

WAC 388-891A-0120 and 34 CFR 361.38(c)(4) support a distinct correction workflow.

A participant may ask DVR to correct information they believe is incorrect or misleading.

If DVR agrees, it corrects the information and documents the correction.

If DVR disagrees, Washington's rule requires DVR to:

1. notify the participant that it will not make the change and explain how the participant can provide a written summary of the disputed information;
2. document the decision not to change the record; and
3. place the participant's written summary in the case-service record.

This is not the same workflow as a PRA request.

## Safe router decision model

| User intent | Route |
| --- | --- |
| My own DVR case file / case-service record | Case-service-record request |
| Policies, agency emails, contracts, administrative records | Public Records Act request |
| Both categories | Produce two separate drafts |
| Unsure | Explain the distinction and ask what kinds of records are sought |
| Correct an inaccurate/misleading case-record entry | Case-record correction request |

## Timing outputs safe to activate after maintainer approval

Safe textual timing outputs:

- **Own case-service record:** access/copies within five business days, or written notice explaining delay and giving the access/production date.
- **PRA:** DSHS initial response within five business days; not a five-day production deadline.

Do **not** calculate a calendar due date until a reviewed Washington business-day/holiday counting implementation exists.

## Sources reviewed

- 34 CFR 361.38(c)(1)-(4), supplied snapshot current through 2026-09-24.
- WAC 388-891A-0120, current Washington Code Reviser text checked 2026-09-27:
  https://app.leg.wa.gov/wac/default.aspx?cite=388-891A-0120
- WAC 388-891A-0140, current Washington Code Reviser text checked 2026-09-27:
  https://app.leg.wa.gov/wac/default.aspx?cite=388-891A-0140
- WAC 388-01-030, -060, -080, -090, -100, -110, -120, -170, current Washington Code Reviser text checked 2026-09-27:
  https://app.leg.wa.gov/wac/default.aspx?cite=388-01
- RCW 42.56.520 and 42.56.550, current Washington Code Reviser text checked 2026-09-27:
  https://app.leg.wa.gov/rcw/default.aspx?cite=42.56
- DSHS Request for Records form 17-041, checked 2026-09-27:
  https://www.dshs.wa.gov/sites/default/files/forms/pdf/17-041.pdf
- DSHS public-record contact page, checked 2026-09-27:
  https://www.dshs.wa.gov/contact-department-social-and-health-services
- DVR Customer Services Manual, supplied edition dated 2026-05-29, Chapter 1 records guidance.

## Maintainer approval gate

This review memo records research findings only. It does **not** by itself approve or enable an executable legal rule. Before the Records Router can emit legal routing/timing outputs, the maintainer must explicitly approve the corresponding rule/data changes in a PR or issue.
