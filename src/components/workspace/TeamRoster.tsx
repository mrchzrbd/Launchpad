"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { getInitials } from "@/lib/workspace-utils";
import type { GRPIData, WorkspaceData } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TeamRosterProps {
  grpi: GRPIData;
  workspace: WorkspaceData;
}

type ViewMode = "cards" | "matrix";

export function TeamRoster({ grpi, workspace }: TeamRosterProps) {
  const [view, setView] = useState<ViewMode>("cards");
  const { roles, processes } = grpi;
  const matrix = workspace.raciMatrix ?? [];

  const channel = processes.communicationChannel.toLowerCase();

  return (
    <div className="space-y-6">
      {roles.length === 1 && (
        <p
          className="rounded-card border border-border bg-surface-alt px-4 py-3 text-sm text-text-secondary font-body"
          role="status"
        >
          Add more teammates in{" "}
          <a href="/onboarding" className="text-accent hover:underline">
            Edit Setup
          </a>{" "}
          to see the full role matrix.
        </p>
      )}

      <div className="inline-flex rounded-button border border-border bg-surface-alt p-1">
        {(
          [
            ["cards", "Role Cards"],
            ["matrix", "Responsibility Matrix"],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setView(mode)}
            className={cn(
              "px-4 py-2 rounded-[8px] text-sm font-body transition-all duration-200",
              view === mode
                ? "bg-surface text-text-primary font-medium shadow-card"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "cards" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((member) => (
            <article
              key={member.id}
              className="rounded-card border border-border bg-surface p-6 shadow-card hover-lift transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-text-primary text-lg font-mono font-medium text-surface">
                  {getInitials(member.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl text-text-primary leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-accent font-body font-medium text-sm mt-0.5">
                    {member.role}
                  </p>
                  <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-mono font-medium border border-accent/20">
                    {member.scrumRole === "product-owner"
                      ? "Product Owner"
                      : member.scrumRole === "scrum-master"
                        ? "Scrum Master"
                        : "Dev Team"}
                  </span>
                </div>
              </div>

              <ul className="text-sm text-text-secondary font-body space-y-1.5 list-disc list-inside mb-5">
                {member.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>

              <div className="pt-4 border-t border-border">
                <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
                  Contact
                </p>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 text-sm font-body text-accent hover:text-accent-hover transition-colors"
                >
                  <MessageCircle size={16} />
                  {channel.includes("whatsapp")
                    ? `Message on WhatsApp`
                    : channel.includes("slack")
                      ? `Message on Slack`
                      : channel.includes("email")
                        ? `Send email`
                        : `Reach via ${processes.communicationChannel}`}
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full text-sm font-body min-w-[600px]">
            <thead>
              <tr className="bg-surface-alt border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-text-primary sticky left-0 bg-surface-alt">
                  Epic / Area
                </th>
                {roles.map((member) => (
                  <th
                    key={member.id}
                    className="px-3 py-3 text-center font-mono text-xs text-text-secondary min-w-[72px]"
                  >
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-text-primary text-surface font-medium"
                      title={member.name}
                    >
                      {getInitials(member.name)}
                    </span>
                    <span className="block mt-1 text-[10px] truncate max-w-[72px]">
                      {member.name.split(" ")[0]}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.epic} className="border-b border-border/60">
                  <td className="px-4 py-3 font-medium text-text-primary sticky left-0 bg-surface">
                    {row.epic}
                  </td>
                  {roles.map((member) => {
                    const code = row.assignments[member.id] ?? "";
                    return (
                      <td key={member.id} className="px-3 py-3 text-center">
                        <RaciCell code={code} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-border bg-surface-alt flex flex-wrap gap-4 text-xs text-text-muted font-mono">
            <span>
              <strong className="text-text-primary">R</strong> = Responsible
            </span>
            <span>
              <strong className="text-text-primary">A</strong> = Accountable
            </span>
            <span>
              <strong className="text-text-primary">C</strong> = Consulted
            </span>
            <span>
              <strong className="text-text-primary">I</strong> = Informed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function RaciCell({ code }: { code: string }) {
  if (!code) return <span className="text-text-muted">—</span>;

  const styles: Record<string, string> = {
    R: "bg-accent text-white",
    A: "bg-text-primary text-surface",
    C: "bg-warning/30 text-text-primary",
    I: "bg-surface-alt text-text-muted border border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold",
        styles[code] ?? "bg-surface-alt text-text-muted",
      )}
    >
      {code}
    </span>
  );
}
