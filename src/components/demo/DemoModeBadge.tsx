"use client";

import { useEffect, useState } from "react";
import { useDemoMode } from "@/lib/demo-mode";

export function DemoModeBadge() {
  const { isDemoMode, exitDemo } = useDemoMode();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!isDemoMode) return;
    const t = setTimeout(() => setExpanded(false), 3000);
    return () => clearTimeout(t);
  }, [isDemoMode]);

  if (!isDemoMode) return null;

  return (
    <div
      className="fixed bottom-6 left-6 z-50 cursor-pointer"
      onClick={() => setExpanded((e) => !e)}
      role="status"
      aria-live="polite"
    >
      <div
        className={`bg-accent text-white rounded-card shadow-card-hover overflow-hidden transition-all duration-300 ${
          expanded ? "max-w-xs" : "max-w-fit"
        }`}
      >
        {expanded ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2 gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
                Demo Mode
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  exitDemo();
                }}
                className="text-white/60 hover:text-white text-xs underline min-h-[44px] px-1"
              >
                Exit
              </button>
            </div>
            <p className="font-display text-lg leading-tight">Team Tschüss</p>
            <p className="font-body text-xs opacity-80 mt-1">
              Digital Collaboration Launchpad
            </p>
            <p className="font-body text-xs opacity-60 mt-2">
              Press ⌘⇧D to toggle · Click to collapse
            </p>
          </div>
        ) : (
          <div className="px-3 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs font-bold whitespace-nowrap">
              Demo · Team Tschüss
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
