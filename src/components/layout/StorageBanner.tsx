"use client";

import { useLaunchpadStorage } from "@/lib/store";

export function StorageBanner() {
  const { storageAvailable } = useLaunchpadStorage();

  if (storageAvailable) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-warning/30 border-b border-warning/50 px-4 py-2.5 text-center text-sm font-body text-text-primary"
    >
      Your progress won&apos;t be saved in private browsing mode. Complete setup in
      one session or use a regular browser window.
    </div>
  );
}
