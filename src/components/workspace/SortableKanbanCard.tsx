"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getEpicColor, getInitials } from "@/lib/workspace-utils";
import type { KanbanTask } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface SortableKanbanCardProps {
  task: KanbanTask;
  columnId: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onDelete?: () => void;
  onMoveColumn?: (direction: "left" | "right") => void;
}

export function SortableKanbanCard({
  task,
  columnId,
  isFocused,
  onFocus,
  onDelete,
  onMoveColumn,
}: SortableKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task, columnId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}`}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onFocus?.();
        }
        if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          onDelete?.();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          onMoveColumn?.("left");
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          onMoveColumn?.("right");
        }
      }}
      className={cn(
        "kanban-card-root rounded-card border bg-surface p-3 shadow-card outline-none",
        isDragging
          ? "border-accent/40 shadow-card-hover z-50"
          : "border-border",
        isFocused && "ring-[3px] ring-accent/40 ring-offset-2",
      )}
      data-task-id={task.id}
      data-column-id={columnId}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className="shrink-0 flex h-11 w-8 items-center justify-center text-text-muted hover:text-text-secondary cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
          aria-label={`Drag task ${task.title}`}
        >
          <GripVertical size={16} />
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-sm font-semibold text-text-primary font-body leading-snug">
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {task.epic && (
              <span
                className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium text-white"
                style={{ backgroundColor: getEpicColor(task.epic) }}
              >
                {task.epic}
              </span>
            )}
            <Badge priority={task.priority} className="text-[10px] capitalize">
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {task.assignee ? (
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full bg-text-primary text-[10px] font-mono font-medium text-surface"
                title={task.assignee}
              >
                {getInitials(task.assignee)}
              </span>
            ) : (
              <span className="h-6 w-6" aria-hidden="true" />
            )}
            {task.dueDate && (
              <span className="text-[10px] font-mono text-text-muted">
                {new Date(task.dueDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
