"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useLaunchpad } from "@/lib/store";
import type { TeamMember } from "@/lib/types";
import { getInitials } from "@/lib/workspace-utils";
import { cn } from "@/lib/utils";

const ROLE_SUGGESTIONS = [
  "Team Lead",
  "Researcher",
  "Designer",
  "Developer",
  "Coordinator",
  "Facilitator",
  "Creative Lead",
  "IT Support",
];

const SCRUM_ROLES = ["product-owner", "scrum-master", "dev-team"] as const;

const SCRUM_LABELS: Record<string, string> = {
  "product-owner": "Product Owner",
  "scrum-master": "Scrum Master",
  "dev-team": "Dev Team",
};

const SCRUM_COLORS: Record<string, string> = {
  "product-owner": "bg-purple-100 text-purple-800",
  "scrum-master": "bg-blue-100 text-blue-800",
  "dev-team": "bg-green-100 text-green-800",
};

function MemberModal({
  member,
  onSave,
  onClose,
}: {
  member?: TeamMember;
  onSave: (m: TeamMember) => void;
  onClose: () => void;
}) {
  const isNew = !member;
  const [name, setName] = useState(member?.name ?? "");
  const [role, setRole] = useState(member?.role ?? "");
  const [scrumRole, setScrumRole] = useState<TeamMember["scrumRole"]>(
    member?.scrumRole ?? "dev-team",
  );
  const [responsibilities, setResponsibilities] = useState<string[]>(
    member?.responsibilities ?? [],
  );
  const [newResp, setNewResp] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const addResp = () => {
    if (!newResp.trim()) return;
    setResponsibilities((prev) => [...prev, newResp.trim()]);
    setNewResp("");
  };

  const removeResp = (i: number) =>
    setResponsibilities((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!name.trim() || !role.trim()) return;
    onSave({
      id: member?.id ?? `member-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      scrumRole,
      responsibilities: responsibilities.filter(Boolean),
    });
  };

  const fieldClass =
    "w-full px-3 py-2.5 bg-background border border-border rounded-lg font-body text-sm text-text-primary focus:outline-none focus:border-accent";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-text-primary/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-card-hover">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg text-text-primary">
            {isNew ? "Add Team Member" : "Edit Member"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-alt"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
          {name && (
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-text-primary font-mono text-xl font-bold text-background">
                {getInitials(name)}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Full Name *
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Anna Snodgrass"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Role Title *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              list="role-suggestions"
              placeholder="e.g. Team Lead"
              className={fieldClass}
            />
            <datalist id="role-suggestions">
              {ROLE_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Scrum Role
            </label>
            <div className="flex gap-2">
              {SCRUM_ROLES.map((sr) => (
                <button
                  key={sr}
                  type="button"
                  onClick={() => setScrumRole(sr)}
                  className={cn(
                    "flex-1 rounded-lg px-2 py-1.5 font-body text-xs font-medium transition-all",
                    scrumRole === sr
                      ? SCRUM_COLORS[sr]
                      : "bg-surface-alt text-text-secondary hover:bg-border",
                  )}
                >
                  {SCRUM_LABELS[sr]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Responsibilities
            </label>
            <div className="mb-2 space-y-1.5">
              {responsibilities.map((r, i) => (
                <div key={`${r}-${i}`} className="group flex items-center gap-2">
                  <span className="shrink-0 text-xs text-accent">→</span>
                  <span className="flex-1 font-body text-sm text-text-primary">{r}</span>
                  <button
                    type="button"
                    onClick={() => removeResp(i)}
                    className="text-text-muted opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                    aria-label="Remove responsibility"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newResp}
                onChange={(e) => setNewResp(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addResp();
                  }
                }}
                placeholder="Add responsibility..."
                className={cn(fieldClass, "flex-1 py-2")}
              />
              <button
                type="button"
                onClick={addResp}
                className="rounded-lg bg-surface-alt px-3 py-2 transition-colors hover:bg-border"
                aria-label="Add responsibility"
              >
                <Plus className="h-4 w-4 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-body text-sm text-text-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || !role.trim()}
            className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isNew ? "Add Member" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamRoster() {
  const { state, dispatch } = useLaunchpad();
  const members = state.grpi.roles ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSave = (m: TeamMember) => {
    if (editingMember) {
      dispatch({ type: "EDIT_MEMBER", memberId: m.id, updates: m });
    } else {
      dispatch({ type: "ADD_MEMBER", member: m });
    }
    setModalOpen(false);
    setEditingMember(undefined);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_MEMBER", memberId: id });
    setDeletingId(null);
  };

  const openAdd = () => {
    setEditingMember(undefined);
    setModalOpen(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl text-text-primary">Team Members</h2>
          <p className="font-body text-sm text-text-muted mt-0.5">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg font-body text-sm font-semibold hover:bg-accent-hover transition-colors min-h-[44px] shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <article
            key={member.id}
            className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/30 hover:shadow-card-hover"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-text-primary font-mono text-sm font-bold text-background">
                  {getInitials(member.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-display text-base text-text-primary leading-tight truncate">
                    {member.name}
                  </p>
                  <p className="font-body text-sm font-medium text-accent">{member.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(member)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-surface-alt hover:text-text-primary transition-colors"
                  aria-label={`Edit ${member.name}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(member.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {member.scrumRole && (
              <span
                className={cn(
                  "mb-3 inline-block rounded-full px-2.5 py-1 font-body text-xs font-medium",
                  SCRUM_COLORS[member.scrumRole],
                )}
              >
                {SCRUM_LABELS[member.scrumRole]}
              </span>
            )}

            {member.responsibilities.length > 0 && (
              <div className="space-y-1">
                {member.responsibilities.map((r, i) => (
                  <div key={`${r}-${i}`} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-xs text-accent">→</span>
                    <span className="font-body text-xs text-text-secondary leading-relaxed">
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {deletingId === member.id && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                <span className="font-body text-sm font-medium text-red-600">
                  Remove {member.name.split(" ")[0]}?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(member.id)}
                    className="rounded-lg bg-red-600 px-3 py-1 font-body text-xs font-semibold text-white hover:bg-red-700 min-h-[44px]"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(null)}
                    className="px-3 py-1 font-body text-xs text-text-muted min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}

        {members.length === 0 && (
          <div className="col-span-full rounded-2xl border-2 border-dashed border-border py-16 text-center">
            <p className="font-body text-sm text-text-muted">No team members yet</p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-3 font-body text-sm text-accent hover:underline min-h-[44px]"
            >
              Add your first team member →
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <MemberModal
          member={editingMember}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingMember(undefined);
          }}
        />
      )}
    </div>
  );
}
