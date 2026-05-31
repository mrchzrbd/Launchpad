"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DeadlineCountdown } from "@/components/workspace/DeadlineCountdown";
import { TruncatedText } from "@/components/ui/TruncatedText";
import { getTemplateLabel } from "@/lib/workspace-utils";
import type { GRPIData } from "@/lib/types";

export interface WorkspaceHeaderProps {
  grpi: GRPIData;
  onExportPdf: () => void;
}

export function WorkspaceHeader({ grpi, onExportPdf }: WorkspaceHeaderProps) {
  const goals = grpi.goals;

  return (
    <div
      data-print-hide
      className="workspace-title-strip border-b border-border bg-background px-6 py-4"
    >
      <div className="mx-auto max-w-7xl flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between min-w-0">
        <div className="min-w-0 flex-1">
          <TruncatedText
            text={goals?.projectName ?? "Your Workspace"}
            maxLength={56}
            as="h1"
            className="font-display text-2xl md:text-3xl text-text-primary block"
          />
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {goals?.projectTemplate && (
              <Badge color="#4A4A6A">
                {getTemplateLabel(goals.projectTemplate)}
              </Badge>
            )}
            <DeadlineCountdown deadline={goals?.deadline} />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="md"
            type="button"
            onClick={onExportPdf}
            icon={<Download size={16} />}
            aria-label="Export team charter as PDF"
          >
            Export PDF
          </Button>
          <Link href="/onboarding">
            <Button variant="ghost" size="md" type="button">
              Edit Setup
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
