"use client";

import { motion, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import { useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { getEpicColor, getInitials } from "@/lib/workspace-utils";
import type { KanbanTask } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface KanbanCardProps {
  task: KanbanTask;
  columnId: string;
  onDragStart?: () => void;
  onDragEnd?: (point: { x: number; y: number }) => void;
  isDragging?: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
  onDelete?: () => void;
  onMoveColumn?: (direction: "left" | "right") => void;
}

export function KanbanCard({
  task,
  columnId,
  onDragStart,
  onDragEnd,
  isDragging,
  isFocused,
  onFocus,
  onDelete,
  onMoveColumn,
}: KanbanCardProps) {
  const dragControls = useDragControls();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      layout
      layoutId={task.id}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragSnapToOrigin={!isDragging}
      dragElastic={0.12}
      onDragStart={() => {
        onDragStart?.();
      }}
      onDragEnd={(_, info) => onDragEnd?.(info.point)}
      animate={
        isDragging
          ? {
              scale: 1.04,
              rotate: 1.5,
              boxShadow: "0 16px 40px rgba(26,26,46,0.18), 0 4px 12px rgba(26,26,46,0.12)",
              zIndex: 50,
            }
          : { scale: 1, rotate: 0 }
      }
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${task.title}. Press Enter to select, arrow keys to move columns, Delete to remove.`}
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
          ? "border-accent/40 opacity-95 cursor-grabbing"
          : "border-border cursor-grab",
        isFocused && "ring-[3px] ring-accent/40 ring-offset-2",
      )}
      data-task-id={task.id}
      data-column-id={columnId}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className="shrink-0 flex h-11 w-8 items-center justify-center text-text-muted hover:text-text-secondary cursor-grab touch-none"
          onPointerDown={(e) => dragControls.start(e)}
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
    </motion.div>
  );
}
