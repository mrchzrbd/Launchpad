"use client";

import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { WIZARD_STEPS } from "@/lib/onboarding-constants";
import { isStepComplete } from "@/lib/onboarding-validation";
import type { GRPIData } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface OnboardingSidebarProps {
  currentStep: number;
  grpi: Partial<GRPIData>;
  onStepClick: (step: number) => void;
  onSaveExit: () => void;
}

export function OnboardingSidebar({
  currentStep,
  grpi,
  onStepClick,
  onSaveExit,
}: OnboardingSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-[280px] shrink-0 border-r border-border bg-surface h-full">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-accent shadow-button" />
          <span className="font-display text-xl text-text-primary group-hover:text-accent transition-colors">
            Launchpad
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Onboarding steps">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete =
            index < currentStep || isStepComplete(index, grpi);
          const isUpcoming = !isActive && !isComplete;
          const canClick = index < currentStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!canClick}
              aria-current={isActive ? "step" : undefined}
              onClick={() => canClick && onStepClick(index)}
              className={cn(
                "w-full text-left rounded-card p-3 transition-all duration-200 ease-out",
                isActive && "bg-accent-light",
                canClick && !isActive && "hover:bg-surface-alt cursor-pointer",
                !canClick && "cursor-default",
              )}
            >
              <div className="flex gap-3">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-mono font-medium transition-colors",
                    isActive && "bg-accent text-white",
                    isComplete && !isActive && "bg-success text-white",
                    isUpcoming && "bg-surface-alt text-text-muted border border-border",
                  )}
                >
                  {isComplete && !isActive ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-body transition-colors",
                      isActive && "font-semibold text-text-primary",
                      isComplete && !isActive && "text-text-muted line-through decoration-text-muted/50",
                      isUpcoming && "text-text-muted",
                    )}
                  >
                    {step.name}
                  </p>
                  {(isActive || isComplete) && (
                    <p
                      className={cn(
                        "text-xs mt-0.5 leading-snug",
                        isActive ? "text-text-secondary" : "text-text-muted",
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border space-y-4">
        <div className="flex items-center gap-3 rounded-card bg-surface-alt px-4 py-3">
          <Clock size={18} className="text-accent shrink-0" />
          <div>
            <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Estimated
            </p>
            <p className="text-sm font-medium text-text-primary font-body">
              12 min remaining
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSaveExit}
          className="text-sm font-body text-text-secondary hover:text-accent transition-colors w-full text-left"
        >
          Save & Exit
        </button>
      </div>
    </aside>
  );
}

export function MobileOnboardingProgress({
  currentStep,
}: {
  currentStep: number;
}) {
  const step = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="md:hidden border-b border-border bg-surface px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs text-accent uppercase tracking-wider">
          Step {currentStep + 1} of {WIZARD_STEPS.length}
        </span>
        <span className="text-sm font-medium text-text-primary font-body">
          {step.name}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-text-muted mt-2 font-body">{step.description}</p>
    </div>
  );
}
