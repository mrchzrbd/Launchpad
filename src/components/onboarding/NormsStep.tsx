"use client";

import { useCallback, useEffect, useState } from "react";
import { ChipInput } from "@/components/onboarding/ChipInput";
import {
  CONFLICT_OPTIONS,
  DEFAULT_CUSTOM_NORMS,
  RESPONSE_TIME_OPTIONS,
} from "@/lib/onboarding-constants";
import { isNormsValid } from "@/lib/onboarding-validation";
import type { TeamNorms } from "@/lib/types";
import { useLaunchpad } from "@/lib/store";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function getInitialNorms(existing?: Partial<TeamNorms>): Partial<TeamNorms> {
  return {
    responseTime: existing?.responseTime ?? "",
    workingHours: existing?.workingHours ?? "",
    conflictResolution: existing?.conflictResolution ?? "",
    commitmentLevel: existing?.commitmentLevel ?? "High — team norms agreed",
    customNorms:
      existing?.customNorms?.length
        ? existing.customNorms
        : [...DEFAULT_CUSTOM_NORMS],
  };
}

function parseWorkingHours(stored?: string) {
  const defaults = {
    from: "09:00",
    to: "20:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"] as string[],
    timezone: "CET",
  };
  if (!stored) return defaults;
  const dayMatch = stored.match(/Mon[^·]*?((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun[–-]?)+)/i);
  const timeMatch = stored.match(/(\d{1,2}(?::\d{2})?(?:am|pm)?)[–-](\d{1,2}(?::\d{2})?(?:am|pm)?)/i);
  const tzMatch = stored.match(/\b([A-Z]{2,4})\s*$/);
  return {
    from: timeMatch?.[1] ?? defaults.from,
    to: timeMatch?.[2] ?? defaults.to,
    days: defaults.days,
    timezone: tzMatch?.[1] ?? defaults.timezone,
  };
}

function formatWorkingHours(
  from: string,
  to: string,
  days: string[],
  timezone: string,
): string {
  const dayRange =
    days.length === 7
      ? "Mon–Sun"
      : days.length === 5 &&
          days.includes("Mon") &&
          days.includes("Fri") &&
          !days.includes("Sat")
        ? "Mon–Fri"
        : days.join(", ");
  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h, 10);
    if (Number.isNaN(hour)) return t;
    const suffix = hour >= 12 ? "pm" : "am";
    const h12 = hour % 12 || 12;
    return m && m !== "00" ? `${h12}:${m}${suffix}` : `${h12}${suffix}`;
  };
  return `Our team works ${dayRange}, ${formatTime(from)}–${formatTime(to)} ${timezone}.`;
}

function getResponseExplanation(hoursLabel: string): string {
  const hours = parseInt(hoursLabel, 10);
  if (Number.isNaN(hours)) return "";
  const now = new Date();
  const answered = new Date(now.getTime() + hours * 60 * 60 * 1000);
  if (hoursLabel.includes("24") || hoursLabel.includes("48")) {
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + (hours >= 24 ? Math.ceil(hours / 24) : 1));
    nextDay.setHours(9, 0, 0, 0);
    return `A message sent at 9pm would be answered by ${nextDay.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} the next working day.`;
  }
  return `A message sent now would typically be answered by ${answered.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`;
}

export interface NormsStepProps {
  onValidityChange?: (valid: boolean) => void;
}

export function NormsStep({ onValidityChange }: NormsStepProps) {
  const { state, updateNorms } = useLaunchpad();
  const initialNorms = getInitialNorms(state.grpi.norms);
  const initialParsed = parseWorkingHours(initialNorms.workingHours);

  const [form, setForm] = useState<Partial<TeamNorms>>(() => {
    if (!initialNorms.workingHours) {
      const hours = formatWorkingHours(
        initialParsed.from,
        initialParsed.to,
        initialParsed.days,
        initialParsed.timezone,
      );
      return { ...initialNorms, workingHours: hours };
    }
    return initialNorms;
  });
  const [from, setFrom] = useState(initialParsed.from);
  const [to, setTo] = useState(initialParsed.to);
  const [selectedDays, setSelectedDays] = useState<string[]>(initialParsed.days);
  const [timezone, setTimezone] = useState(initialParsed.timezone);
  const [touched, setTouched] = useState(false);

  const persist = useCallback(
    (next: Partial<TeamNorms>) => {
      updateNorms(next as TeamNorms);
    },
    [updateNorms],
  );

  const syncWorkingHours = useCallback(
    (f: string, t: string, days: string[], tz: string) => {
      const sentence = formatWorkingHours(f, t, days, tz);
      const next = { ...form, workingHours: sentence, commitmentLevel: "High — team norms agreed" };
      setForm(next);
      persist(next);
    },
    [form, persist],
  );

  const [hydrated, setHydrated] = useState(!!state.grpi.norms?.responseTime);

  useEffect(() => {
    if (!hydrated && state.grpi.norms?.responseTime) {
      const norms = getInitialNorms(state.grpi.norms);
      setForm(norms);
      const p = parseWorkingHours(norms.workingHours);
      setFrom(p.from);
      setTo(p.to);
      setSelectedDays(p.days);
      setTimezone(p.timezone);
      setHydrated(true);
    }
  }, [state.grpi.norms, hydrated]);

  useEffect(() => {
    onValidityChange?.(isNormsValid(form));
  }, [form, onValidityChange]);

  useEffect(() => {
    persist(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDay = (day: string) => {
    const days = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(days);
    syncWorkingHours(from, to, days, timezone);
  };

  const saveBlur = () => {
    setTouched(true);
    persist(form);
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-2">
          Step 4 of 4 · Interpersonal Norms
        </p>
        <h2 className="font-display text-3xl text-text-primary mb-2">
          The unwritten rules, written down.
        </h2>
        <p className="text-text-secondary font-body">
          These are the agreements that keep teams healthy when things get hard.
        </p>
      </header>

      {/* Response time */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-1 block">
          Response Time Expectation
        </legend>
        <p className="text-xs text-text-muted mb-3 font-body">
          Maximum wait time for replies on the main channel
        </p>
        <div className="flex flex-wrap gap-2">
          {RESPONSE_TIME_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                const next = { ...form, responseTime: opt };
                setForm(next);
                persist(next);
              }}
              className={cn(
                "px-4 py-2 rounded-button text-sm font-body border transition-all duration-200",
                form.responseTime === opt
                  ? "border-accent bg-accent-light text-accent font-medium"
                  : "border-border bg-surface text-text-secondary",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {form.responseTime && (
          <p className="text-xs text-text-secondary mt-3 font-body bg-surface-alt rounded-card px-3 py-2">
            {getResponseExplanation(form.responseTime)}
          </p>
        )}
      </fieldset>

      {/* Working hours */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-3 block">
          Working Hours
        </legend>
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="text-xs text-text-muted font-body mb-1 block">From</label>
            <input
              type="time"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                syncWorkingHours(e.target.value, to, selectedDays, timezone);
              }}
              onBlur={saveBlur}
              className="h-10 px-3 rounded-input border border-border font-body text-sm focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted font-body mb-1 block">To</label>
            <input
              type="time"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                syncWorkingHours(from, e.target.value, selectedDays, timezone);
              }}
              onBlur={saveBlur}
              className="h-10 px-3 rounded-input border border-border font-body text-sm focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted font-body mb-1 block">Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                syncWorkingHours(from, to, selectedDays, e.target.value);
              }}
              onBlur={saveBlur}
              className="h-10 px-3 rounded-input border border-border font-body text-sm w-24 focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {WEEKDAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={cn(
                "h-9 w-11 rounded-button text-xs font-mono border transition-all",
                selectedDays.includes(day)
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-text-muted",
              )}
            >
              {day}
            </button>
          ))}
        </div>
        <p className="text-sm text-text-primary font-body bg-accent-light/50 border border-accent/15 rounded-card px-4 py-3">
          {form.workingHours ||
            formatWorkingHours(from, to, selectedDays, timezone)}
        </p>
      </fieldset>

      {/* Conflict resolution */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-3 block">
          Conflict Resolution
        </legend>
        <div className="space-y-2">
          {CONFLICT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-3 rounded-card border p-4 cursor-pointer transition-all duration-200",
                form.conflictResolution === opt.value
                  ? "border-accent bg-accent-light"
                  : "border-border bg-surface",
              )}
            >
              <input
                type="radio"
                name="conflictResolution"
                value={opt.value}
                checked={form.conflictResolution === opt.value}
                onChange={() => {
                  const next = { ...form, conflictResolution: opt.value };
                  setForm(next);
                  persist(next);
                }}
                onBlur={saveBlur}
                className="accent-accent"
              />
              <span className="text-sm font-body text-text-primary">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Custom norms */}
      <ChipInput
        label="Custom Norms"
        description="Team agreements that matter to you — add or remove freely"
        values={form.customNorms ?? []}
        onChange={(customNorms) => {
          const next = { ...form, customNorms };
          setForm(next);
          persist(next);
        }}
        onBlur={saveBlur}
        placeholder="Add a team norm"
      />
    </div>
  );
}
