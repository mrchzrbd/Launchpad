"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { TEMPLATE_LABELS } from "@/lib/onboarding-constants";
import type { GRPIData } from "@/lib/types";
import { getDaysUntilDeadline } from "@/lib/workspace-utils";

export interface CompletionScreenProps {
  grpi: GRPIData;
}

export function CompletionScreen({ grpi }: CompletionScreenProps) {
  const router = useRouter();
  const daysLeft = getDaysUntilDeadline(grpi.goals.deadline);

  useEffect(() => {
    const navTimer = setTimeout(() => router.push("/workspace"), 4000);
    return () => clearTimeout(navTimer);
  }, [router]);

  const goToWorkspace = () => router.push("/workspace");

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-text-primary px-6"
      role="status"
      aria-live="polite"
      aria-label="Onboarding complete"
    >
      <div className="max-w-lg w-full text-center">
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-background/30"
            aria-hidden="true"
          >
            <svg
              className="h-14 w-14 text-background"
              viewBox="0 0 52 52"
              fill="none"
              width={56}
              height={56}
            >
              <circle
                cx="26"
                cy="26"
                r="24"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-30"
              />
              <path
                d="M14 27 L22 35 L38 18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="completion-checkmark-draw"
                fill="none"
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          className="font-display text-4xl md:text-5xl text-background mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45 }}
        >
          Your Launchpad is&nbsp;ready.
        </motion.h1>

        <motion.p
          className="font-body text-lg text-background/75 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.45 }}
        >
          We&apos;ve built your workspace based on your GRPI setup. Let&apos;s&nbsp;go.
        </motion.p>

        <motion.div
          className="mb-10 grid grid-cols-2 gap-4 text-left rounded-card border border-background/15 bg-background/5 p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.4 }}
        >
          <div>
            <p className="text-xs font-mono text-background/50 uppercase tracking-wider mb-1">
              Team
            </p>
            <p className="text-sm font-medium text-background font-body truncate">
              {grpi.goals.projectName}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-background/50 uppercase tracking-wider mb-1">
              Members
            </p>
            <p className="text-sm font-medium text-background font-body">
              {grpi.roles.length} people
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-background/50 uppercase tracking-wider mb-1">
              Template
            </p>
            <p className="text-sm font-medium text-background font-body">
              {TEMPLATE_LABELS[grpi.goals.projectTemplate]}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-background/50 uppercase tracking-wider mb-1">
              Deadline
            </p>
            <p className="text-sm font-medium text-background font-body">
              {daysLeft !== null
                ? daysLeft > 0
                  ? `${daysLeft} days left`
                  : daysLeft === 0
                    ? "Due today"
                    : "⚠ Deadline passed"
                : new Date(grpi.goals.deadline).toLocaleDateString()}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.45 }}
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent-hover shadow-button text-base px-8 min-h-[48px]"
            onClick={goToWorkspace}
          >
            View Your Workspace →
          </Button>
          <p className="mt-4 text-xs text-background/50 font-mono">
            Auto-redirecting in a few seconds…
          </p>
        </motion.div>
      </div>
    </div>
  );
}
