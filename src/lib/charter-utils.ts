import type { GRPIData, TeamCharterData } from "./types";

export function buildInitialCharter(grpi: GRPIData): TeamCharterData {
  const { goals, processes, norms } = grpi;
  return {
    purpose: goals.primaryGoal,
    successCriteria: [...goals.successCriteria],
    constraints: [...goals.constraints],
    communicationNorms: `Primary channel: ${processes.communicationChannel}. Response within ${norms.responseTime}.`,
    meetingNorms: `We meet ${processes.meetingCadence}. Meetings are called only when necessary and kept short.`,
    feedbackNorms: `Feedback style: ${processes.feedbackStyle}. We give feedback as we go.`,
    conflictResolution: norms.conflictResolution,
    customNorms: [...norms.customNorms],
    aiPolicy: processes.aiPolicy,
  };
}

export function buildCharterPlainText(
  grpi: GRPIData,
  charter: TeamCharterData,
): string {
  const successCriteria =
    charter.successCriteria ?? grpi.goals.successCriteria ?? [];
  const constraints = charter.constraints ?? grpi.goals.constraints ?? [];
  const customNorms = charter.customNorms ?? grpi.norms.customNorms ?? [];

  return `TEAM CHARTER
${grpi.goals.projectName}
${grpi.roles.map((r) => r.name).join(", ")}

PURPOSE
${charter.purpose ?? grpi.goals.primaryGoal ?? ""}

SUCCESS CRITERIA
${successCriteria.map((s) => `→ ${s}`).join("\n")}

CONSTRAINTS
${constraints.map((s) => `→ ${s}`).join("\n")}

WAYS OF WORKING
Communication: ${charter.communicationNorms ?? ""}
Meetings: ${charter.meetingNorms ?? ""}
Feedback: ${charter.feedbackNorms ?? ""}
Conflict: ${charter.conflictResolution ?? ""}

TEAM NORMS
${customNorms.map((s) => `→ ${s}`).join("\n")}

AI USE POLICY
${charter.aiPolicy ?? grpi.processes.aiPolicy ?? ""}
`;
}
