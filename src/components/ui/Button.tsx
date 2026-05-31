"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  children?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white shadow-button hover:bg-accent-hover hover-lift btn-primary-shimmer overflow-hidden relative",
  secondary:
    "bg-surface text-text-primary border border-border hover:bg-surface-alt hover-lift",
  ghost:
    "bg-transparent text-text-secondary hover:bg-accent-light hover:text-accent",
  danger:
    "bg-error text-white hover:opacity-90 hover-lift",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-11 min-w-[44px] px-3 text-sm gap-1.5",
  md: "min-h-11 min-w-[44px] px-4 text-sm gap-2",
  lg: "min-h-12 min-w-[44px] px-6 text-base gap-2.5",
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin h-4 w-4", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  icon,
  iconPosition = "left",
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.08 }}
      className={cn(
        "inline-flex items-center justify-center font-body font-medium",
        "rounded-button transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent/40 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner />}
      {!loading && icon && iconPosition === "left" && (
        <span className="shrink-0 relative z-10">{icon}</span>
      )}
      {children && <span className="relative z-10">{children}</span>}
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0 relative z-10">{icon}</span>
      )}
    </motion.button>
  );
}
