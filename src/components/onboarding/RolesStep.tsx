"use client";

import { ChevronDown, ChevronUp, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Tooltip } from "@/components/ui/Tooltip";
import {
  COVERAGE_FUNCTIONS,
  ROLE_DESCRIPTIONS,
  ROLE_SUGGESTIONS,
  SCRUM_ROLE_TOOLTIPS,
} from "@/lib/onboarding-constants";
import { isRolesValid } from "@/lib/onboarding-validation";
import type { TeamMember } from "@/lib/types";
import { useLaunchpad } from "@/lib/store";
import { cn } from "@/lib/utils";

function createMember(): TeamMember {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `member-${Date.now()}-${Math.random()}`,
    name: "",
    role: "",
    responsibilities: [""],
    scrumRole: "dev-team",
  };
}

function getInitialMembers(existing?: TeamMember[]): TeamMember[] {
  if (existing?.length) return existing.map((m) => ({ ...m }));
  return [createMember()];
}

function getCoverageStatus(members: TeamMember[]) {
  const combined = members
    .map((m) => `${m.role} ${m.responsibilities.join(" ")}`.toLowerCase())
    .join(" ");

  return COVERAGE_FUNCTIONS.map((fn) => {
    const covered = fn.keywords.some((kw) => combined.includes(kw));
    return { ...fn, covered };
  });
}

export interface RolesStepProps {
  onValidityChange?: (valid: boolean) => void;
}

export function RolesStep({ onValidityChange }: RolesStepProps) {
  const { state, updateRoles } = useLaunchpad();
  const [members, setMembers] = useState<TeamMember[]>(() =>
    getInitialMembers(state.grpi.roles),
  );
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [touched, setTouched] = useState(false);

  const persist = useCallback(
    (next: TeamMember[]) => {
      setMembers(next);
      updateRoles(next);
    },
    [updateRoles],
  );

  const [hydrated, setHydrated] = useState(!!state.grpi.roles?.length);

  useEffect(() => {
    if (!hydrated && state.grpi.roles?.length) {
      setMembers(getInitialMembers(state.grpi.roles));
      setHydrated(true);
    }
  }, [state.grpi.roles, hydrated]);

  useEffect(() => {
    onValidityChange?.(isRolesValid(members));
  }, [members, onValidityChange]);

  const coverage = useMemo(() => getCoverageStatus(members), [members]);

  const updateMember = (id: string, patch: Partial<TeamMember>) => {
    const next = members.map((m) => (m.id === id ? { ...m, ...patch } : m));
    persist(next);
  };

  const handleRoleSelect = (id: string, role: string) => {
    const description = ROLE_DESCRIPTIONS[role] ?? "";
    const member = members.find((m) => m.id === id);
    if (!member) return;
    updateMember(id, {
      role,
      responsibilities: description ? [description] : member.responsibilities,
    });
  };

  const moveMember = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= members.length) return;
    const next = [...members];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  };

  const addMember = () => {
    if (members.length >= 6) return;
    persist([...members, createMember()]);
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) return;
    persist(members.filter((m) => m.id !== id));
  };

  const saveOnBlur = () => {
    setTouched(true);
    persist(members);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-accent mb-2">
          Step 2 of 4 · Roles
        </p>
        <h2 className="font-display text-3xl text-text-primary mb-2">
          Who does what?
        </h2>
        <p className="text-text-secondary font-body">
          Clear ownership prevents 80% of team conflicts.
        </p>
      </header>

      {!bannerDismissed && (
        <div className="relative rounded-card bg-accent-light border border-accent/20 px-4 py-3 pr-10">
          <p className="text-sm text-text-primary font-body leading-relaxed">
            We&apos;ll map your team to Scrum roles so everyone has a clear
            ownership area — no overlap, no gaps.
          </p>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="absolute right-3 top-3 text-text-muted hover:text-text-primary"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {members.map((member, index) => (
          <article
            key={member.id}
            className="rounded-card border border-border bg-surface p-5 shadow-card space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-text-muted">
                Member {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveMember(index, "up")}
                  className="p-1.5 rounded-button text-text-muted hover:bg-surface-alt disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  type="button"
                  disabled={index === members.length - 1}
                  onClick={() => moveMember(index, "down")}
                  className="p-1.5 rounded-button text-text-muted hover:bg-surface-alt disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ChevronDown size={18} />
                </button>
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="p-1.5 rounded-button text-text-muted hover:text-error hover:bg-red-50 ml-1"
                    aria-label="Remove member"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            <Input
              label="Name"
              placeholder="Full name"
              value={member.name}
              onChange={(e) =>
                updateMember(member.id, { name: e.target.value })
              }
              onBlur={saveOnBlur}
              error={
                touched && !member.name.trim() ? "Name is required" : undefined
              }
            />

            <div>
              <label className="text-sm font-medium text-text-primary font-body mb-1.5 block">
                Role title
              </label>
              <input
                list={`roles-${member.id}`}
                value={member.role}
                onChange={(e) => handleRoleSelect(member.id, e.target.value)}
                onBlur={saveOnBlur}
                placeholder="Start typing or pick a suggestion"
                className={cn(
                  "w-full h-10 px-3 rounded-input font-body text-sm",
                  "bg-surface border border-border",
                  "focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none",
                )}
              />
              <datalist id={`roles-${member.id}`}>
                {ROLE_SUGGESTIONS.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <Textarea
              label="Role description"
              value={member.responsibilities[0] ?? ""}
              onChange={(e) =>
                updateMember(member.id, {
                  responsibilities: [e.target.value],
                })
              }
              onBlur={saveOnBlur}
              rows={3}
              error={
                touched && !member.responsibilities[0]?.trim()
                  ? "Description is required"
                  : undefined
              }
            />

            <fieldset>
              <legend className="text-sm font-medium text-text-primary font-body mb-2">
                Scrum role
              </legend>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["product-owner", "Product Owner"],
                    ["scrum-master", "Scrum Master"],
                    ["dev-team", "Dev Team"],
                  ] as const
                ).map(([value, label]) => (
                  <Tooltip
                    key={value}
                    content={SCRUM_ROLE_TOOLTIPS[value]}
                    position="top"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        updateMember(member.id, { scrumRole: value });
                        saveOnBlur();
                      }}
                      className={cn(
                        "px-3 py-2 rounded-button text-sm font-body border transition-all duration-200",
                        member.scrumRole === value
                          ? "border-accent bg-accent-light text-accent font-medium"
                          : "border-border bg-surface text-text-secondary hover:border-text-muted",
                      )}
                    >
                      {label}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </fieldset>
          </article>
        ))}
      </div>

      {members.length < 6 && (
        <button
          type="button"
          onClick={addMember}
          className="w-full py-3 rounded-card border-2 border-dashed border-border text-sm font-body text-text-secondary hover:border-accent hover:text-accent transition-colors"
        >
          + Add Team Member
        </button>
      )}

      <div className="rounded-card border border-border bg-surface-alt p-4">
        <h3 className="text-sm font-medium text-text-primary font-body mb-3">
          Role Coverage Check
        </h3>
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {coverage.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-2 text-sm font-body"
            >
              <span
                className={cn(
                  "font-mono text-xs",
                  item.covered ? "text-success" : "text-warning",
                )}
              >
                {item.covered ? "✓" : "?"}
              </span>
              <span className="text-text-secondary">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
