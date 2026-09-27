export type ChallengeProblemType =
  | "specific_decision"
  | "general_complaint"
  | "discrimination"
  | "rule_barrier"
  | "unsure_or_multiple";

export type ChallengeOutcome =
  | "compare_routes"
  | "written_explanation"
  | "advocacy_help"
  | "mediation"
  | "fair_hearing"
  | "complaint_review";

export interface ChallengeAnswers {
  problemType: ChallengeProblemType;
  writtenDecisionStatus: "yes" | "no" | "unsure";
  desiredOutcome: ChallengeOutcome;
  decisionDescription?: string;
  decisionIssueDate?: string;
  hearingRequestedStatus: "yes" | "no" | "unsure";
}

export type ChallengeRoute =
  | "informal_dvr"
  | "cap"
  | "mediation"
  | "fair_hearing"
  | "general_complaint"
  | "discrimination_complaint"
  | "exception_to_rule_note";

export interface ChallengeResult {
  applicability: "applicable" | "needs_information" | "unavailable_pending_review";
  routes: ChallengeRoute[];
  showDeadlineWarning: boolean;
  showDecisionDateHandoff: boolean;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function routeChallenge(
  answers: ChallengeAnswers,
  toolEnabled: boolean,
): ChallengeResult {
  if (!toolEnabled) {
    return {
      applicability: "unavailable_pending_review",
      routes: [],
      showDeadlineWarning: false,
      showDecisionDateHandoff: false,
    };
  }

  const routes: ChallengeRoute[] = [];
  let showDeadlineWarning = false;

  if (answers.problemType === "specific_decision") {
    routes.push("informal_dvr", "cap", "mediation", "fair_hearing");
    showDeadlineWarning = true;
  } else if (answers.problemType === "general_complaint") {
    routes.push("informal_dvr", "cap", "general_complaint");
  } else if (answers.problemType === "discrimination") {
    routes.push("cap", "discrimination_complaint");
  } else if (answers.problemType === "rule_barrier") {
    routes.push("informal_dvr", "cap", "exception_to_rule_note");
  } else {
    routes.push("informal_dvr", "cap", "general_complaint");
    return {
      applicability: "needs_information",
      routes: unique(routes),
      showDeadlineWarning: true,
      showDecisionDateHandoff: answers.writtenDecisionStatus === "yes",
    };
  }

  if (answers.desiredOutcome === "mediation") routes.push("mediation");
  if (answers.desiredOutcome === "fair_hearing") {
    routes.push("fair_hearing");
    showDeadlineWarning = true;
  }
  if (answers.desiredOutcome === "complaint_review") routes.push("general_complaint");
  if (answers.desiredOutcome === "advocacy_help") routes.push("cap");
  if (answers.desiredOutcome === "written_explanation") routes.push("informal_dvr");

  if (
    answers.writtenDecisionStatus === "yes" &&
    answers.problemType === "specific_decision"
  ) {
    showDeadlineWarning = true;
  }

  return {
    applicability: "applicable",
    routes: unique(routes),
    showDeadlineWarning,
    showDecisionDateHandoff:
      showDeadlineWarning && answers.writtenDecisionStatus === "yes",
  };
}

function optionalLine(label: string, value?: string): string[] {
  const clean = value?.trim();
  return clean ? [`${label}: ${clean}`] : [];
}

export function buildInformalDvrDraft(answers: ChallengeAnswers): string {
  return [
    "Subject: Request to review DVR decision / concern",
    "",
    "To Washington DVR:",
    "",
    ...optionalLine("Decision or concern", answers.decisionDescription),
    ...optionalLine("Decision issue date", answers.decisionIssueDate),
    "",
    "I am asking DVR to review this matter and provide a clear written explanation of the decision, the factual and policy basis for it, and the options available if I continue to disagree.",
    "",
    "I am not withdrawing or waiving any mediation or fair-hearing rights by requesting informal review.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}

export function buildCapDraft(answers: ChallengeAnswers): string {
  return [
    "Subject: Request for CAP information / advocacy regarding Washington DVR",
    "",
    "To the Client Assistance Program:",
    "",
    "I am a Washington DVR applicant or participant seeking information or advocacy concerning a disagreement with DVR.",
    ...optionalLine("Decision or concern", answers.decisionDescription),
    ...optionalLine("Decision issue date", answers.decisionIssueDate),
    "",
    "Please let me know whether CAP can provide information, informal advocacy, or assistance with mediation or a fair hearing concerning this matter.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}

export function buildMediationDraft(answers: ChallengeAnswers): string {
  return [
    "Subject: Request for DVR mediation",
    "",
    "To Washington DVR:",
    "",
    "I am requesting mediation concerning a DVR decision that affects the VR services provided to me.",
    ...optionalLine("Decision or concern", answers.decisionDescription),
    ...optionalLine("Decision issue date", answers.decisionIssueDate),
    "",
    "Please provide the current mediation process and scheduling information. I understand that requesting mediation does not itself extend the fair-hearing filing period.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}

export function buildFairHearingSummary(answers: ChallengeAnswers): string {
  return [
    "DVR fair-hearing request summary",
    "",
    ...optionalLine("DVR decision issue date", answers.decisionIssueDate),
    ...optionalLine("Decision I disagree with", answers.decisionDescription),
    "",
    "I am requesting a fair hearing concerning this DVR decision.",
    "",
    "Reason(s) I disagree:",
    "[Add your reasons here]",
    "",
    "Contact information:",
    "[Name]",
    "[Address]",
    "[Telephone]",
  ].join("\n");
}

export function buildComplaintDraft(answers: ChallengeAnswers): string {
  return [
    "Subject: DVR concern / complaint review",
    "",
    "To DVR Fair Hearing and Constituent Affairs:",
    "",
    ...optionalLine("Concern", answers.decisionDescription),
    "",
    "I am requesting review of this concern and a written response identifying any corrective action or next steps available.",
    "",
    "If this concern also involves a specific appealable DVR service decision, please do not treat this complaint as a withdrawal or waiver of any separate mediation or fair-hearing rights.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}

export function buildDiscriminationDraft(answers: ChallengeAnswers): string {
  return [
    "Subject: DSHS discrimination complaint concerning DVR participation",
    "",
    "To DSHS Employee Relations:",
    "",
    ...optionalLine("Concern", answers.decisionDescription),
    "",
    "I am submitting this as a discrimination complaint concerning my participation in a DSHS/DVR program or service.",
    "",
    "Please provide the current complaint process and any information needed to evaluate this complaint.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}
