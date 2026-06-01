import type { GRPIData, WorkspaceData } from "./types";
import { generateWorkspace } from "./workspace-generator";

/**
 * Fills in missing workspace fields without replacing user-edited data.
 */
export function backfillWorkspace(
  existing: WorkspaceData | undefined,
  grpi: GRPIData,
): WorkspaceData {
  const generated = generateWorkspace(grpi);
  if (!existing) return generated;

  return {
    ...existing,
    teamCharter: existing.teamCharter || generated.teamCharter,
    charter: existing.charter ?? generated.charter,
    kanbanColumns: existing.kanbanColumns?.length
      ? existing.kanbanColumns
      : generated.kanbanColumns,
    meetingTemplate: existing.meetingTemplate || generated.meetingTemplate,
    meetingSchedule: existing.meetingSchedule?.length
      ? existing.meetingSchedule
      : generated.meetingSchedule,
    meetings: existing.meetings ?? generated.meetings,
    raciMatrix: existing.raciMatrix?.length
      ? existing.raciMatrix
      : generated.raciMatrix,
    epics: existing.epics?.length ? existing.epics : generated.epics,
    generatedAt: existing.generatedAt || generated.generatedAt,
  };
}

export function workspaceNeedsBackfill(workspace: WorkspaceData | undefined): boolean {
  if (!workspace) return true;
  return (
    !workspace.meetingSchedule?.length ||
    !workspace.raciMatrix?.length ||
    workspace.meetings === undefined ||
    workspace.charter === undefined
  );
}
