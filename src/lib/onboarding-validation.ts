import type {
  TeamGoals,
  TeamMember,
  TeamNorms,
  TeamProcesses,
} from "./types";

export function isGoalsValid(goals?: Partial<TeamGoals>): goals is TeamGoals {
  if (!goals) return false;
  return (
    !!goals.projectName?.trim() &&
    !!goals.projectTemplate &&
    !!goals.deadline &&
    !!goals.primaryGoal?.trim() &&
    (goals.successCriteria?.length ?? 0) > 0 &&
    (goals.constraints?.length ?? 0) > 0
  );
}

export function isRolesValid(roles?: TeamMember[]): boolean {
  if (!roles?.length) return false;
  return roles.every(
    (m) =>
      m.name.trim() &&
      m.role.trim() &&
      m.responsibilities.some((r) => r.trim()) &&
      m.scrumRole,
  );
}

export function isProcessesValid(
  processes?: Partial<TeamProcesses>,
): processes is TeamProcesses {
  if (!processes) return false;
  return (
    !!processes.communicationChannel?.trim() &&
    !!processes.meetingCadence &&
    !!processes.decisionMaking?.trim() &&
    !!processes.fileStorage?.trim() &&
    !!processes.feedbackStyle &&
    !!processes.aiPolicy?.trim()
  );
}

export function isNormsValid(norms?: Partial<TeamNorms>): norms is TeamNorms {
  if (!norms) return false;
  return (
    !!norms.responseTime?.trim() &&
    !!norms.workingHours?.trim() &&
    !!norms.conflictResolution?.trim() &&
    !!norms.commitmentLevel?.trim()
  );
}

export function isStepComplete(
  stepIndex: number,
  grpi: {
    goals?: Partial<TeamGoals>;
    roles?: TeamMember[];
    processes?: Partial<TeamProcesses>;
    norms?: Partial<TeamNorms>;
  },
): boolean {
  switch (stepIndex) {
    case 0:
      return isGoalsValid(grpi.goals);
    case 1:
      return isRolesValid(grpi.roles);
    case 2:
      return isProcessesValid(grpi.processes);
    case 3:
      return isNormsValid(grpi.norms);
    default:
      return false;
  }
}

export function validateGoalsField(
  field: keyof TeamGoals,
  goals: Partial<TeamGoals>,
): string | undefined {
  switch (field) {
    case "projectName":
      return goals.projectName?.trim() ? undefined : "Project name is required";
    case "projectTemplate":
      return goals.projectTemplate ? undefined : "Select a project template";
    case "deadline":
      return goals.deadline ? undefined : "Deadline is required";
    case "primaryGoal":
      return goals.primaryGoal?.trim()
        ? undefined
        : "Primary goal is required";
    case "successCriteria":
      return (goals.successCriteria?.length ?? 0) > 0
        ? undefined
        : "Add at least one success criterion";
    case "constraints":
      return (goals.constraints?.length ?? 0) > 0
        ? undefined
        : "Add at least one constraint";
    default:
      return undefined;
  }
}
