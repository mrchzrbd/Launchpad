import type { GRPIData } from "./types";

/**
 * Validates that all GRPI sections are present and returns a complete GRPIData object.
 * Called when onboarding is finished to finalize the team framework.
 */
export function finalizeGRPI(partial: Partial<GRPIData>): GRPIData | null {
  const { goals, roles, processes, norms } = partial;

  if (!goals || !roles?.length || !processes || !norms) {
    return null;
  }

  return {
    goals,
    roles,
    processes,
    norms,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Returns a human-readable summary of the GRPI framework for display or export.
 */
export function summarizeGRPI(grpi: GRPIData): string {
  const memberList = grpi.roles
    .map((m) => `${m.name} (${m.role})`)
    .join(", ");

  return [
    `Project: ${grpi.goals.projectName}`,
    `Goal: ${grpi.goals.primaryGoal}`,
    `Team: ${memberList}`,
    `Cadence: ${grpi.processes.meetingCadence}`,
    `Communication: ${grpi.processes.communicationChannel}`,
  ].join("\n");
}
