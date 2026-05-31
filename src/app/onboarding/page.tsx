"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CompletionScreen } from "@/components/onboarding/CompletionScreen";
import { GoalsStep } from "@/components/onboarding/GoalsStep";
import {
  MobileOnboardingProgress,
  OnboardingSidebar,
} from "@/components/onboarding/OnboardingSidebar";
import { NormsStep } from "@/components/onboarding/NormsStep";
import { ProcessesStep } from "@/components/onboarding/ProcessesStep";
import { RolesStep } from "@/components/onboarding/RolesStep";
import { Button } from "@/components/ui/Button";
import { finalizeGRPI } from "@/lib/grpi-generator";
import { isStepComplete } from "@/lib/onboarding-validation";
import { useLaunchpad } from "@/lib/store";
import type { GRPIData } from "@/lib/types";
import { cn } from "@/lib/utils";

const NEXT_LABELS = [
  "Next: Define Roles →",
  "Next: Set Up Processes →",
  "Next: Team Norms →",
  "Generate My Launchpad →",
];

export default function OnboardingPage() {
  const router = useRouter();
  const {
    state,
    setStep,
    nextStep,
    prevStep,
    generateWorkspaceFromGRPI,
  } = useLaunchpad();

  const [stepValid, setStepValid] = useState(() =>
    isStepComplete(state.currentStep, state.grpi),
  );
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [finalGrpi, setFinalGrpi] = useState<GRPIData | null>(null);

  const currentStep = state.currentStep;

  useEffect(() => {
    const valid = isStepComplete(currentStep, state.grpi);
    setStepValid(valid);
  }, [currentStep, state.grpi]);

  const handleSaveExit = () => router.push("/");

  const handleBack = () => {
    setSubmitAttempted(false);
    prevStep();
  };

  const handleComplete = useCallback(() => {
    const finalized = finalizeGRPI(state.grpi);
    if (!finalized) return;

    const success = generateWorkspaceFromGRPI();
    if (success) {
      setFinalGrpi(finalized);
      setShowCompletion(true);
    }
  }, [state.grpi, generateWorkspaceFromGRPI]);

  const handleNext = useCallback(() => {
    setSubmitAttempted(true);

    if (!isStepComplete(currentStep, state.grpi)) {
      return;
    }

    if (currentStep < 3) {
      setSubmitAttempted(false);
      nextStep();
      return;
    }

    handleComplete();
  }, [currentStep, state.grpi, nextStep, handleComplete]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (e.key !== "Enter" || e.shiftKey) return;
      if (showCompletion) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") return;

      if (stepValid) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stepValid, handleNext, showCompletion]);

  if (showCompletion && finalGrpi) {
    return <CompletionScreen grpi={finalGrpi} />;
  }

  return (
    <div id="onboarding-wizard" className="flex flex-col h-full" data-demo-target="onboarding-wizard">
      <MobileOnboardingProgress currentStep={currentStep} />

      <div className="flex flex-1 min-h-0">
        <OnboardingSidebar
          currentStep={currentStep}
          grpi={state.grpi}
          onStepClick={setStep}
          onSaveExit={handleSaveExit}
        />

        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-2xl px-6 py-8 md:py-12 pb-32 md:pb-12">
              {currentStep === 0 && (
                <GoalsStep submitAttempted={submitAttempted} />
              )}
              {currentStep === 1 && <RolesStep />}
              {currentStep === 2 && <ProcessesStep />}
              {currentStep === 3 && <NormsStep />}

              {submitAttempted && !stepValid && (
                <p
                  className="mt-6 text-sm text-error font-body"
                  role="alert"
                >
                  Please complete all required fields before continuing.
                </p>
              )}
            </div>
          </div>

          {/* Desktop footer actions */}
          <div className="hidden md:flex items-center justify-between gap-4 border-t border-border bg-surface px-8 py-4 shrink-0">
            {currentStep > 0 ? (
              <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button
              size="lg"
              disabled={!stepValid}
              onClick={handleNext}
            >
              {NEXT_LABELS[currentStep]}
            </Button>
          </div>

          {/* Mobile sticky CTA */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-[61] border-t border-border bg-surface/95 backdrop-blur-[12px] px-4 py-4 flex gap-3">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={handleBack} className="shrink-0">
                Back
              </Button>
            )}
            <Button
              size="lg"
              className={cn("flex-1", currentStep === 0 && "w-full")}
              disabled={!stepValid}
              onClick={handleNext}
            >
              {currentStep < 3 ? "Save & Continue" : "Finish Setup"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
