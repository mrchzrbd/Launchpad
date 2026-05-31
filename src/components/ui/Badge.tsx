import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgePriority = "low" | "medium" | "high" | "critical";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  priority?: BadgePriority;
  color?: string;
  children: ReactNode;
}

const priorityStyles: Record<BadgePriority, string> = {
  low: "bg-surface-alt text-text-muted border-border",
  medium: "bg-blue-50 text-blue-800 border-blue-200",
  high: "bg-orange-50 text-orange-800 border-orange-200",
  critical: "bg-red-50 text-red-800 border-red-200",
};

export function Badge({
  priority,
  color,
  className,
  children,
  style,
  ...props
}: BadgeProps) {
  const customStyle = color
    ? {
        ...style,
        backgroundColor: `${color}18`,
        color,
        borderColor: `${color}40`,
      }
    : style;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full",
        "text-xs font-mono font-medium border",
        "transition-colors duration-200 ease-out",
        priority ? priorityStyles[priority] : "bg-accent-light text-accent border-accent/20",
        className,
      )}
      style={customStyle}
      {...props}
    >
      {children}
    </span>
  );
}
