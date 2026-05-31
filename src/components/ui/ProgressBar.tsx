"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
  className?: string;
}

export function ProgressBar({
  currentStep,
  totalSteps,
  label,
  className,
}: ProgressBarProps) {
  const clampedStep = Math.max(0, Math.min(currentStep, totalSteps));
  const percentage =
    totalSteps > 0 ? Math.round((clampedStep / totalSteps) * 100) : 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-text-primary font-body">
          {label ?? `Step ${clampedStep} of ${totalSteps}`}
        </span>
        <span className="text-xs text-text-muted font-mono" aria-hidden="true">
          {percentage}%
        </span>
      </div>

      <div
        className="h-2 w-full rounded-full bg-surface-alt overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedStep}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label={label ?? `Progress: step ${clampedStep} of ${totalSteps}`}
      >
        <motion.div
          className="h-full rounded-full bg-accent origin-left"
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
