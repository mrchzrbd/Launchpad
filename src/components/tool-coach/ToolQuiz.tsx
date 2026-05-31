"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TOOL_META } from "@/lib/tool-coach-data";
import {
  recommendFromQuiz,
  type QuizAnswers,
  type QuizComfort,
  type QuizProjectType,
  type QuizTeamSize,
  type ToolRecommendation,
} from "@/lib/tool-recommendation";
import { cn } from "@/lib/utils";

const PROJECT_OPTIONS: { value: QuizProjectType; label: string }[] = [
  { value: "research-writing", label: "Research / writing" },
  { value: "app-prototype", label: "App / prototype" },
  { value: "presentation", label: "Presentation" },
  { value: "business-analysis", label: "Business analysis" },
];

const SIZE_OPTIONS: { value: QuizTeamSize; label: string }[] = [
  { value: "2-3", label: "2–3" },
  { value: "4-5", label: "4–5" },
  { value: "6+", label: "6+" },
];

const COMFORT_OPTIONS: { value: QuizComfort; label: string }[] = [
  { value: "very", label: "Very — we'll figure it out" },
  { value: "somewhat", label: "Somewhat — needs to be simple" },
  { value: "not", label: "Not at all — keep it basic" },
];

export interface ToolQuizProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  onResult?: (result: ToolRecommendation) => void;
}

export function ToolQuiz({
  title = "Still unsure?",
  subtitle = "Answer three quick questions — we'll point you in the right direction.",
  compact = false,
  onResult,
}: ToolQuizProps) {
  const [projectType, setProjectType] = useState<QuizProjectType | null>(null);
  const [teamSize, setTeamSize] = useState<QuizTeamSize | null>(null);
  const [comfort, setComfort] = useState<QuizComfort | null>(null);
  const [result, setResult] = useState<ToolRecommendation | null>(null);

  const canSubmit = projectType && teamSize && comfort;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const answers: QuizAnswers = { projectType, teamSize, comfort };
    const rec = recommendFromQuiz(answers);
    setResult(rec);
    onResult?.(rec);
  };

  const handleReset = () => {
    setProjectType(null);
    setTeamSize(null);
    setComfort(null);
    setResult(null);
  };

  return (
    <section
      className={cn(
        "rounded-card border border-border bg-surface-alt/60",
        compact ? "p-6" : "p-8 md:p-10",
      )}
    >
      <h2 className="font-display text-2xl text-text-primary mb-2">{title}</h2>
      <p className="text-text-secondary font-body mb-8 max-w-xl">{subtitle}</p>

      <div className="space-y-8">
        <QuizQuestion
          number={1}
          prompt="What kind of project is this?"
          options={PROJECT_OPTIONS}
          value={projectType}
          onChange={setProjectType}
        />
        <QuizQuestion
          number={2}
          prompt="How big is your team?"
          options={SIZE_OPTIONS}
          value={teamSize}
          onChange={setTeamSize}
        />
        <QuizQuestion
          number={3}
          prompt="How comfortable is your team with new tools?"
          options={COMFORT_OPTIONS}
          value={comfort}
          onChange={setComfort}
        />
      </div>

      {!result && (
        <Button
          className="mt-8"
          size="lg"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Get my recommendation
        </Button>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-8 rounded-card bg-text-primary text-background p-6 md:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-background/60 mb-2">
              Our pick for you
            </p>
            <h3 className="font-display text-2xl text-background mb-2">
              {TOOL_META[result.tool].name} — {result.headline}
            </h3>
            <p className="font-body text-background/80 leading-relaxed mb-6">
              {result.reason}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={TOOL_META[result.tool].signupUrl} target="_blank" rel="noopener noreferrer">
                <Button size="md" className="bg-accent hover:bg-accent-hover shadow-button">
                  Get Started with {TOOL_META[result.tool].name}
                </Button>
              </Link>
              <Button variant="ghost" size="md" className="text-background/80 hover:text-background hover:bg-background/10" onClick={handleReset}>
                Retake quiz
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function QuizQuestion<T extends string>({
  number,
  prompt,
  options,
  value,
  onChange,
}: {
  number: number;
  prompt: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="flex items-center gap-2 text-sm font-medium text-text-primary font-body mb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs font-mono">
          {number}
        </span>
        {prompt}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-4 py-2 rounded-button text-sm font-body border transition-all duration-200",
              value === opt.value
                ? "border-accent bg-accent-light text-accent font-medium"
                : "border-border bg-surface text-text-secondary hover:border-text-muted",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
