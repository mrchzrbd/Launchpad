"use client";

import { motion } from "framer-motion";
import type { CoachTool, TutorialStep } from "@/lib/tool-coach-data";
import { TUTORIALS } from "@/lib/tool-coach-data";

export interface TutorialEmbedProps {
  tool: CoachTool;
  isOpen: boolean;
}

function StepDiagram({ type }: { type: TutorialStep["diagram"] }) {
  if (!type) return null;

  if (type === "workspace") {
    return (
      <div className="mt-3 rounded-card border border-border bg-surface-alt p-3" aria-hidden="true">
        <div className="flex gap-2 mb-2">
          <div className="h-2 w-16 rounded bg-accent/40" />
          <div className="h-2 w-10 rounded bg-border" />
        </div>
        <div className="space-y-1.5">
          <div className="h-6 rounded bg-surface border border-border flex items-center px-2">
            <span className="text-[8px] font-mono text-text-muted">Project Brief</span>
          </div>
          <div className="h-6 rounded bg-accent-light border border-accent/20 flex items-center px-2">
            <span className="text-[8px] font-mono text-accent">Task Tracker</span>
          </div>
          <div className="h-6 rounded bg-surface border border-border flex items-center px-2">
            <span className="text-[8px] font-mono text-text-muted">Meeting Notes</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "board") {
    return (
      <div className="mt-3 flex gap-1.5 overflow-hidden rounded-card border border-border bg-surface-alt p-2" aria-hidden="true">
        {["Backlog", "Doing", "Review", "Done"].map((col, i) => (
          <div key={col} className="flex-1 min-w-0">
            <div className="text-[7px] font-mono text-text-muted mb-1 truncate">{col}</div>
            <div
              className={`h-8 rounded border ${i === 1 ? "bg-accent-light border-accent/30" : "bg-surface border-border"}`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-1 rounded-card border border-border bg-surface-alt p-3" aria-hidden="true">
      {["Workspace", "Space", "Folder", "List"].map((level, i) => (
        <div
          key={level}
          className="flex items-center gap-2"
          style={{ paddingLeft: i * 8 }}
        >
          <div className={`h-2 w-2 rounded-sm ${i === 3 ? "bg-accent" : "bg-border"}`} />
          <span className="text-[8px] font-mono text-text-muted">{level}</span>
        </div>
      ))}
    </div>
  );
}

export function TutorialEmbed({ tool, isOpen }: TutorialEmbedProps) {
  const steps = TUTORIALS[tool];

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="pt-4 border-t border-border mt-4">
        <ol className="space-y-5">
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
              transition={{
                delay: isOpen ? index * 0.08 : 0,
                duration: 0.4,
                ease: "easeOut",
              }}
              className="flex gap-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white text-sm font-mono font-medium shadow-button">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-text-primary text-sm">
                  {step.title}
                </p>
                <p className="text-sm text-text-secondary font-body mt-1 leading-relaxed">
                  {step.description}
                </p>
                <StepDiagram type={step.diagram} />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}
