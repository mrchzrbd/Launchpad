"use client";

import { forwardRef, type SelectHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      label,
      error,
      hint,
      options,
      placeholder,
      className,
      id: externalId,
      disabled,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const id = externalId ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-primary font-body"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full h-10 px-3 pr-9 rounded-input font-body text-sm appearance-none",
              "bg-surface text-text-primary",
              "border transition-all duration-200 ease-out",
              error
                ? "border-error focus:ring-error/30"
                : "border-border focus:border-accent focus:ring-2 focus:ring-accent/30",
              "focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-alt",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>

          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {error && (
          <p className="text-xs text-error" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  },
);
