"use client";

import { Compass } from "lucide-react";
import { useEffect } from "react";
import { DemoModeBadge } from "@/components/demo/DemoModeBadge";
import { DemoTour } from "@/components/demo/DemoTour";
import { PresenterNotesPanel } from "@/components/demo/PresenterNotesPanel";
import { Button } from "@/components/ui/Button";
import { useDemoMode } from "@/lib/demo-mode";

export function DemoModeShell() {
  const {
    isDemoMode,
    activateDemo,
    exitDemo,
    startTour,
    tourActive,
    toggleNotes,
    setNotesOpen,
  } = useDemoMode();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || !e.shiftKey) return;

      if (e.key === "D" || e.key === "d") {
        e.preventDefault();
        if (isDemoMode) {
          exitDemo();
        } else {
          activateDemo();
        }
        return;
      }

      if (e.key === "N" || e.key === "n") {
        e.preventDefault();
        toggleNotes();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activateDemo, exitDemo, isDemoMode, toggleNotes]);

  return (
    <>
      <DemoModeBadge />
      <PresenterNotesPanel />

      {isDemoMode && !tourActive && (
        <Button
          type="button"
          size="md"
          className="fixed bottom-4 right-4 z-[180] shadow-card-hover gap-2"
          onClick={startTour}
          icon={<Compass size={18} />}
          aria-label="Start guided demo tour"
        >
          Tour
        </Button>
      )}

      <DemoTour />

      {/* Hidden hint for presenters discovering notes */}
      {isDemoMode && (
        <button
          type="button"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[181] focus:px-3 focus:py-2 focus:rounded-button focus:bg-surface focus:text-text-primary focus:shadow-card"
          onClick={() => setNotesOpen(true)}
        >
          Open presenter notes
        </button>
      )}
    </>
  );
}
