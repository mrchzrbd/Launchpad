import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function WorkspaceEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="relative mb-10 w-48 h-48" aria-hidden="true">
        <div className="absolute inset-0 rounded-card bg-surface-alt border border-border rotate-[-6deg] shadow-card" />
        <div className="absolute inset-4 rounded-card bg-surface border border-border rotate-[3deg] shadow-card flex flex-col gap-2 p-4">
          <div className="h-2 w-2/3 rounded bg-border" />
          <div className="h-2 w-full rounded bg-surface-alt" />
          <div className="h-2 w-4/5 rounded bg-surface-alt" />
          <div className="mt-auto flex gap-1">
            <div className="h-6 flex-1 rounded bg-accent-light border border-accent/20" />
            <div className="h-6 flex-1 rounded bg-surface-alt" />
          </div>
        </div>
        <div className="absolute -right-2 -bottom-2 h-12 w-12 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-mono text-accent text-lg">
          ?
        </div>
      </div>

      <h1 className="font-display text-3xl text-text-primary mb-3">
        Your workspace is waiting
      </h1>
      <p className="text-text-secondary font-body max-w-md mb-8 leading-relaxed">
        Complete the 15-minute setup to generate your team&apos;s workspace —
        kanban board, charter, meeting cadence, and role overview.
      </p>
      <Link href="/onboarding">
        <Button size="lg">Start Setup</Button>
      </Link>
    </div>
  );
}
