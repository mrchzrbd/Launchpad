"use client";

import { useRef, useState } from "react";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { copyToClipboard } from "@/lib/clipboard";
import { TEMPLATE_LABELS } from "@/lib/onboarding-constants";
import type { GRPIData } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TeamCharterProps {
  grpi: GRPIData;
  generatedAt: string;
}

function getConflictLabel(value: string): string {
  const map: Record<string, string> = {
    "group-immediately": "Raise it in the group immediately",
    "direct-first": "Speak directly to the person first",
    "team-lead": "Bring it to the Team Lead",
    retrospective: "Wait for the weekly retrospective",
  };
  return map[value] ?? value;
}

function getDecisionLabel(value: string): string {
  const map: Record<string, string> = {
    consensus: "Consensus — we discuss until everyone agrees",
    "team-lead": "Team Lead decides — after hearing all views",
    majority: "Majority vote — 3 out of 5 is enough",
    delegated: "Delegated — whoever owns the task decides",
  };
  return map[value] ?? value;
}

function getFeedbackLabel(value: string): string {
  const map: Record<string, string> = {
    direct: "Direct & verbal (in meetings)",
    structured: "Structured (written, with template)",
    "async-written": "Async written (comments in docs)",
    retrospectives: "Sprint retrospectives only",
  };
  return map[value] ?? value;
}

export function TeamCharter({ grpi, generatedAt }: TeamCharterProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { goals, roles, processes, norms } = grpi;

  const formattedDate = new Date(generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const buildPlainText = () => {
    const lines = [
      `TEAM CHARTER — ${goals.projectName}`,
      `${TEMPLATE_LABELS[goals.projectTemplate]} · Generated ${formattedDate}`,
      "",
      "OUR PURPOSE",
      goals.primaryGoal,
      "",
      "SUCCESS CRITERIA",
      ...goals.successCriteria.map((c) => `• ${c}`),
      "",
      "CONSTRAINTS",
      ...goals.constraints.map((c) => `• ${c}`),
      "",
      "TEAM MEMBERS",
      ...roles.map(
        (m) =>
          `${m.name} — ${m.role}\n${m.responsibilities.map((r) => `  • ${r}`).join("\n")}`,
      ),
      "",
      "WAYS OF WORKING",
      `Communication: ${processes.communicationChannel}`,
      `Meetings: ${processes.meetingCadence}`,
      `Decisions: ${getDecisionLabel(processes.decisionMaking)}`,
      `Files: ${processes.fileStorage}`,
      `Feedback: ${getFeedbackLabel(processes.feedbackStyle)}`,
      "",
      "TEAM NORMS",
      `Response time: ${norms.responseTime}`,
      norms.workingHours,
      getConflictLabel(norms.conflictResolution),
      ...norms.customNorms.map((n) => `• ${n}`),
      "",
      "AI USE POLICY",
      processes.aiPolicy,
    ];
    return lines.join("\n");
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildPlainText());
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div data-print-hide className="flex flex-wrap gap-3">
        <Button variant="secondary" size="md" onClick={handleCopy} icon={<Copy size={16} />}>
          {copied ? "Copied!" : "Copy as Text"}
        </Button>
        <Button variant="secondary" size="md" onClick={handlePrint} icon={<Download size={16} />}>
          Download as PDF
        </Button>
      </div>

      <div
        ref={printRef}
        id="team-charter-document"
        data-print-header={`${goals.projectName} · Generated ${formattedDate}`}
        className={cn(
          "relative overflow-hidden rounded-card border border-border",
          "bg-[#FFFDF9] px-8 py-10 md:px-14 md:py-14 shadow-card print:shadow-none print:border-none",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display text-[5rem] md:text-[7rem] text-text-primary/[0.03] whitespace-nowrap -rotate-[28deg] select-none"
          >
            TEAM TSCHÜSS
          </span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-10 text-text-primary">
          <header className="border-b border-border pb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
              Team Charter
            </p>
            <h1 className="font-display text-4xl mb-2">{goals.projectName}</h1>
            <p className="text-text-secondary font-body">
              {TEMPLATE_LABELS[goals.projectTemplate]} · Generated {formattedDate} ·
              Deadline {goals.deadline}
            </p>
          </header>

          <section>
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border/60">
              1. Our Purpose
            </h2>
            <p className="font-body text-text-secondary leading-relaxed text-lg mb-6">
              {goals.primaryGoal}
            </p>
            <h3 className="font-body font-semibold text-text-primary mb-2">
              Success Criteria
            </h3>
            <ol className="list-decimal list-inside space-y-1 font-body text-text-secondary mb-6">
              {goals.successCriteria.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            <h3 className="font-body font-semibold text-text-primary mb-2">
              Constraints
            </h3>
            <ol className="list-decimal list-inside space-y-1 font-body text-text-secondary">
              {goals.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-6 pb-2 border-b border-border/60">
              2. Team Members & Roles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {roles.map((member) => (
                <div
                  key={member.id}
                  className="rounded-card border border-border bg-surface/60 p-4"
                >
                  <h3 className="font-display text-xl text-text-primary">
                    {member.name}
                  </h3>
                  <p className="text-accent font-body font-medium text-sm mt-0.5">
                    {member.role}
                  </p>
                  <p className="font-mono text-[10px] text-text-muted uppercase mt-1 mb-3">
                    {member.scrumRole === "product-owner"
                      ? "Product Owner"
                      : member.scrumRole === "scrum-master"
                        ? "Scrum Master"
                        : "Dev Team"}
                  </p>
                  <ul className="text-sm text-text-secondary font-body space-y-1 list-disc list-inside">
                    {member.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border/60">
              3. Ways of Working
            </h2>
            <p className="font-body text-text-secondary leading-relaxed mb-6">
              We communicate via <strong>{processes.communicationChannel}</strong>.
              Our meeting cadence is <strong>{processes.meetingCadence.replace("-", " ")}</strong>.
              Decisions: <strong>{getDecisionLabel(processes.decisionMaking)}</strong>.
              Files live in <strong>{processes.fileStorage}</strong>. Feedback through{" "}
              <strong>{getFeedbackLabel(processes.feedbackStyle)}</strong>.
            </p>
            <div className="overflow-x-auto rounded-card border border-border">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="bg-surface-alt">
                    <th className="text-left px-4 py-2 font-medium">Area</th>
                    <th className="text-left px-4 py-2 font-medium">Agreement</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary">
                  {[
                    ["Communication", processes.communicationChannel],
                    ["Meetings", processes.meetingCadence],
                    ["Decisions", getDecisionLabel(processes.decisionMaking)],
                    ["File storage", processes.fileStorage],
                    ["Feedback", getFeedbackLabel(processes.feedbackStyle)],
                  ].map(([area, val]) => (
                    <tr key={area} className="border-t border-border">
                      <td className="px-4 py-2 font-medium text-text-primary">{area}</td>
                      <td className="px-4 py-2">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border/60">
              4. Team Norms
            </h2>
            <ol className="space-y-3 font-body text-text-secondary list-decimal list-inside">
              <li>
                <strong className="text-text-primary">Response time:</strong>{" "}
                {norms.responseTime}
              </li>
              <li>
                <strong className="text-text-primary">Working hours:</strong>{" "}
                {norms.workingHours}
              </li>
              <li>
                <strong className="text-text-primary">Conflict resolution:</strong>{" "}
                {getConflictLabel(norms.conflictResolution)}
              </li>
              <li>
                <strong className="text-text-primary">Commitment:</strong>{" "}
                {norms.commitmentLevel}
              </li>
              {norms.customNorms.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4 pb-2 border-b border-border/60">
              5. AI Use Policy
            </h2>
            <p className="font-body text-text-secondary leading-relaxed whitespace-pre-wrap">
              {processes.aiPolicy}
            </p>
          </section>

          <footer className="pt-8 border-t border-border text-center">
            <p className="text-xs font-mono text-text-muted">
              Generated by The Digital Collaboration Launchpad · {formattedDate}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
