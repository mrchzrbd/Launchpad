"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CellValue, CoachTool } from "@/lib/tool-coach-data";
import { COMPARISON_ROWS, TOOL_META } from "@/lib/tool-coach-data";
import { cn } from "@/lib/utils";

const TOOLS: CoachTool[] = ["notion", "trello", "clickup"];

function SetupBadge({ cell }: { cell: Extract<CellValue, { type: "badge" }> }) {
  const colors = {
    easy: "bg-success/15 text-success border-success/30",
    gentle: "bg-success/15 text-success border-success/30",
    medium: "bg-warning/20 text-text-primary border-warning/40",
    moderate: "bg-warning/20 text-text-primary border-warning/40",
    hard: "bg-red-50 text-error border-red-200",
    steep: "bg-red-50 text-error border-red-200",
  };

  return (
    <div>
      <span
        className={cn(
          "inline-flex px-2 py-0.5 rounded-full text-xs font-mono font-medium border",
          colors[cell.level],
        )}
      >
        {cell.value}
      </span>
      {cell.detail && (
        <p className="text-xs text-text-muted mt-1 font-body">{cell.detail}</p>
      )}
    </div>
  );
}

function StarCell({ cell }: { cell: Extract<CellValue, { type: "stars" }> }) {
  const total = cell.total ?? 5;
  return (
    <span className="text-accent tracking-tight" aria-label={`${cell.filled} out of ${total} stars`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < cell.filled ? "opacity-100" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

function ScoreCell({
  cell,
  tool,
}: {
  cell: Extract<CellValue, { type: "score" }>;
  tool?: CoachTool;
}) {
  const pct = (cell.score / cell.max) * 100;
  return (
    <div>
      <p className="font-mono text-sm font-medium text-text-primary mb-1.5">
        {cell.score}/{cell.max}
      </p>
      <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {tool === "clickup" && cell.score === 9 && (
        <p className="text-[10px] text-text-muted mt-1 font-body italic">
          gated by setup time
        </p>
      )}
    </div>
  );
}

function renderCell(cell: CellValue, tool?: CoachTool) {
  if (typeof cell === "string") {
    return <p className="text-sm text-text-secondary font-body leading-relaxed">{cell}</p>;
  }
  if (cell.type === "badge") return <SetupBadge cell={cell} />;
  if (cell.type === "stars") return <StarCell cell={cell} />;
  if (cell.type === "score") return <ScoreCell cell={cell} tool={tool} />;
  return null;
}

export interface ComparisonTableProps {
  recommendedTool?: CoachTool;
}

export function ComparisonTable({ recommendedTool }: ComparisonTableProps) {
  const [sticky, setSticky] = useState(false);
  const [hoveredTool, setHoveredTool] = useState<CoachTool | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-text-primary mb-2">
          Honest comparison
        </h2>
        <p className="text-text-secondary font-body text-sm max-w-2xl">
          No affiliate links, no sponsored rankings — just what we&apos;ve seen work
          (and fail) across hundreds of student teams.
        </p>
      </div>

      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <div className="overflow-x-auto rounded-card border border-border bg-surface -mx-2 px-2 sm:mx-0 sm:px-0 max-w-[100vw]">
        <table className="w-full min-w-[720px] border-collapse">
          <thead
            className={cn(
              "transition-shadow duration-200",
              sticky && "sticky top-16 z-20 shadow-card bg-surface",
            )}
          >
            <tr>
              <th className="sticky left-0 z-30 text-left p-4 w-[140px] min-w-[140px] bg-surface-alt border-b border-r border-border shadow-[4px_0_8px_-4px_rgba(26,26,46,0.08)]">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                  Criteria
                </span>
              </th>
              {TOOLS.map((tool) => (
                <th
                  key={tool}
                  className={cn(
                    "p-4 text-left border-b-2 min-w-[180px] transition-colors duration-200",
                    recommendedTool === tool
                      ? "border-accent bg-accent-light/30"
                      : "border-border bg-surface-alt",
                    hoveredTool === tool && "bg-accent-light/20",
                  )}
                  onMouseEnter={() => setHoveredTool(tool)}
                  onMouseLeave={() => setHoveredTool(null)}
                >
                  {recommendedTool === tool && (
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-accent mb-1">
                      Recommended for your team
                    </span>
                  )}
                  <span className="font-display text-xl text-text-primary">
                    {TOOL_META[tool].name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-border/60 last:border-0">
                <td className="sticky left-0 z-10 p-4 font-body text-sm font-medium text-text-primary bg-surface-alt border-r border-border/60 align-top shadow-[4px_0_8px_-4px_rgba(26,26,46,0.06)]">
                  {row.label}
                </td>
                {TOOLS.map((tool) => (
                  <td
                    key={tool}
                    className={cn(
                      "p-4 align-top transition-colors duration-200",
                      recommendedTool === tool && "bg-accent-light/10",
                      hoveredTool === tool && "bg-accent-light/15",
                    )}
                    onMouseEnter={() => setHoveredTool(tool)}
                    onMouseLeave={() => setHoveredTool(null)}
                  >
                    {renderCell(row[tool], tool)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
