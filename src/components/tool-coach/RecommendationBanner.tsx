"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { CoachTool } from "@/lib/tool-coach-data";
import { TOOL_META } from "@/lib/tool-coach-data";
import type { ToolRecommendation } from "@/lib/tool-recommendation";

export interface RecommendationBannerProps {
  recommendation: ToolRecommendation;
}

export function RecommendationBanner({ recommendation }: RecommendationBannerProps) {
  const meta = TOOL_META[recommendation.tool];

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full rounded-card bg-text-primary text-background overflow-hidden shadow-card-hover"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 p-8 md:p-10 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-background/60 mb-3">
            Based on your team&apos;s setup
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-background mb-3">
            {recommendation.headline}
          </h2>
          <p className="font-body text-background/80 leading-relaxed max-w-xl">
            {recommendation.reason}
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
          <ToolBadge tool={recommendation.tool} />
          <Link href={meta.signupUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent-hover shadow-button whitespace-nowrap"
            >
              Get Started with {meta.name}
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

function ToolBadge({ tool }: { tool: CoachTool }) {
  const meta = TOOL_META[tool];
  const colors: Record<CoachTool, string> = {
    notion: "bg-background text-text-primary",
    trello: "bg-[#0079BF] text-white",
    clickup: "bg-[#7B68EE] text-white",
  };

  return (
    <div
      className={`flex h-20 w-20 items-center justify-center rounded-card text-3xl font-display font-bold shadow-card ${colors[tool]}`}
      aria-label={meta.name}
    >
      {meta.badgeLabel}
    </div>
  );
}
