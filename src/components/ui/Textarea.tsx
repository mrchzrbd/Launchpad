"use client";

import {
  forwardRef,
  useId,
  useState,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
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
      rows = 4,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
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

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            "w-full px-3 py-2.5 rounded-input font-body text-sm resize-y min-h-[100px]",
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
              <p className="text-xs text-error" role="alert">
                {error}
              </p>
            )}
            {!error && hint && (
              <p className="text-xs text-text-muted">{hint}</p>
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
