"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { DEMO_TOUR_STEPS, type TourStep } from "@/lib/demo-data";
import { useDemoMode, type WorkspaceTourTab } from "@/lib/demo-mode";

function getTooltipPosition(
  rect: DOMRect,
  position: TourStep["position"],
): CSSProperties {
  const gap = 16;
  const maxLeft = Math.max(16, Math.min(rect.left, window.innerWidth - 304));

  switch (position) {
    case "bottom":
      return { left: maxLeft, top: rect.bottom + gap, width: 288 };
    case "top":
      return {
        left: maxLeft,
        top: Math.max(16, rect.top - gap),
        width: 288,
        transform: "translateY(-100%)",
      };
    case "right":
      return { left: rect.right + gap, top: rect.top, width: 288 };
    case "left":
      return {
        left: Math.max(16, rect.left - gap - 288),
        top: rect.top,
        width: 288,
      };
    default:
      return { left: maxLeft, top: rect.bottom + gap, width: 288 };
  }
}

export function DemoTour() {
  const router = useRouter();
  const pathname = usePathname();
  const maskId = useId().replace(/:/g, "");
  const {
    tourActive,
    tourStep,
    endTour,
    nextTourStep,
    prevTourStep,
    setWorkspaceTourTab,
  } = useDemoMode();

  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const step = DEMO_TOUR_STEPS[tourStep];
  const isLast = tourStep === DEMO_TOUR_STEPS.length - 1;

  const runStepSetup = useCallback(
    (current: TourStep) => {
      if (current.workspaceTab) {
        setWorkspaceTourTab(current.workspaceTab as WorkspaceTourTab);
      }
      if (pathname !== current.path) {
        router.push(current.path);
      }
    },
    [pathname, router, setWorkspaceTourTab],
  );

  const measureTarget = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) {
      setRect(null);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      setRect(el.getBoundingClientRect());
    }, 400);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!tourActive || !step) return;
    runStepSetup(step);
  }, [tourActive, tourStep, step, runStepSetup]);

  useEffect(() => {
    if (!tourActive || !step) return;
    const delay = pathname === step.path ? 150 : 500;
    const timer = window.setTimeout(() => measureTarget(step.targetId), delay);
    return () => window.clearTimeout(timer);
  }, [tourActive, tourStep, step, pathname, measureTarget]);

  useEffect(() => {
    if (!tourActive) return;
    const onResize = () => {
      if (!step) return;
      const el = document.getElementById(step.targetId);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [tourActive, step]);

  const handleNext = () => {
    if (isLast) {
      endTour();
    } else {
      nextTourStep();
    }
  };

  if (!mounted || !tourActive || !step) return null;

  const padding = 8;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label="Demo tour"
    >
      {rect ? (
        <>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-auto"
            aria-hidden="true"
            onClick={handleNext}
          >
            <defs>
              <mask id={maskId}>
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={rect.left - padding}
                  y={rect.top - padding}
                  width={rect.width + padding * 2}
                  height={rect.height + padding * 2}
                  rx="12"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(26,26,46,0.75)"
              mask={`url(#${maskId})`}
            />
          </svg>

          <div
            className="absolute rounded-card ring-2 ring-accent pointer-events-none transition-all duration-300"
            style={{
              left: rect.left - padding,
              top: rect.top - padding,
              width: rect.width + padding * 2,
              height: rect.height + padding * 2,
            }}
          />

          <div
            className="absolute bg-surface rounded-card shadow-card-hover p-5 pointer-events-auto border border-border"
            style={getTooltipPosition(rect, step.position)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                {tourStep + 1} / {DEMO_TOUR_STEPS.length}
              </span>
              <button
                type="button"
                onClick={endTour}
                className="text-text-muted hover:text-text-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Exit tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-display text-lg text-text-primary mb-1">{step.title}</h3>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              {step.description}
            </p>
            <div className="flex items-center justify-between mt-4 gap-2">
              <button
                type="button"
                onClick={prevTourStep}
                disabled={tourStep === 0}
                className="font-body text-sm text-text-muted hover:text-text-primary disabled:opacity-30 min-h-[44px] px-2"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-accent text-white font-body text-sm font-semibold px-4 py-2 min-h-[44px] rounded-button hover:bg-accent-hover transition-colors"
              >
                {isLast ? "Finish Tour" : "Next →"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-text-primary/75 flex items-center justify-center pointer-events-auto">
          <p className="text-background font-body text-sm">Loading tour step…</p>
        </div>
      )}
    </div>,
    document.body,
  );
}
