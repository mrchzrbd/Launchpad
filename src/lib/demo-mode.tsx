"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { DEMO_MODE_SESSION_KEY } from "./demo-data";
import { useLaunchpad } from "./store";

export type WorkspaceTourTab = "kanban" | "charter" | "meetings" | "roster";

interface DemoModeContextValue {
  isDemoMode: boolean;
  tourActive: boolean;
  tourStep: number;
  notesOpen: boolean;
  workspaceTourTab: WorkspaceTourTab | null;
  activateDemo: () => void;
  exitDemo: () => void;
  startTour: () => void;
  endTour: () => void;
  setTourStep: (step: number) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  toggleNotes: () => void;
  setNotesOpen: (open: boolean) => void;
  setWorkspaceTourTab: (tab: WorkspaceTourTab | null) => void;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { activateDemo: loadDemoState, reset } = useLaunchpad();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [workspaceTourTab, setWorkspaceTourTab] = useState<WorkspaceTourTab | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DEMO_MODE_SESSION_KEY) === "true") {
      setIsDemoMode(true);
    }
  }, []);

  const activateDemo = useCallback(() => {
    sessionStorage.setItem(DEMO_MODE_SESSION_KEY, "true");
    loadDemoState();
    setIsDemoMode(true);
    router.push("/workspace");
  }, [loadDemoState, router]);

  const exitDemo = useCallback(() => {
    sessionStorage.removeItem(DEMO_MODE_SESSION_KEY);
    setIsDemoMode(false);
    setTourActive(false);
    setTourStep(0);
    reset();
    router.push("/");
  }, [reset, router]);

  const startTour = useCallback(() => {
    setTourStep(0);
    setTourActive(true);
    router.push("/");
  }, [router]);

  const endTour = useCallback(() => {
    setTourActive(false);
    setTourStep(0);
    setWorkspaceTourTab(null);
  }, []);

  const nextTourStep = useCallback(() => {
    setTourStep((s) => Math.min(s + 1, 4));
  }, []);

  const prevTourStep = useCallback(() => {
    setTourStep((s) => Math.max(s - 1, 0));
  }, []);

  const toggleNotes = useCallback(() => {
    setNotesOpen((o) => !o);
  }, []);

  const value = useMemo<DemoModeContextValue>(
    () => ({
      isDemoMode,
      tourActive,
      tourStep,
      notesOpen,
      workspaceTourTab,
      activateDemo,
      exitDemo,
      startTour,
      endTour,
      setTourStep,
      nextTourStep,
      prevTourStep,
      toggleNotes,
      setNotesOpen,
      setWorkspaceTourTab,
    }),
    [
      isDemoMode,
      tourActive,
      tourStep,
      notesOpen,
      workspaceTourTab,
      activateDemo,
      exitDemo,
      startTour,
      endTour,
      nextTourStep,
      prevTourStep,
      toggleNotes,
    ],
  );

  return (
    <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return ctx;
}
