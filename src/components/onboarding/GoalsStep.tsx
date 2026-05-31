"use client";

import { useCallback, useEffect, useState } from "react";
import { ChipInput } from "@/components/onboarding/ChipInput";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  DEFAULT_CONSTRAINTS,
  DEFAULT_SUCCESS_CRITERIA,
  PROJECT_TEMPLATES,
} from "@/lib/onboarding-constants";
import { isGoalsValid, validateGoalsField } from "@/lib/onboarding-validation";
import type { ProjectTemplate, TeamGoals } from "@/lib/types";
import { useLaunchpad } from "@/lib/store";
import { cn } from "@/lib/utils";

function getInitialGoals(existing?: Partial<TeamGoals>): Partial<TeamGoals> {
  return {
    projectName: existing?.projectName ?? "",
    projectTemplate: existing?.projectTemplate,
    deadline: existing?.deadline ?? "",
    primaryGoal: existing?.primaryGoal ?? "",
    successCriteria:
      existing?.successCriteria?.length
        ? existing.successCriteria
        : [...DEFAULT_SUCCESS_CRITERIA],
    constraints:
      existing?.constraints?.length
        ? existing.constraints
        : [...DEFAULT_CONSTRAINTS],
  };
}

export interface GoalsStepProps {
  onValidityChange?: (valid: boolean) => void;
  submitAttempted?: boolean;
}

export function GoalsStep({ onValidityChange, submitAttempted }: GoalsStepProps) {
  const { state, updateGoals } = useLaunchpad();
  const [form, setForm] = useState<Partial<TeamGoals>>(() =>
    getInitialGoals(state.grpi.goals),
  );
  const [touched, setTouched] = useState<Partial<Record<keyof TeamGoals, boolean>>>(
    {},
  );

  const persist = useCallback(
    (next: Partial<TeamGoals>) => {
      updateGoals(next);
    },
    [updateGoals],
  );

  const [hydrated, setHydrated] = useState(!!state.grpi.goals?.projectName);

  useEffect(() => {
    if (!hydrated && state.grpi.goals?.projectName) {
      setForm(getInitialGoals(state.grpi.goals));
      setHydrated(true);
    }
  }, [state.grpi.goals, hydrated]);

  useEffect(() => {
    onValidityChange?.(isGoalsValid(form));
  }, [form, onValidityChange]);

  useEffect(() => {
    if (submitAttempted) {
      setTouched({
        projectName: true,
        projectTemplate: true,
        deadline: true,
        primaryGoal: true,
        successCriteria: true,
        constraints: true,
      });
    }
  }, [submitAttempted]);

  const touch = (field: keyof TeamGoals) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const setField = <K extends keyof TeamGoals>(key: K, value: TeamGoals[K]) => {
    const next = { ...form, [key]: value };
    setForm(next);
    persist(next);
    return next;
  };

  const handleBlur = (field: keyof TeamGoals) => {
    touch(field);
    persist(form);
  };

  const errors = {
    projectName: touched.projectName
      ? validateGoalsField("projectName", form)
      : undefined,
    projectTemplate: touched.projectTemplate
      ? validateGoalsField("projectTemplate", form)
      : undefined,
    deadline: touched.deadline ? validateGoalsField("deadline", form) : undefined,
    primaryGoal: touched.primaryGoal
      ? validateGoalsField("primaryGoal", form)
      : undefined,
    successCriteria: touched.successCriteria
      ? validateGoalsField("successCriteria", form)
      : undefined,
    constraints: touched.constraints
      ? validateGoalsField("constraints", form)
      : undefined,
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-2">
          Step 1 of 4 · Goals
        </p>
        <h2 className="font-display text-3xl text-text-primary mb-2">
          What are you building together?
        </h2>
        <p className="text-text-secondary font-body">
          Tell us about your project so we can build your workspace around it.
        </p>
      </header>

      <Input
        label="Project Name"
        placeholder="e.g. Digital Leadership Group 4 — Launchpad"
        value={form.projectName ?? ""}
        onChange={(e) => setField("projectName", e.target.value)}
        onBlur={() => handleBlur("projectName")}
        error={errors.projectName}
      />

      <fieldset>
        <legend className="text-sm font-medium text-text-primary font-body mb-3">
          Project Template
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROJECT_TEMPLATES.map((tpl) => {
            const selected = form.projectTemplate === tpl.value;
            return (
              <button
                key={tpl.value}
                type="button"
                onClick={() => {
                  const next = setField("projectTemplate", tpl.value as ProjectTemplate);
                  touch("projectTemplate");
                  persist(next);
                }}
                className={cn(
                  "text-left rounded-card border-2 p-4 transition-all duration-200 ease-out hover-lift",
                  selected
                    ? "border-accent bg-accent-light shadow-card"
                    : "border-border bg-surface hover:border-text-muted/40",
                )}
              >
                <span className="text-2xl mb-2 block" aria-hidden="true">
                  {tpl.emoji}
                </span>
                <span className="font-body font-medium text-text-primary block">
                  {tpl.label}
                </span>
                <span className="text-xs text-text-secondary mt-1 block leading-relaxed">
                  {tpl.description}
                </span>
              </button>
            );
          })}
        </div>
        {errors.projectTemplate && (
          <p className="text-xs text-error mt-2" role="alert">
            {errors.projectTemplate}
          </p>
        )}
      </fieldset>

      <Input
        label="Submission Deadline"
        type="date"
        value={form.deadline ?? ""}
        onChange={(e) => setField("deadline", e.target.value)}
        onBlur={() => handleBlur("deadline")}
        error={errors.deadline}
      />

      <Textarea
        label="Primary Goal"
        placeholder="In one sentence, what does success look like for your team?"
        maxLength={200}
        showCharCount
        value={form.primaryGoal ?? ""}
        onChange={(e) => setField("primaryGoal", e.target.value)}
        onBlur={() => handleBlur("primaryGoal")}
        error={errors.primaryGoal}
        rows={3}
      />

      <ChipInput
        label="Success Criteria"
        description="Press Enter or click Add after each criterion"
        values={form.successCriteria ?? []}
        onChange={(successCriteria) => {
          const next = setField("successCriteria", successCriteria);
          persist(next);
        }}
        onBlur={() => {
          touch("successCriteria");
          persist(form);
        }}
        placeholder="e.g. All sections peer-reviewed before submission"
        error={errors.successCriteria}
      />

      <ChipInput
        label="Main Constraints"
        description="Timeline, location, resources — anything that limits how you work"
        values={form.constraints ?? []}
        onChange={(constraints) => {
          const next = setField("constraints", constraints);
          persist(next);
        }}
        onBlur={() => {
          touch("constraints");
          persist(form);
        }}
        placeholder="e.g. Maximum 10-page limit"
        error={errors.constraints}
      />
    </div>
  );
}
