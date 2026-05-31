import { cn } from "@/lib/utils";

const STEPS = ["Goals", "Roles", "Processes", "Norms"] as const;

export interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

export function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  return (
    <ol className={cn("flex items-center gap-2 w-full", className)}>
      {STEPS.map((label, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;

        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1 flex-1">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-mono font-medium transition-all duration-200 ease-out",
                  isComplete && "bg-success text-white",
                  isActive && "bg-accent text-white shadow-button",
                  !isComplete && !isActive && "bg-surface-alt text-text-muted border border-border",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-body hidden sm:block",
                  isActive ? "text-accent font-medium" : "text-text-muted",
                )}
              >
                {label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 transition-colors duration-200",
                  isComplete ? "bg-success" : "bg-border",
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
