"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCharCount?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      showCharCount = false,
      className,
      id: externalId,
      maxLength,
      value,
      defaultValue,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const [focused, setFocused] = useState(false);

    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
          ? defaultValue.length
          : 0;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium font-body transition-all duration-150 ease-out",
              focused && !error
                ? "text-accent -translate-y-0.5"
                : "text-text-primary",
              error && "text-error",
            )}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "w-full min-h-11 px-3 rounded-input font-body text-sm",
            "bg-surface text-text-primary placeholder:text-text-muted",
            "border transition-all duration-150 ease-out",
            error
              ? "border-error focus-visible:ring-error/40"
              : "border-border focus:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/40 focus-visible:ring-offset-0",
            "focus:outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-alt",
            className,
          )}
          {...props}
        />

        <div className="flex items-start justify-between gap-2 min-h-[1.25rem]">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-xs text-error" role="alert">
                {error}
              </p>
            )}
            {!error && hint && (
              <p id={hintId} className="text-xs text-text-muted">
                {hint}
              </p>
            )}
          </div>

          {showCharCount && maxLength && (
            <span className="text-xs text-text-muted font-mono shrink-0">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);
