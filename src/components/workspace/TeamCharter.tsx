"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, Download, Pencil, Plus, Trash2 } from "lucide-react";
import { useLaunchpad } from "@/lib/store";
import { buildCharterPlainText } from "@/lib/charter-utils";
import { copyToClipboard } from "@/lib/clipboard";
import { finalizeGRPI } from "@/lib/grpi-generator";
import type { TeamCharterData } from "@/lib/types";
import { cn } from "@/lib/utils";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="font-display text-lg text-text-primary mb-3 pb-2 border-b border-border">
        {title}
      </h3>
      {children}
    </div>
  );
}

function EditableText({
  value,
  section,
  placeholder,
  multiline = false,
  className = "",
  onSave,
}: {
  value: string;
  section: keyof TeamCharterData;
  placeholder: string;
  multiline?: boolean;
  className?: string;
  onSave: (section: keyof TeamCharterData, value: string | string[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const save = () => {
    setIsEditing(false);
    if (draft.trim() !== value) {
      onSave(section, draft.trim());
    }
  };

  const cancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const inputClass = cn(
    "w-full px-3 py-2 bg-background border border-accent rounded-lg font-body text-sm text-text-primary focus:outline-none",
    className,
  );

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Escape") cancel();
        }}
        rows={4}
        className={cn(inputClass, "resize-none")}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className={inputClass}
      />
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
      className={cn("group cursor-text flex items-start gap-2", className)}
    >
      <span
        className={cn(
          "flex-1 font-body text-sm text-text-primary leading-relaxed",
          !value && "text-text-muted italic",
        )}
      >
        {value || placeholder}
      </span>
      <Pencil className="w-3.5 h-3.5 text-border group-hover:text-accent transition-colors mt-0.5 shrink-0" />
    </div>
  );
}

function EditableList({
  items,
  section,
  placeholder,
  addLabel,
  onSave,
}: {
  items: string[];
  section: keyof TeamCharterData;
  placeholder: string;
  addLabel: string;
  onSave: (section: keyof TeamCharterData, value: string | string[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState("");

  const saveEdit = (index: number) => {
    const updated = [...items];
    updated[index] = draft.trim();
    onSave(section, updated.filter(Boolean));
    setEditingIndex(null);
  };

  const deleteItem = (index: number) => {
    onSave(
      section,
      items.filter((_, i) => i !== index),
    );
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    onSave(section, [...items, newItem.trim()]);
    setNewItem("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center gap-2 group">
          <span className="text-accent font-mono text-xs mt-0.5 shrink-0">→</span>
          {editingIndex === i ? (
            <input
              autoFocus
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => saveEdit(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit(i);
                if (e.key === "Escape") setEditingIndex(null);
              }}
              className="flex-1 px-2 py-1 bg-background border border-accent rounded-lg font-body text-sm text-text-primary focus:outline-none"
            />
          ) : (
            <>
              <span
                role="button"
                tabIndex={0}
                onClick={() => {
                  setEditingIndex(i);
                  setDraft(item);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingIndex(i);
                    setDraft(item);
                  }
                }}
                className="flex-1 font-body text-sm text-text-primary cursor-text hover:text-accent transition-colors"
              >
                {item}
              </span>
              <button
                type="button"
                onClick={() => deleteItem(i)}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Delete ${item}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="flex items-center gap-2">
          <span className="text-accent font-mono text-xs shrink-0">→</span>
          <input
            autoFocus
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addItem();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewItem("");
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-2 py-1 bg-background border border-accent rounded-lg font-body text-sm text-text-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={addItem}
            className="text-accent min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Confirm"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setNewItem("");
            }}
            className="text-text-muted min-h-[44px] px-2"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 font-body text-xs text-text-muted hover:text-accent transition-colors mt-1 min-h-[44px]"
        >
          <Plus className="w-3.5 h-3.5" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

export function TeamCharter() {
  const { state, dispatch } = useLaunchpad();
  const grpi = finalizeGRPI(state.grpi);
  const [copied, setCopied] = useState(false);

  if (!grpi || !state.workspace) {
    return null;
  }

  const charter = state.workspace.charter ?? {};
  const generatedAt = state.workspace.generatedAt;

  const saveSection = (section: keyof TeamCharterData, value: string | string[]) => {
    dispatch({ type: "UPDATE_CHARTER_SECTION", section, value });
  };

  const handleCopy = async () => {
    const text = buildCharterPlainText(grpi, charter);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto" id="team-charter-tab">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="font-body text-sm text-text-muted">
          Click any field to edit it directly
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg font-body text-sm text-text-secondary hover:border-text-primary transition-colors min-h-[44px]"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy as text"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 bg-text-primary text-background rounded-lg font-body text-sm font-medium hover:opacity-90 transition-colors min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div
        className="bg-surface rounded-2xl border border-border p-6 sm:p-8 print:shadow-none print:border-0"
        data-print-charter
      >
        <div className="text-center mb-8 pb-6 border-b border-border">
          <p className="font-mono text-xs text-text-muted uppercase tracking-widest mb-2">
            Team Charter
          </p>
          <h1 className="font-display text-3xl text-text-primary">
            {grpi.goals.projectName}
          </h1>
          <p className="font-body text-sm text-text-secondary mt-2">
            {grpi.roles.map((r) => r.name).join(" · ")}
          </p>
          <p className="font-mono text-xs text-text-muted mt-2">
            Generated {formattedDate}
          </p>
        </div>

        <Section title="Our Purpose">
          <EditableText
            value={charter.purpose ?? grpi.goals.primaryGoal ?? ""}
            section="purpose"
            placeholder="Click to add your team's purpose..."
            multiline
            onSave={saveSection}
          />
        </Section>

        <Section title="Success Criteria">
          <EditableList
            items={charter.successCriteria ?? grpi.goals.successCriteria ?? []}
            section="successCriteria"
            placeholder="Add a success criterion..."
            addLabel="Add criterion"
            onSave={saveSection}
          />
        </Section>

        <Section title="Constraints">
          <EditableList
            items={charter.constraints ?? grpi.goals.constraints ?? []}
            section="constraints"
            placeholder="Add a constraint..."
            addLabel="Add constraint"
            onSave={saveSection}
          />
        </Section>

        <Section title="Ways of Working">
          <div className="space-y-4">
            <div>
              <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Communication
              </p>
              <EditableText
                value={
                  charter.communicationNorms ??
                  `Primary channel: ${grpi.processes.communicationChannel}. Response within ${grpi.norms.responseTime}.`
                }
                section="communicationNorms"
                placeholder="Describe your communication norms..."
                multiline
                onSave={saveSection}
              />
            </div>
            <div>
              <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Meetings
              </p>
              <EditableText
                value={
                  charter.meetingNorms ??
                  `We meet ${grpi.processes.meetingCadence}. Meetings are called only when necessary and kept short.`
                }
                section="meetingNorms"
                placeholder="Describe your meeting norms..."
                multiline
                onSave={saveSection}
              />
            </div>
            <div>
              <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Feedback
              </p>
              <EditableText
                value={
                  charter.feedbackNorms ??
                  `Feedback style: ${grpi.processes.feedbackStyle}. We give feedback as we go.`
                }
                section="feedbackNorms"
                placeholder="Describe your feedback approach..."
                multiline
                onSave={saveSection}
              />
            </div>
            <div>
              <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Conflict Resolution
              </p>
              <EditableText
                value={charter.conflictResolution ?? grpi.norms.conflictResolution ?? ""}
                section="conflictResolution"
                placeholder="Describe how you handle conflict..."
                multiline
                onSave={saveSection}
              />
            </div>
          </div>
        </Section>

        <Section title="Team Norms">
          <EditableList
            items={charter.customNorms ?? grpi.norms.customNorms ?? []}
            section="customNorms"
            placeholder="Add a team norm..."
            addLabel="Add norm"
            onSave={saveSection}
          />
        </Section>

        <Section title="AI Use Policy">
          <EditableText
            value={charter.aiPolicy ?? grpi.processes.aiPolicy ?? ""}
            section="aiPolicy"
            placeholder="Describe your team's AI use policy..."
            multiline
            onSave={saveSection}
          />
        </Section>

        <div className="mt-8 pt-4 border-t border-border text-center">
          <p className="font-mono text-xs text-text-muted">
            Digital Collaboration Launchpad · Team Tschüss · ESCP Berlin
          </p>
        </div>
      </div>
    </div>
  );
}
