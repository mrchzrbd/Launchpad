"use client";

import { Calendar } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  AI_POLICY_TEMPLATE,
  COMMUNICATION_CHANNELS,
  DECISION_OPTIONS,
  FEEDBACK_OPTIONS,
  FILE_STORAGE_OPTIONS,
  MEETING_CADENCE_OPTIONS,
} from "@/lib/onboarding-constants";
import { isProcessesValid } from "@/lib/onboarding-validation";
import type { FeedbackStyle, MeetingCadence, TeamProcesses } from "@/lib/types";
import { useLaunchpad } from "@/lib/store";
import { cn } from "@/lib/utils";

function getInitialProcesses(existing?: Partial<TeamProcesses>): Partial<TeamProcesses> {
  return {
    communicationChannel: existing?.communicationChannel ?? "",
    meetingCadence: existing?.meetingCadence,
    decisionMaking: existing?.decisionMaking ?? "",
    fileStorage: existing?.fileStorage ?? "",
    feedbackStyle: existing?.feedbackStyle,
    aiPolicy: existing?.aiPolicy ?? "",
  };
}

export interface ProcessesStepProps {
  onValidityChange?: (valid: boolean) => void;
}

export function ProcessesStep({ onValidityChange }: ProcessesStepProps) {
  const { state, updateProcesses } = useLaunchpad();
  const [form, setForm] = useState<Partial<TeamProcesses>>(() =>
    getInitialProcesses(state.grpi.processes),
  );
  const [commOther, setCommOther] = useState("");
  const [touched, setTouched] = useState(false);

  const standardChannels = COMMUNICATION_CHANNELS.filter((c) => c !== "Other");
  const isOtherChannel =
    !!form.communicationChannel &&
    !standardChannels.includes(
      form.communicationChannel as (typeof standardChannels)[number],
    );

  const persist = useCallback(
    (next: Partial<TeamProcesses>) => {
      updateProcesses(next as TeamProcesses);
    },
    [updateProcesses],
  );

  const [hydrated, setHydrated] = useState(!!state.grpi.processes?.communicationChannel);

  useEffect(() => {
    if (!hydrated && state.grpi.processes?.communicationChannel) {
      setForm(getInitialProcesses(state.grpi.processes));
      setHydrated(true);
    }
  }, [state.grpi.processes, hydrated]);

  useEffect(() => {
    onValidityChange?.(isProcessesValid(form));
  }, [form, onValidityChange]);

  const setField = <K extends keyof TeamProcesses>(
    key: K,
    value: TeamProcesses[K],
  ) => {
    const next = { ...form, [key]: value };
    setForm(next);
    return next;
  };

  const saveBlur = () => {
    setTouched(true);
    persist(form);
  };

  const selectChannel = (channel: string) => {
    if (channel === "Other") {
      setField("communicationChannel", commOther || "Other");
    } else {
      setCommOther("");
      const next = setField("communicationChannel", channel);
      persist(next);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-2">
          Step 3 of 4 · Processes
        </p>
        <h2 className="font-display text-3xl text-text-primary mb-2">
          How will you actually work?
        </h2>
        <p className="text-text-secondary font-body">
          Decisions made now prevent arguments later.
        </p>
      </header>

      {/* Communication */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-1 block">
          Main Communication Channel
        </legend>
        <p className="text-xs text-text-muted mb-3 font-body">
          Where day-to-day updates and quick questions happen
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMUNICATION_CHANNELS.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => selectChannel(ch)}
              className={cn(
                "px-4 py-2 rounded-button text-sm font-body border transition-all duration-200",
                (ch === "Other" && isOtherChannel) ||
                  form.communicationChannel === ch
                  ? "border-accent bg-accent-light text-accent font-medium"
                  : "border-border bg-surface text-text-secondary hover:border-text-muted",
              )}
            >
              {ch}
            </button>
          ))}
        </div>
        {(form.communicationChannel === "Other" || isOtherChannel) && (
          <input
            type="text"
            value={commOther || (isOtherChannel ? form.communicationChannel : "")}
            onChange={(e) => {
              setCommOther(e.target.value);
              const next = setField("communicationChannel", e.target.value);
              persist(next);
            }}
            onBlur={saveBlur}
            placeholder="Specify your channel"
            className="mt-3 w-full h-10 px-3 rounded-input border border-border font-body text-sm focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
          />
        )}
        {touched && !form.communicationChannel?.trim() && (
          <p className="text-xs text-error mt-2">Select a communication channel</p>
        )}
      </fieldset>

      {/* Meeting cadence */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-3 block">
          Meeting Cadence
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MEETING_CADENCE_OPTIONS.map((opt) => {
            const selected = form.meetingCadence === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const next = setField("meetingCadence", opt.value as MeetingCadence);
                  persist(next);
                }}
                className={cn(
                  "text-left rounded-card border-2 p-4 transition-all duration-200 hover-lift",
                  selected
                    ? "border-accent bg-accent-light"
                    : "border-border bg-surface",
                )}
              >
                <Calendar
                  size={20}
                  className={cn(
                    "mb-2",
                    selected ? "text-accent" : "text-text-muted",
                  )}
                />
                <span className="font-body font-medium text-text-primary block">
                  {opt.label}
                </span>
                <span className="text-xs text-text-secondary block mt-1">
                  {opt.description}
                </span>
                <span className="font-mono text-[10px] text-text-muted mt-2 block">
                  {opt.timeCommitment}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Decision making */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-3 block">
          Decision Making
        </legend>
        <div className="space-y-2">
          {DECISION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-start gap-3 rounded-card border p-4 cursor-pointer transition-all duration-200",
                form.decisionMaking === opt.value
                  ? "border-accent bg-accent-light"
                  : "border-border bg-surface hover:border-text-muted/40",
              )}
            >
              <input
                type="radio"
                name="decisionMaking"
                value={opt.value}
                checked={form.decisionMaking === opt.value}
                onChange={() => {
                  const next = setField("decisionMaking", opt.value);
                  persist(next);
                }}
                onBlur={saveBlur}
                className="mt-1 accent-accent"
              />
              <div>
                <span className="font-body font-medium text-text-primary block">
                  {opt.label}
                </span>
                <span className="text-xs text-text-secondary">
                  {opt.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {/* File storage */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-3 block">
          File Storage
        </legend>
        <div className="flex flex-wrap gap-2">
          {FILE_STORAGE_OPTIONS.map((storage) => (
            <button
              key={storage}
              type="button"
              onClick={() => {
                const next = setField("fileStorage", storage);
                persist(next);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-body border transition-all duration-200",
                form.fileStorage === storage
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-text-secondary hover:border-accent/40",
              )}
            >
              {storage}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Feedback style */}
      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-3 block">
          Feedback Style
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEEDBACK_OPTIONS.map((opt) => {
            const selected = form.feedbackStyle === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const next = setField("feedbackStyle", opt.value as FeedbackStyle);
                  persist(next);
                }}
                className={cn(
                  "text-left rounded-card border-2 p-4 transition-all duration-200",
                  selected
                    ? "border-accent bg-accent-light"
                    : "border-border bg-surface hover-lift",
                )}
              >
                <span className="font-body font-medium text-text-primary block">
                  {opt.label}
                </span>
                <span className="text-xs text-text-secondary mt-1 block">
                  {opt.description}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* AI policy */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <label className="text-sm font-medium text-text-primary font-body block">
              AI Use Policy
            </label>
            <p className="text-xs text-text-muted font-body mt-0.5">
              How your team uses AI tools on this project
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              const next = setField("aiPolicy", AI_POLICY_TEMPLATE);
              persist(next);
            }}
          >
            Use our template
          </Button>
        </div>
        <Textarea
          value={form.aiPolicy ?? ""}
          onChange={(e) => setField("aiPolicy", e.target.value)}
          onBlur={saveBlur}
          rows={4}
          placeholder="Describe when and how AI may be used on this project…"
        />
        {touched && !form.aiPolicy?.trim() && (
          <p className="text-xs text-error mt-2">AI policy is required</p>
        )}
      </div>
    </div>
  );
}
