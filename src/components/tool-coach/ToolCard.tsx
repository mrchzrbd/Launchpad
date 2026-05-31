"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { TutorialEmbed } from "@/components/tool-coach/TutorialEmbed";
import { Button } from "@/components/ui/Button";
import type { CoachTool } from "@/lib/tool-coach-data";
import { TOOL_META } from "@/lib/tool-coach-data";
import { cn } from "@/lib/utils";

export interface ToolCardProps {
  tool: CoachTool;
  isRecommended?: boolean;
}

export function ToolCard({ tool, isRecommended }: ToolCardProps) {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const meta = TOOL_META[tool];

  return (
    <article
      className={cn(
        "rounded-card border bg-surface p-6 shadow-card flex flex-col h-full transition-all duration-200",
        isRecommended
          ? "border-accent ring-1 ring-accent/20"
          : "border-border hover:shadow-card-hover hover-lift",
      )}
    >
      {isRecommended && (
        <span className="inline-flex self-start mb-3 px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-mono font-medium uppercase tracking-wider">
          Recommended
        </span>
      )}

      <h3 className="font-display text-2xl text-text-primary">{meta.name}</h3>
      <p className="text-sm text-text-secondary font-body italic mt-2 leading-relaxed">
        {meta.tagline}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 flex-1">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-success mb-2">
            Pros
          </p>
          <ul className="space-y-2">
            {meta.pros.map((pro) => (
              <li
                key={pro}
                className="flex gap-2 text-sm text-text-secondary font-body"
              >
                <Check size={16} className="text-success shrink-0 mt-0.5" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-error mb-2">
            Cons
          </p>
          <ul className="space-y-2">
            {meta.cons.map((con) => (
              <li
                key={con}
                className="flex gap-2 text-sm text-text-secondary font-body"
              >
                <X size={16} className="text-error shrink-0 mt-0.5" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-sm text-text-primary font-body mt-5 leading-relaxed border-t border-border pt-4">
        {meta.idealBlurb}
      </p>

      <div className="mt-5">
        <Button
          variant={tutorialOpen ? "secondary" : "ghost"}
          size="md"
          className="w-full"
          onClick={() => setTutorialOpen((o) => !o)}
          aria-expanded={tutorialOpen}
        >
          {tutorialOpen ? "Hide Tutorial" : "Quick Tutorial →"}
        </Button>
        <TutorialEmbed tool={tool} isOpen={tutorialOpen} />
      </div>
    </article>
  );
}
