export type NavigatorStage =
  | "application"
  | "eligibility"
  | "assessment"
  | "ipe"
  | "ipe_review"
  | "services"
  | "employment"
  | "closure"
  | "unsure";

export type NavigatorQuestion =
  | "next_step"
  | "delay"
  | "denial_or_disagreement"
  | "missing_records"
  | "access_barrier";

export interface NavigatorAnswers {
  stage: NavigatorStage;
  waitingStatus: "yes" | "no" | "unsure" | "not_applicable";
  mainQuestion: NavigatorQuestion;
}

export interface NavigatorResult {
  applicability: "applicable" | "needs_information" | "unavailable_pending_review";
  stage: NavigatorStage;
  handoffs: Array<"records" | "accommodations" | "decisions" | "challenge">;
}

export function routeNavigator(
  answers: NavigatorAnswers,
  toolEnabled: boolean,
): NavigatorResult {
  if (!toolEnabled) {
    return {
      applicability: "unavailable_pending_review",
      stage: answers.stage,
      handoffs: [],
    };
  }

  const handoffs: NavigatorResult["handoffs"] = [];

  if (answers.mainQuestion === "missing_records") handoffs.push("records");
  if (answers.mainQuestion === "access_barrier") handoffs.push("accommodations");
  if (answers.mainQuestion === "denial_or_disagreement") {
    handoffs.push("decisions", "challenge");
  }

  if (answers.stage === "closure" && answers.mainQuestion === "denial_or_disagreement") {
    if (!handoffs.includes("challenge")) handoffs.push("challenge");
  }

  return {
    applicability: answers.stage === "unsure" ? "needs_information" : "applicable",
    stage: answers.stage,
    handoffs,
  };
}

const stageQuestions: Record<NavigatorStage, string[]> = {
  application: [
    "Please confirm whether DVR considers my application requirements complete.",
    "Please identify the date DVR considers the application complete and any information still needed to begin the eligibility assessment.",
  ],
  eligibility: [
    "Please confirm the current eligibility status and the date DVR considers my completed application materials received.",
    "If eligibility is still pending, please identify whether a specific-date extension or trial-work / work-situation exploration applies.",
  ],
  assessment: [
    "Please identify the vocational rehabilitation needs, employment-outcome questions, and service questions that have already been addressed.",
    "Please identify any additional assessment DVR considers necessary, the specific question it is intended to answer, and what remains before IPE development can be completed.",
  ],
  ipe: [
    "Please confirm the current IPE development status and what remains before the IPE can be completed and signed.",
    "Please identify the eligibility date or, if an order-of-selection waiting-list branch applies, the date my case was released for services.",
    "Please identify any specific IPE extension date that I agreed to.",
  ],
  ipe_review: [
    "Please confirm the date my IPE was last reviewed with me.",
    "Please identify whether changes to the employment outcome, services, or service providers require an IPE amendment.",
  ],
  services: [
    "Please identify the IPE service, its initiation timeline, the responsible provider or entity, and the current authorization/status.",
    "If the service is delayed or not being provided, please identify the reason and what step remains before service can begin.",
  ],
  employment: [
    "Please confirm how my current employment relates to the employment outcome identified in my IPE.",
    "Please identify any remaining VR or post-employment service needs and the status of closure planning.",
  ],
  closure: [
    "Please identify the specific closure reason/type and the source supporting that closure decision.",
    "Please confirm what opportunity I had to discuss closure and provide the closure notice, appeal-rights information, and CAP information.",
  ],
  unsure: [
    "Please confirm what DVR stage my case is currently in and identify the document or decision that establishes that stage.",
    "Please identify the next expected action, who is responsible for it, and any information or decision still needed.",
  ],
};

export function buildNavigatorQuestions(stage: NavigatorStage): string {
  return [
    "Subject: Request for written DVR case-stage clarification",
    "",
    "To Washington DVR:",
    "",
    "I am trying to understand my current stage in the vocational rehabilitation process and the next action needed.",
    "",
    ...stageQuestions[stage].map((question, index) => `${index + 1}. ${question}`),
    "",
    "Please respond in writing so I can accurately understand the current status and next steps.",
    "",
    "Thank you,",
    "[Your name]",
  ].join("\n");
}
