"use client";

import { useState } from "react";
import { Calendar, ChevronDown, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { copyToClipboard } from "@/lib/clipboard";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  formatTime,
  generateIcsContent,
  getDayLabel,
} from "@/lib/workspace-utils";
import type { GRPIData, MeetingBlock, WorkspaceData } from "@/lib/types";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

const SPRINT_PLANNING = `Sprint Planning — 30 min (Sunday)

Agenda:
1. Review backlog — what's ready to pull?
2. Set sprint goal — one sentence, shared understanding
3. Assign tasks — name + due date for each
4. Confirm owners — who is accountable for what?`;

const STANDUP_PROMPT = `Daily Standup (async)

Answer these three questions:
1. What did I complete yesterday?
2. What am I doing today?
3. Any blockers?`;

const RETRO_TEMPLATE = `Sprint Retrospective — 15 min (Saturday)

1. What worked well this sprint?
2. What didn't work — be specific?
3. What will we change next sprint? (one action item)`;

export interface MeetingCadenceProps {
  grpi: GRPIData;
  workspace: WorkspaceData;
}

export function MeetingCadence({ grpi, workspace }: MeetingCadenceProps) {
  const [expanded, setExpanded] = useState<string | null>("planning");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const schedule = workspace.meetingSchedule ?? [];

  const getBlocksForDayHour = (day: number, hour: number) =>
    schedule.filter(
      (b) =>
        b.dayOfWeek === day &&
        b.startHour <= hour &&
        b.startHour + Math.ceil(b.durationMinutes / 60) > hour,
    );

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleIcsDownload = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    weekStart.setHours(0, 0, 0, 0);

    const events = schedule.map((block) => {
      const start = new Date(weekStart);
      start.setDate(weekStart.getDate() + block.dayOfWeek);
      start.setHours(block.startHour, block.startMinute, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + block.durationMinutes);
      return {
        uid: block.id,
        title: `${block.title} — ${grpi.goals.projectName}`,
        description: block.description,
        start,
        end,
      };
    });

    const ics = generateIcsContent(events);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${grpi.goals.projectName.replace(/\s+/g, "-")}-schedule.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl text-text-primary">Weekly Schedule</h2>
          <p className="text-sm text-text-secondary font-body mt-1">
            Based on your {grpi.processes.meetingCadence.replace("-", " ")} cadence
          </p>
        </div>
        <Button
          variant="secondary"
          size="md"
          icon={<Download size={16} />}
          onClick={handleIcsDownload}
        >
          Sync to Google Calendar
        </Button>
      </div>

      {/* Week grid */}
      <div className="rounded-card border border-border bg-surface overflow-hidden">
        <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-border bg-surface-alt">
          <div />
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="py-2 text-center text-xs font-mono font-medium text-text-secondary border-l border-border"
            >
              {getDayLabel(i)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[48px_repeat(7,1fr)]">
          {HOURS.map((hour) => (
            <div key={hour} className="contents">
              <div className="py-3 pr-2 text-right text-[10px] font-mono text-text-muted border-b border-border/50">
                {formatTime(hour, 0)}
              </div>
              {Array.from({ length: 7 }, (_, day) => {
                const blocks = getBlocksForDayHour(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="relative min-h-[40px] border-l border-b border-border/50 p-0.5"
                  >
                    {blocks.map((block) => (
                      <MeetingBlockCell key={block.id} block={block} />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        <h2 className="font-display text-xl text-text-primary">Meeting Templates</h2>

        <TemplateCard
          id="planning"
          title="Sprint Planning Template"
          subtitle="Sunday · 30 min"
          expanded={expanded === "planning"}
          onToggle={() => setExpanded(expanded === "planning" ? null : "planning")}
          content={SPRINT_PLANNING}
          onCopy={() => void handleCopy(SPRINT_PLANNING, "planning")}
          copied={copiedId === "planning"}
        />

        <TemplateCard
          id="standup"
          title="Daily Standup Template"
          subtitle="Async"
          expanded={expanded === "standup"}
          onToggle={() => setExpanded(expanded === "standup" ? null : "standup")}
          content={STANDUP_PROMPT}
          onCopy={() => handleCopy(STANDUP_PROMPT, "standup")}
          copyLabel="Copy Standup Prompt"
          copied={copiedId === "standup"}
        />

        <TemplateCard
          id="retro"
          title="Sprint Retrospective Template"
          subtitle="Saturday · 15 min"
          expanded={expanded === "retro"}
          onToggle={() => setExpanded(expanded === "retro" ? null : "retro")}
          content={RETRO_TEMPLATE}
          onCopy={() => handleCopy(RETRO_TEMPLATE, "retro")}
          copied={copiedId === "retro"}
        />
      </div>
    </div>
  );
}

function MeetingBlockCell({ block }: { block: MeetingBlock }) {
  return (
    <Tooltip
      content={
        <span>
          {block.title} · {formatTime(block.startHour, block.startMinute)} ·{" "}
          {block.durationMinutes} min — {block.description}
        </span>
      }
      position="top"
    >
      <div className="rounded px-1 py-0.5 bg-accent/90 text-white text-[9px] font-body font-medium truncate cursor-default hover:bg-accent transition-colors">
        {block.title}
      </div>
    </Tooltip>
  );
}

function TemplateCard({
  id,
  title,
  subtitle,
  expanded,
  onToggle,
  content,
  onCopy,
  copyLabel = "Copy Template",
  copied = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  expanded: boolean;
  onToggle: () => void;
  content: string;
  onCopy: () => void;
  copyLabel?: string;
  copied?: boolean;
}) {
  return (
    <div className="rounded-card border border-border bg-surface overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-surface-alt transition-colors"
        aria-expanded={expanded}
        aria-controls={`template-${id}`}
      >
        <Calendar size={20} className="text-accent shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-text-primary">{title}</p>
          <p className="text-xs text-text-muted font-body">{subtitle}</p>
        </div>
        <ChevronDown
          size={18}
          className={cn(
            "text-text-muted transition-transform shrink-0",
            expanded && "rotate-180",
          )}
        />
      </button>
      {expanded && (
        <div id={`template-${id}`} className="px-5 pb-5 border-t border-border">
          <pre className="mt-4 text-sm font-body text-text-secondary whitespace-pre-wrap leading-relaxed bg-surface-alt rounded-card p-4">
            {content}
          </pre>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            icon={<Copy size={14} />}
            onClick={onCopy}
          >
            {copied ? "Copied!" : copyLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
