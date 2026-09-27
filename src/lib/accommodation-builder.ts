export type AccommodationContext = "dvr" | "oah" | "unsure";
export type AccommodationNeed =
  | "effective_communication"
  | "meeting_participation"
  | "physical_sensory"
  | "processing_language"
  | "policy_procedure"
  | "other";

export interface AccommodationAnswers {
  context: AccommodationContext;
  need: AccommodationNeed;
  barrier: string;
  requestedChange: string;
  participationSupport?: string;
  preferredCommunication?: string;
  disabilityContext?: string;
  docketNumber?: string;
  hearingDate?: string;
}

export interface AccommodationRoute {
  applicability: "applicable" | "needs_information" | "unavailable_pending_review";
  route: "dvr_effective_communication" | "dvr_modification" | "oah_accommodation" | null;
}

export function routeAccommodationRequest(
  answers: AccommodationAnswers,
  toolEnabled: boolean,
): AccommodationRoute {
  if (!toolEnabled) {
    return {
      applicability: "unavailable_pending_review",
      route: null,
    };
  }

  if (answers.context === "unsure") {
    return {
      applicability: "needs_information",
      route: null,
    };
  }

  if (answers.context === "oah") {
    return {
      applicability: "applicable",
      route: "oah_accommodation",
    };
  }

  if (answers.need === "effective_communication") {
    return {
      applicability: "applicable",
      route: "dvr_effective_communication",
    };
  }

  return {
    applicability: "applicable",
    route: "dvr_modification",
  };
}

function optionalLine(label: string, value?: string): string[] {
  const clean = value?.trim();
  return clean ? [`${label}: ${clean}`] : [];
}

export function buildDvrAccommodationDraft(
  answers: AccommodationAnswers,
  communicationRoute: boolean,
): string {
  const subject = communicationRoute
    ? "Subject: Request for effective communication / disability-related accommodation"
    : "Subject: Disability-related accommodation / modification request";

  const sourceSentence = communicationRoute
    ? "I am requesting an auxiliary aid, service, or communication modification to support effective communication and participation in DVR."
    : "I am requesting a disability-related accommodation or modification to support my participation in DVR.";

  return [
    subject,
    "",
    "To Washington DVR:",
    "",
    sourceSentence,
    "",
    `Barrier I experience: ${answers.barrier.trim()}`,
    `Requested change, aid, service, or modification: ${answers.requestedChange.trim()}`,
    ...optionalLine("How this would support my participation", answers.participationSupport),
    ...optionalLine("Preferred communication", answers.preferredCommunication),
    ...optionalLine("Optional disability-related context", answers.disabilityContext),
    "",
    "Please confirm receipt and let me know if you need specific additional information to evaluate this request.",
    "",
    "If DVR makes a decision to deny this request, please provide the oral and written response described in WAC 388-891A-0211, including the reason(s) and appeal rights, or an explanation of any additional time and supplemental information needed.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}

export function buildOahAccommodationDraft(answers: AccommodationAnswers): string {
  return [
    "Subject: Disability accommodation request for OAH participation",
    "",
    "To the Washington Office of Administrative Hearings:",
    "",
    ...optionalLine("Docket number", answers.docketNumber),
    ...optionalLine("Hearing date", answers.hearingDate),
    `Barrier affecting participation: ${answers.barrier.trim()}`,
    `Accommodation requested: ${answers.requestedChange.trim()}`,
    ...optionalLine("How this would support participation", answers.participationSupport),
    ...optionalLine("Preferred communication", answers.preferredCommunication),
    ...optionalLine("Optional disability-related context", answers.disabilityContext),
    "",
    "Please contact me if you need additional information to evaluate this accommodation request.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}
