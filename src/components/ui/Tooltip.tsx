"use client";

import {
  useState,
  useRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

const positionStyles: Record<
  NonNullable<TooltipProps["position"]>,
  string
> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({
  content,
  children,
  position = "top",
  className,
  delay = 200,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {visible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-2 text-xs font-body",
            "bg-text-primary text-surface rounded-button shadow-card",
            "whitespace-nowrap pointer-events-none",
            "animate-fade-slide-up",
            positionStyles[position],
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export function TooltipTrigger({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex cursor-help", className)}
      tabIndex={0}
      {...props}
    >
      {children}
    </span>
  );
}
