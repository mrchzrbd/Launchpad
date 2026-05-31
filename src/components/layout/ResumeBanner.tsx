"use client";

import Link from "next/link";
import { useLaunchpad } from "@/lib/store";

export function ResumeBanner() {
  const { isHydrated, hasCompletedSetup, state, reset } = useLaunchpad();

  if (!isHydrated || !hasCompletedSetup) return null;

  const projectName = state.grpi.goals?.projectName ?? "your project";

  return (
    <div
      style={{ height: "48px" }}
      className="resume-banner fixed top-0 left-0 right-0 z-50 bg-text-primary text-background flex items-center justify-between px-4 sm:px-6 gap-3"
      role="status"
      aria-live="polite"
    >
      <span className="font-body text-sm truncate min-w-0">
        Welcome back — <strong>{projectName}</strong> is ready for you
      </span>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Link
          href="/workspace"
          className="text-accent font-body text-sm font-semibold hover:underline whitespace-nowrap min-h-[44px] inline-flex items-center"
        >
          Open Workspace →
        </Link>
        <button
          type="button"
          onClick={() => reset()}
          className="text-text-muted font-body text-sm hover:text-background transition-colors whitespace-nowrap min-h-[44px]"
        >
          Start fresh
        </button>
      </div>
    </div>
  );
}
