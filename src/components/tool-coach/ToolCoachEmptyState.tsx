import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function ToolCoachEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="relative mb-10 w-48 h-48" aria-hidden="true">
        <div className="absolute inset-0 rounded-card bg-surface-alt border border-border rotate-[4deg] shadow-card" />
        <div className="absolute inset-4 rounded-card bg-surface border border-border -rotate-2 shadow-card flex flex-col gap-2 p-4">
          <div className="flex gap-2">
            <div className="h-8 flex-1 rounded bg-accent-light border border-accent/30" />
            <div className="h-8 flex-1 rounded bg-surface-alt" />
            <div className="h-8 flex-1 rounded bg-surface-alt" />
          </div>
          <div className="h-2 w-full rounded bg-border" />
          <div className="h-2 w-3/4 rounded bg-surface-alt" />
        </div>
        <div className="absolute -left-2 top-8 h-10 w-10 rounded-button bg-accent text-white flex items-center justify-center font-mono text-xs shadow-button">
          ✓
        </div>
      </div>

      <h1 className="font-display text-3xl text-text-primary mb-3">
        Get a personalized tool&nbsp;match
      </h1>
      <p className="text-text-secondary font-body max-w-md mb-8 leading-relaxed">
        Complete the quick team setup first — we&apos;ll recommend Notion, Trello,
        or ClickUp based on how your team actually works.
      </p>
      <Link href="/onboarding">
        <Button size="lg">Start Setup</Button>
      </Link>
      <p className="mt-6 text-sm text-text-muted font-body">
        Or{" "}
        <a href="#tool-quiz" className="text-accent hover:text-accent-hover underline-offset-2 hover:underline">
          take the 3-question quiz
        </a>{" "}
        without setup
      </p>
    </div>
  );
}
