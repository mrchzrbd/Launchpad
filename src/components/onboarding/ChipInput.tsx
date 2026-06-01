"use client";

import { Plus, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ChipInputProps {
  label: string;
  description?: string;
  values: string[];
  onChange: (values: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  addLabel?: string;
}

export function ChipInput({
  label,
  description,
  values,
  onChange,
  onBlur,
  placeholder = "Type and press Enter",
  error,
  addLabel = "Add",
}: ChipInputProps) {
  const [draft, setDraft] = useState("");

  const addChip = () => {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...values, trimmed]);
    setDraft("");
    onBlur?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      addChip();
    }
  };

  const removeChip = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
    onBlur?.();
  };

  return (
    <div className="flex flex-col gap-2" data-chip-input>
      <div>
        <label className="text-sm font-medium text-text-primary font-body">
          {label}
        </label>
        {description && (
          <p className="text-xs text-text-muted mt-0.5 font-body">{description}</p>
        )}
      </div>

      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {values.map((chip, index) => (
            <li key={`${chip}-${index}`}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full",
                  "bg-surface-alt border border-border text-sm font-body text-text-primary",
                )}
              >
                {chip}
                <button
                  type="button"
                  onClick={() => removeChip(index)}
                  className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-border/80 text-text-muted hover:text-text-primary transition-colors"
                  aria-label={`Remove ${chip}`}
                >
                  <X size={12} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "flex-1 h-10 px-3 rounded-input font-body text-sm",
            "bg-surface text-text-primary placeholder:text-text-muted",
            "border transition-all duration-200 ease-out",
            error
              ? "border-error"
              : "border-border focus:border-accent focus:ring-2 focus:ring-accent/30",
            "focus:outline-none",
          )}
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={addChip}
          icon={<Plus size={16} />}
        >
          {addLabel}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
