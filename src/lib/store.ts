"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { DEMO_DATA, DEMO_MODE_SESSION_KEY } from "./demo-data";
import { finalizeGRPI } from "./grpi-generator";
import type {
  GRPIData,
  KanbanTask,
  LaunchpadState,
  TeamCharterData,
  TeamGoals,
  TeamMeeting,
  TeamMember,
  TeamNorms,
  TeamProcesses,
  WorkspaceData,
} from "./types";
import { generateWorkspace } from "./workspace-generator";

const STORAGE_KEY = "launchpad-v1";
const LEGACY_STORAGE_KEY = "launchpad-state";
const TOTAL_STEPS = 4;

const defaultState: LaunchpadState = {
  currentStep: 0,
  grpi: {},
  workspace: undefined,
  isComplete: false,
};

export type LaunchpadAction =
  | { type: "HYDRATE"; payload: LaunchpadState }
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_GOALS"; payload: Partial<TeamGoals> }
  | { type: "UPDATE_ROLES"; payload: TeamMember[] }
  | { type: "UPDATE_PROCESSES"; payload: Partial<TeamProcesses> }
  | { type: "UPDATE_NORMS"; payload: Partial<TeamNorms> }
  | { type: "SET_WORKSPACE"; payload: WorkspaceData }
  | { type: "UPDATE_WORKSPACE"; payload: WorkspaceData }
  | { type: "SET_COMPLETE" }
  | { type: "FINISH_ONBOARDING" }
  | { type: "UPDATE_KANBAN"; payload: WorkspaceData["kanbanColumns"] }
  | {
      type: "EDIT_TASK";
      columnId: string;
      taskId: string;
      updates: Partial<
        Pick<
          KanbanTask,
          "title" | "description" | "priority" | "epic" | "assignee" | "dueDate"
        >
      >;
    }
  | { type: "DELETE_TASK"; columnId: string; taskId: string }
  | {
      type: "UPDATE_CHARTER_SECTION";
      section: keyof TeamCharterData;
      value: string | string[];
    }
  | { type: "ADD_MEETING"; meeting: TeamMeeting }
  | {
      type: "EDIT_MEETING";
      meetingId: string;
      updates: Partial<TeamMeeting>;
    }
  | { type: "DELETE_MEETING"; meetingId: string }
  | { type: "ADD_MEMBER"; member: TeamMember }
  | {
      type: "EDIT_MEMBER";
      memberId: string;
      updates: Partial<TeamMember>;
    }
  | { type: "DELETE_MEMBER"; memberId: string }
  | { type: "ACTIVATE_DEMO" }
  | { type: "RESET" };

function reducer(state: LaunchpadState, action: LaunchpadAction): LaunchpadState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "SET_STEP":
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, TOTAL_STEPS - 1)),
      };

    case "UPDATE_GOALS":
      return {
        ...state,
        grpi: {
          ...state.grpi,
          goals: { ...state.grpi.goals, ...action.payload } as TeamGoals,
        },
      };

    case "UPDATE_ROLES":
      return { ...state, grpi: { ...state.grpi, roles: action.payload } };

    case "UPDATE_PROCESSES":
      return {
        ...state,
        grpi: {
          ...state.grpi,
          processes: { ...state.grpi.processes, ...action.payload } as TeamProcesses,
        },
      };

    case "UPDATE_NORMS":
      return {
        ...state,
        grpi: {
          ...state.grpi,
          norms: { ...state.grpi.norms, ...action.payload } as TeamNorms,
        },
      };

    case "SET_WORKSPACE":
      return { ...state, workspace: action.payload };

    case "UPDATE_WORKSPACE":
      return { ...state, workspace: action.payload };

    case "SET_COMPLETE":
      return { ...state, isComplete: true };

    case "FINISH_ONBOARDING": {
      const finalized = finalizeGRPI(state.grpi);
      if (!finalized) return state;
      const generated = generateWorkspace(finalized);
      const workspace = state.workspace
        ? {
            ...generated,
            kanbanColumns: state.workspace.kanbanColumns.length
              ? state.workspace.kanbanColumns
              : generated.kanbanColumns,
            charter: state.workspace.charter ?? generated.charter,
            meetings: state.workspace.meetings ?? generated.meetings,
          }
        : generated;
      return {
        ...state,
        grpi: finalized,
        workspace,
        isComplete: true,
        currentStep: TOTAL_STEPS - 1,
      };
    }

    case "UPDATE_KANBAN":
      return state.workspace
        ? {
            ...state,
            workspace: { ...state.workspace, kanbanColumns: action.payload },
          }
        : state;

    case "EDIT_TASK": {
      if (!state.workspace) return state;
      const { columnId, taskId, updates } = action;
      const newColumns = state.workspace.kanbanColumns.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t,
          ),
        };
      });
      return {
        ...state,
        workspace: { ...state.workspace, kanbanColumns: newColumns },
      };
    }

    case "DELETE_TASK": {
      if (!state.workspace) return state;
      const { columnId, taskId } = action;
      const newColumns = state.workspace.kanbanColumns.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        };
      });
      return {
        ...state,
        workspace: { ...state.workspace, kanbanColumns: newColumns },
      };
    }

    case "UPDATE_CHARTER_SECTION": {
      if (!state.workspace) return state;
      const { section, value } = action;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          charter: {
            ...(state.workspace.charter ?? {}),
            [section]: value,
          },
        },
      };
    }

    case "ADD_MEETING": {
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          meetings: [...(state.workspace.meetings ?? []), action.meeting],
        },
      };
    }

    case "EDIT_MEETING": {
      if (!state.workspace) return state;
      const { meetingId, updates } = action;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          meetings: (state.workspace.meetings ?? []).map((m) =>
            m.id === meetingId ? { ...m, ...updates } : m,
          ),
        },
      };
    }

    case "DELETE_MEETING": {
      if (!state.workspace) return state;
      return {
        ...state,
        workspace: {
          ...state.workspace,
          meetings: (state.workspace.meetings ?? []).filter(
            (m) => m.id !== action.meetingId,
          ),
        },
      };
    }

    case "ADD_MEMBER":
      return {
        ...state,
        grpi: {
          ...state.grpi,
          roles: [...(state.grpi.roles ?? []), action.member],
        },
      };

    case "EDIT_MEMBER": {
      const { memberId, updates } = action;
      return {
        ...state,
        grpi: {
          ...state.grpi,
          roles: (state.grpi.roles ?? []).map((r) =>
            r.id === memberId ? { ...r, ...updates } : r,
          ),
        },
      };
    }

    case "DELETE_MEMBER":
      return {
        ...state,
        grpi: {
          ...state.grpi,
          roles: (state.grpi.roles ?? []).filter((r) => r.id !== action.memberId),
        },
      };

    case "ACTIVATE_DEMO": {
      const grpi: GRPIData = {
        ...DEMO_DATA,
        completedAt: new Date().toISOString(),
      };
      return {
        currentStep: TOTAL_STEPS - 1,
        grpi,
        workspace: generateWorkspace(grpi),
        isComplete: true,
      };
    }

    case "RESET":
      return defaultState;

    default:
      return state;
  }
}

function safeRead(): LaunchpadState | null {
  if (typeof window === "undefined") return null;

  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LaunchpadState;
    if (parsed.isComplete && parsed.grpi && !parsed.workspace) {
      const finalized = finalizeGRPI(parsed.grpi);
      if (finalized) {
        return {
          ...parsed,
          workspace: generateWorkspace(finalized),
          grpi: finalized,
        };
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

function safeWrite(state: LaunchpadState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Safari private mode / quota
  }
}

function safeClear(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export interface LaunchpadContextValue {
  state: LaunchpadState;
  dispatch: Dispatch<LaunchpadAction>;
  isHydrated: boolean;
  hasCompletedSetup: boolean;
  totalSteps: number;
  storageAvailable: boolean;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateGoals: (goals: Partial<TeamGoals>) => void;
  updateRoles: (roles: TeamMember[]) => void;
  updateProcesses: (processes: Partial<TeamProcesses>) => void;
  updateNorms: (norms: Partial<TeamNorms>) => void;
  finishOnboarding: () => boolean;
  generateWorkspaceFromGRPI: () => boolean;
  updateWorkspace: (workspace: WorkspaceData) => void;
  updateKanban: (columns: WorkspaceData["kanbanColumns"]) => void;
  activateDemo: () => void;
  reset: () => void;
}

const LaunchpadContext = createContext<LaunchpadContextValue | null>(null);

export function LaunchpadProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const isDemoSession = sessionStorage.getItem(DEMO_MODE_SESSION_KEY) === "true";

    if (isDemoSession) {
      dispatch({ type: "ACTIVATE_DEMO" });
    } else {
      const saved = safeRead();
      if (saved) {
        dispatch({ type: "HYDRATE", payload: saved });
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const timer = setTimeout(() => safeWrite(state), 300);
    return () => clearTimeout(timer);
  }, [state, isHydrated]);

  const hasCompletedSetup = Boolean(
    state.isComplete &&
      state.grpi.goals?.projectName &&
      state.grpi.roles?.length &&
      state.grpi.processes &&
      state.grpi.norms &&
      state.workspace,
  );

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.setAttribute(
      "data-banner",
      hasCompletedSetup ? "true" : "false",
    );
  }, [hasCompletedSetup, isHydrated]);

  const storageAvailable = useMemo(() => {
    if (typeof window === "undefined") return true;
    try {
      const probe = "__launchpad_storage_probe__";
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  }, [isHydrated]);

  const setStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: state.currentStep + 1 });
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    dispatch({ type: "SET_STEP", payload: state.currentStep - 1 });
  }, [state.currentStep]);

  const updateGoals = useCallback((goals: Partial<TeamGoals>) => {
    dispatch({ type: "UPDATE_GOALS", payload: goals });
  }, []);

  const updateRoles = useCallback((roles: TeamMember[]) => {
    dispatch({ type: "UPDATE_ROLES", payload: roles });
  }, []);

  const updateProcesses = useCallback((processes: Partial<TeamProcesses>) => {
    dispatch({ type: "UPDATE_PROCESSES", payload: processes });
  }, []);

  const updateNorms = useCallback((norms: Partial<TeamNorms>) => {
    dispatch({ type: "UPDATE_NORMS", payload: norms });
  }, []);

  const finishOnboarding = useCallback((): boolean => {
    const finalized = finalizeGRPI(state.grpi);
    if (!finalized) return false;
    dispatch({ type: "FINISH_ONBOARDING" });
    return true;
  }, [state.grpi]);

  const generateWorkspaceFromGRPI = finishOnboarding;

  const updateWorkspace = useCallback((workspace: WorkspaceData) => {
    dispatch({ type: "UPDATE_WORKSPACE", payload: workspace });
  }, []);

  const updateKanban = useCallback((columns: WorkspaceData["kanbanColumns"]) => {
    dispatch({ type: "UPDATE_KANBAN", payload: columns });
  }, []);

  const activateDemo = useCallback(() => {
    sessionStorage.setItem(DEMO_MODE_SESSION_KEY, "true");
    dispatch({ type: "ACTIVATE_DEMO" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
    safeClear();
    sessionStorage.removeItem(DEMO_MODE_SESSION_KEY);
  }, []);

  const value = useMemo<LaunchpadContextValue>(
    () => ({
      state,
      dispatch,
      isHydrated,
      hasCompletedSetup,
      totalSteps: TOTAL_STEPS,
      storageAvailable,
      setStep,
      nextStep,
      prevStep,
      updateGoals,
      updateRoles,
      updateProcesses,
      updateNorms,
      finishOnboarding,
      generateWorkspaceFromGRPI,
      updateWorkspace,
      updateKanban,
      activateDemo,
      reset,
    }),
    [
      state,
      dispatch,
      isHydrated,
      hasCompletedSetup,
      storageAvailable,
      setStep,
      nextStep,
      prevStep,
      updateGoals,
      updateRoles,
      updateProcesses,
      updateNorms,
      finishOnboarding,
      updateWorkspace,
      updateKanban,
      activateDemo,
      reset,
    ],
  );

  return createElement(LaunchpadContext.Provider, { value }, children);
}

export function useLaunchpad(): LaunchpadContextValue {
  const ctx = useContext(LaunchpadContext);
  if (!ctx) {
    throw new Error("useLaunchpad must be used inside LaunchpadProvider");
  }
  return ctx;
}

export function useLaunchpadStorage(): { storageAvailable: boolean } {
  const { storageAvailable } = useLaunchpad();
  return { storageAvailable };
}
