"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { generateWorkspace } from "@/lib/workspace-generator";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "kanban", label: "Kanban Board" },
  { id: "charter", label: "Team Charter" },
  { id: "meetings", label: "Meeting Cadence" },
  { id: "roster", label: "Role Overview" },
] as const;

export type WorkspaceTabId = (typeof TABS)[number]["id"];

function isValidTab(tab: string | null): tab is WorkspaceTabId {
  return TABS.some((t) => t.id === tab);
}

export default function WorkspacePageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, isHydrated, hasCompletedSetup, updateWorkspace } = useLaunchpad();
  const { workspaceTourTab, setWorkspaceTourTab } = useDemoMode();

  const tabParam = searchParams.get("tab");
  const activeTab: WorkspaceTabId = isValidTab(tabParam) ? tabParam : "kanban";

  const setActiveTab = useCallback(
    (tab: WorkspaceTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setWorkspaceTourTab(null);
    },
    [pathname, router, searchParams, setWorkspaceTourTab],
  );

  useEffect(() => {
    if (workspaceTourTab) {
      setActiveTab(workspaceTourTab);
    }
  }, [workspaceTourTab, setActiveTab]);

  useEffect(() => {
    if (!isHydrated || !hasCompletedSetup) return;
    const finalized = finalizeGRPI(state.grpi);
    if (!finalized) return;

    const needsRegenerate =
      !state.workspace ||
      !state.workspace.meetingSchedule?.length ||
      !state.workspace.raciMatrix?.length;

    if (needsRegenerate) {
      updateWorkspace(generateWorkspace(finalized));
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
  }, [activeTab, setActiveTab]);

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
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                id={tab.id === "charter" ? "team-charter-tab" : undefined}
                data-demo-target={
                  tab.id === "charter" ? "workspace-charter-tab" : undefined
                }
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={cn(
                  "min-h-[44px] px-5 py-3.5 text-sm font-body font-medium whitespace-nowrap border-b-2 transition-colors duration-200",
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border",
                )}
              >
                {tab.label}
              </button>
            ))}
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
        {activeTab === "meetings" && <MeetingCadence />}
        {activeTab === "roster" && <TeamRoster />}
      </div>
    </div>
  );
}
