"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { useLaunchpad } from "@/lib/store";
import type { KanbanTask } from "@/lib/types";
import { cn } from "@/lib/utils";

const DEFAULT_EPICS = [
  "Research",
  "Strategy",
  "Design",
  "Build",
  "Process",
  "Delivery",
  "Team Setup",
];

const PRIORITIES = ["low", "medium", "high", "critical"] as const;

export interface TaskEditModalProps {
  task: KanbanTask;
  columnId: string;
  onClose: () => void;
}

function priorityActiveStyle(p: string): string {
  const map: Record<string, string> = {
    low: "bg-gray-200 text-gray-800",
    medium: "bg-blue-200 text-blue-800",
    high: "bg-orange-200 text-orange-800",
    critical: "bg-red-200 text-red-800",
  };
  return map[p] ?? "bg-surface-alt text-text-secondary";
}

function toDateInputValue(dateStr?: string): string {
  if (!dateStr) return "";
  return dateStr.split("T")[0] ?? "";
}

export function TaskEditModal({ task, columnId, onClose }: TaskEditModalProps) {
  const { dispatch, state } = useLaunchpad();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [epic, setEpic] = useState(task.epic ?? "");
  const [assignee, setAssignee] = useState(task.assignee ?? "");
  const [dueDate, setDueDate] = useState(toDateInputValue(task.dueDate));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const members = state.grpi.roles ?? [];
  const workspaceEpics = state.workspace?.epics ?? [];
  const epics = Array.from(new Set([...DEFAULT_EPICS, ...workspaceEpics])).sort();

  const handleSave = () => {
    if (!title.trim()) return;
    dispatch({
      type: "EDIT_TASK",
      columnId,
      taskId: task.id,
      updates: {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        epic: epic || undefined,
        assignee: assignee || undefined,
        dueDate: dueDate || undefined,
      },
    });
    onClose();
  };

  const handleDelete = () => {
    dispatch({
      type: "DELETE_TASK",
      columnId,
      taskId: task.id,
    });
    onClose();
  };

  const fieldClass =
    "w-full px-3 py-2.5 bg-background border border-border rounded-lg font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-edit-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-text-primary/50 backdrop-blur-sm" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-card-hover">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="task-edit-title" className="font-display text-lg text-text-primary">
            Edit Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-alt hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add more detail..."
              className={cn(fieldClass, "resize-none placeholder:text-text-muted")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Priority
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "rounded-full px-2.5 py-1 font-mono text-xs font-semibold capitalize transition-all",
                      priority === p
                        ? priorityActiveStyle(p)
                        : "bg-surface-alt text-text-secondary hover:bg-border",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Epic
              </label>
              <select
                value={epic}
                onChange={(e) => setEpic(e.target.value)}
                className={cn(fieldClass, "py-2")}
              >
                <option value="">No epic</option>
                {epics.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className={cn(fieldClass, "py-2")}
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={cn(fieldClass, "py-2")}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 font-body text-sm text-text-muted transition-colors hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-body text-sm font-medium text-red-600">
                Delete this task?
              </span>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-3 py-1 font-body text-xs font-semibold text-white transition-colors hover:bg-red-700"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg px-3 py-1 font-body text-xs text-text-muted transition-colors hover:text-text-primary"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-body text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!title.trim()}
              className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
