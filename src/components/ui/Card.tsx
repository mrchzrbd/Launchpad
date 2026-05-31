import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "elevated" | "bordered" | "flat";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-surface shadow-card",
  elevated: "bg-surface shadow-card hover:shadow-card-hover hover-lift cursor-default",
  bordered: "bg-surface border border-border",
  flat: "bg-surface-alt",
};

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "default",
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card transition-all duration-200 ease-out",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-xl text-text-primary", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-secondary mt-1", className)} {...props}>
      {children}
    </p>
  );
}
