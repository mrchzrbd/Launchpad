"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { StaggerItem, StaggerReveal } from "@/components/layout/StaggerReveal";
import { ComparisonTable } from "@/components/tool-coach/ComparisonTable";
import { ToolCoachEmptyState } from "@/components/tool-coach/ToolCoachEmptyState";
import { RecommendationBanner } from "@/components/tool-coach/RecommendationBanner";
import { ToolCard } from "@/components/tool-coach/ToolCard";
import { ToolQuiz } from "@/components/tool-coach/ToolQuiz";
import type { CoachTool } from "@/lib/tool-coach-data";
import { finalizeGRPI } from "@/lib/grpi-generator";
import {
  recommendFromGRPI,
  recommendFromQuiz,
  type QuizComfort,
  type QuizProjectType,
  type QuizTeamSize,
  type ToolRecommendation,
} from "@/lib/tool-recommendation";
import { useLaunchpad } from "@/lib/store";

const TOOLS: CoachTool[] = ["notion", "trello", "clickup"];

export default function ToolCoachPageClient() {
  const { state, isHydrated, hasCompletedSetup } = useLaunchpad();
  const [hydrated, setHydrated] = useReducer(() => true, false);
  const [bannerQuizResult, setBannerQuizResult] = useState<ToolRecommendation | null>(
    null,
  );
  const [pageQuizResult, setPageQuizResult] = useState<ToolRecommendation | null>(
    null,
  );

  useEffect(() => {
    setHydrated();
  }, []);

  const grpi = useMemo(() => finalizeGRPI(state.grpi), [state.grpi]);

  const grpiRecommendation = useMemo(
    () => (grpi ? recommendFromGRPI(grpi) : null),
    [grpi],
  );

  const activeRecommendation =
    grpiRecommendation ?? bannerQuizResult ?? pageQuizResult;

  const showSetupEmpty = isHydrated && !hasCompletedSetup;

  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (showSetupEmpty) {
    return (
      <div className="w-full bg-background min-w-0">
        <ToolCoachEmptyState />
        <section
          id="tool-quiz"
          className="mx-auto max-w-6xl px-6 pb-20 md:pb-28 scroll-mt-24"
        >
          <ToolQuiz
            title="Quick tool match"
            subtitle="No setup required — answer three questions for a recommendation."
            onResult={setPageQuizResult}
            onClear={() => setPageQuizResult(null)}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-w-0 overflow-x-hidden">
      {/* Page intro */}
      <section className="border-b border-border bg-surface-alt/40">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-3">
            Tool Coach
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4 max-w-2xl">
            Pick a tool your team will actually&nbsp;use
          </h1>
          <p className="text-lg text-text-secondary font-body max-w-2xl leading-relaxed">
            Honest comparisons, no sponsorships — plus a recommendation based on
            how your team actually works.
          </p>
        </div>
      </section>

      {/* Recommendation banner */}
      <section
        id="tool-recommendation"
        className="mx-auto max-w-6xl px-6 -mt-6 md:-mt-8 mb-12 md:mb-16 relative z-10"
        data-demo-target="tool-coach-banner"
      >
        {grpiRecommendation ? (
          <RecommendationBanner recommendation={grpiRecommendation} />
        ) : (
          <BannerQuizFallback
            onResult={setBannerQuizResult}
            onClear={() => setBannerQuizResult(null)}
          />
        )}
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-20">
        <ComparisonTable recommendedTool={activeRecommendation?.tool} />
      </section>

      {/* Tool cards */}
      <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-20">
        <h2 className="font-display text-2xl text-text-primary mb-2">
          The full picture
        </h2>
        <p className="text-text-secondary font-body text-sm mb-8 max-w-2xl">
          Our honest take on each tool — pros, cons, and a step-by-step setup
          guide you can follow in one sitting.
        </p>
        <StaggerReveal className="grid gap-6 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <StaggerItem key={tool}>
              <ToolCard
                tool={tool}
                isRecommended={activeRecommendation?.tool === tool}
              />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </section>

      {/* Bottom quiz */}
      <section id="tool-quiz" className="mx-auto max-w-6xl px-6 pb-20 md:pb-28 scroll-mt-24">
        <ToolQuiz
          onResult={setPageQuizResult}
          onClear={() => setPageQuizResult(null)}
        />
      </section>
    </div>
  );
}

function BannerQuizFallback({
  onResult,
  onClear,
}: {
  onResult: (r: ToolRecommendation) => void;
  onClear?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<QuizProjectType | null>(null);
  const [teamSize, setTeamSize] = useState<QuizTeamSize | null>(null);
  const [comfort, setComfort] = useState<QuizComfort | null>(null);
  const [result, setResult] = useState<ToolRecommendation | null>(null);

  const isLast = step === 2;

  const handleNext = () => {
    if (step === 0 && !projectType) return;
    if (step === 1 && !teamSize) return;
    if (step === 2 && projectType && teamSize && comfort) {
      const rec = recommendFromQuiz({ projectType, teamSize, comfort });
      setResult(rec);
      onResult(rec);
      return;
    }
    if (!isLast) setStep((s) => s + 1);
  };

  const canProceed =
    (step === 0 && projectType) ||
    (step === 1 && teamSize) ||
    (step === 2 && comfort);

  const handleRetake = () => {
    setResult(null);
    setStep(0);
    setProjectType(null);
    setTeamSize(null);
    setComfort(null);
    onClear?.();
  };

  if (result) {
    return (
      <div className="space-y-3">
        <RecommendationBanner recommendation={result} />
        <button
          type="button"
          onClick={handleRetake}
          className="font-body text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Retake quiz
        </button>
      </div>
    );
  }

  const stepLabels = [
    "What kind of project is this?",
    "How big is your team?",
    "Technical comfort level?",
  ];

  return (
    <div className="rounded-card bg-text-primary text-background p-8 md:p-10 shadow-card-hover">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-background/60 mb-2">
        Quick match · Question {step + 1} of 3
      </p>
      <h2 className="font-display text-2xl text-background mb-6">
        {stepLabels[step]}
      </h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {step === 0 &&
          (
            [
              { v: "research-writing" as const, l: "Research / writing" },
              { v: "app-prototype" as const, l: "App / prototype" },
              { v: "presentation" as const, l: "Presentation" },
              { v: "business-analysis" as const, l: "Business analysis" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setProjectType(opt.v)}
              className={`px-4 py-2.5 rounded-button text-sm font-body border transition-all ${
                projectType === opt.v
                  ? "bg-accent border-accent text-white"
                  : "border-background/30 text-background/80 hover:border-background/60"
              }`}
            >
              {opt.l}
            </button>
          ))}
        {step === 1 &&
          (
            [
              { v: "2-3" as const, l: "2–3 people" },
              { v: "4-5" as const, l: "4–5 people" },
              { v: "6+" as const, l: "6+ people" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setTeamSize(opt.v)}
              className={`px-4 py-2.5 rounded-button text-sm font-body border transition-all ${
                teamSize === opt.v
                  ? "bg-accent border-accent text-white"
                  : "border-background/30 text-background/80 hover:border-background/60"
              }`}
            >
              {opt.l}
            </button>
          ))}
        {step === 2 &&
          (
            [
              { v: "very" as const, l: "High — we'll learn it" },
              { v: "somewhat" as const, l: "Medium — keep it simple" },
              { v: "not" as const, l: "Low — bare minimum" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setComfort(opt.v)}
              className={`px-4 py-2.5 rounded-button text-sm font-body border transition-all ${
                comfort === opt.v
                  ? "bg-accent border-accent text-white"
                  : "border-background/30 text-background/80 hover:border-background/60"
              }`}
            >
              {opt.l}
            </button>
          ))}
      </div>
      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-background/70 hover:text-background font-body"
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          disabled={!canProceed}
          onClick={handleNext}
          className="ml-auto px-6 py-2.5 rounded-button bg-accent text-white text-sm font-body font-medium disabled:opacity-40 hover:bg-accent-hover transition-colors"
        >
          {isLast ? "See recommendation" : "Next →"}
        </button>
      </div>
    </div>
  );
}
