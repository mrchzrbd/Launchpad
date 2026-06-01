"use client";

import { useCallback, useEffect, useState } from "react";
import { KanbanBoard } from "@/components/workspace/KanbanBoard";
import { MeetingCadence } from "@/components/workspace/MeetingCadence";
import { TeamCharter } from "@/components/workspace/TeamCharter";
import { TeamRoster } from "@/components/workspace/TeamRoster";
import { WorkspaceEmptyState } from "@/components/workspace/WorkspaceEmptyState";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { useDemoMode } from "@/lib/demo-mode";
import { finalizeGRPI } from "@/lib/grpi-generator";
import { useLaunchpad } from "@/lib/store";
import type { WorkspaceData } from "@/lib/types";
import { backfillWorkspace, workspaceNeedsBackfill } from "@/lib/workspace-backfill";
import { cn } from "@/lib/utils";

export type WorkspaceTabId = "kanban" | "charter" | "meeting" | "roles";

const TAB_CLASS =
  "px-5 py-3.5 font-body text-sm font-medium border-b-2 transition-all whitespace-nowrap min-h-[44px]";

export default function WorkspacePageClient() {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>("kanban");
  const { state, isHydrated, hasCompletedSetup, updateWorkspace } = useLaunchpad();
  const { workspaceTourTab, setWorkspaceTourTab } = useDemoMode();

  useEffect(() => {
    if (workspaceTourTab) {
      setActiveTab(workspaceTourTab);
      setWorkspaceTourTab(null);
    }
  }, [workspaceTourTab, setWorkspaceTourTab]);

  useEffect(() => {
    if (!isHydrated || !hasCompletedSetup) return;
    const finalized = finalizeGRPI(state.grpi);
    if (!finalized) return;

    if (workspaceNeedsBackfill(state.workspace)) {
      updateWorkspace(backfillWorkspace(state.workspace, finalized));
    }
  }, [isHydrated, hasCompletedSetup, state.workspace, state.grpi, updateWorkspace]);

  const grpi = finalizeGRPI(state.grpi);
  const workspace = state.workspace;

  const handleUpdateWorkspace = useCallback(
    (next: WorkspaceData) => {
      updateWorkspace(next);
    },
    [updateWorkspace],
  );

  const handleExportPdf = useCallback(() => {
    if (activeTab !== "charter") {
      setActiveTab("charter");
      setTimeout(() => window.print(), 300);
    } else {
      window.print();
    }
  }, [activeTab]);

  if (!isHydrated) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        role="status"
      >
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasCompletedSetup || !workspace || !grpi) {
    return (
      <div className="min-h-[60vh] bg-background">
        <WorkspaceEmptyState />
      </div>
    );
  }

  return (
    <div className="workspace-page-root min-h-screen bg-background print:bg-white min-w-0">
      <WorkspaceHeader grpi={grpi} onExportPdf={handleExportPdf} />

      <nav
        data-print-hide
        className="workspace-tabs border-b border-border"
        aria-label="Workspace tabs"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("kanban")}
              aria-current={activeTab === "kanban" ? "page" : undefined}
              className={cn(
                TAB_CLASS,
                activeTab === "kanban"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border",
              )}
            >
              Kanban Board
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("charter")}
              id="team-charter-tab"
              data-demo-target="workspace-charter-tab"
              aria-current={activeTab === "charter" ? "page" : undefined}
              className={cn(
                TAB_CLASS,
                activeTab === "charter"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border",
              )}
            >
              Team Charter
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("meeting")}
              aria-current={activeTab === "meeting" ? "page" : undefined}
              className={cn(
                TAB_CLASS,
                activeTab === "meeting"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border",
              )}
            >
              Meeting Cadence
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("roles")}
              aria-current={activeTab === "roles" ? "page" : undefined}
              className={cn(
                TAB_CLASS,
                activeTab === "roles"
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border",
              )}
            >
              Role Overview
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-6 print:py-0 print:px-0 min-w-0">
        {activeTab === "kanban" && (
          <KanbanBoard
            workspace={workspace}
            members={grpi.roles ?? []}
            onUpdate={handleUpdateWorkspace}
          />
        )}
        {activeTab === "charter" && <TeamCharter />}
        {activeTab === "meeting" && <MeetingCadence />}
        {activeTab === "roles" && <TeamRoster />}
      </div>
    </div>
  );
}
