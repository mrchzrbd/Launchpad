"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { KanbanCard } from "@/components/workspace/KanbanCard";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import type { KanbanColumn as KanbanColumnType, KanbanTask, TeamMember } from "@/lib/types";
import { cn } from "@/lib/utils";

const VIRTUALIZE_THRESHOLD = 50;
const MAX_VISIBLE_PER_COLUMN = 25;

export interface KanbanColumnProps {
  column: KanbanColumnType;
  members: TeamMember[];
  epics: string[];
  draggingTaskId: string | null;
  isDragOver: boolean;
  totalBoardTasks: number;
  focusedTaskId: string | null;
  columnIndex: number;
  columnIds: string[];
  onDragStart: (taskId: string, columnId: string) => void;
  onDragEnd: (taskId: string, fromColumnId: string, point: { x: number; y: number }) => void;
  onAddTask: (columnId: string, task: Omit<KanbanTask, "id">) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onMoveTaskColumn: (taskId: string, fromColumnId: string, direction: "left" | "right") => void;
  onFocusTask: (taskId: string) => void;
}

export function KanbanColumn({
  column,
  members,
  epics,
  draggingTaskId,
  isDragOver,
  totalBoardTasks,
  focusedTaskId,
  columnIndex,
  columnIds,
  onDragStart,
  onDragEnd,
  onAddTask,
  onDeleteTask,
  onMoveTaskColumn,
  onFocusTask,
}: KanbanColumnProps) {
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [title, setTitle] = useState("");
  const [epic, setEpic] = useState(epics[0] ?? "");
  const [priority, setPriority] = useState<KanbanTask["priority"]>("medium");
  const [assignee, setAssignee] = useState(members[0]?.name ?? "");

  const shouldVirtualize = totalBoardTasks > VIRTUALIZE_THRESHOLD;
  const visibleTasks = useMemo(() => {
    if (!shouldVirtualize || showAll) return column.tasks;
    return column.tasks.slice(0, MAX_VISIBLE_PER_COLUMN);
  }, [column.tasks, shouldVirtualize, showAll]);

  const hiddenCount = column.tasks.length - visibleTasks.length;

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddTask(column.id, {
      title: title.trim(),
      epic,
      priority,
      assignee: assignee || undefined,
      tags: [epic.toLowerCase().replace(/\s+/g, "-")],
    });
    setTitle("");
    setShowForm(false);
  };

  return (
    <div
      data-column-id={column.id}
      className={cn(
        "flex min-w-[280px] max-w-[280px] flex-col rounded-card bg-surface-alt/80 shrink-0",
        "border-t-[3px] transition-colors duration-200",
        isDragOver && "ring-2 ring-accent/30 bg-accent-light/25",
      )}
      style={{ borderTopColor: column.color }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <h3 className="font-body text-sm font-semibold text-text-primary">
          {column.title}
        </h3>
        <span
          className="ml-auto flex h-6 min-w-[24px] items-center justify-center rounded-full bg-surface px-1.5 text-[10px] font-mono text-text-muted border border-border"
          role="status"
          aria-live="polite"
          aria-label={`${column.tasks.length} tasks in ${column.title}`}
        >
          {column.tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-3 pb-3 flex-1 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {isDragOver && draggingTaskId && (
            <motion.div
              key="drop-zone"
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 56 }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-card border-2 border-dashed border-accent/50 bg-accent-light/40 shrink-0"
              aria-hidden="true"
            />
          )}

          {visibleTasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              columnId={column.id}
              isDragging={draggingTaskId === task.id}
              isFocused={focusedTaskId === task.id}
              onFocus={() => onFocusTask(task.id)}
              onDragStart={() => onDragStart(task.id, column.id)}
              onDragEnd={(point) => onDragEnd(task.id, column.id, point)}
              onDelete={() => onDeleteTask(task.id, column.id)}
              onMoveColumn={(dir) => {
                const targetIdx =
                  dir === "left" ? columnIndex - 1 : columnIndex + 1;
                const targetCol = columnIds[targetIdx];
                if (targetCol) onMoveTaskColumn(task.id, column.id, dir);
              }}
            />
          ))}
        </AnimatePresence>

        {column.tasks.length === 0 && !isDragOver && (
          <p className="py-6 text-center text-xs text-text-muted font-body border border-dashed border-border rounded-card px-3">
            No tasks yet · Add one ↓
          </p>
        )}

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-xs text-accent font-body hover:underline py-2 min-h-[44px]"
          >
            Show {hiddenCount} more tasks
          </button>
        )}

        {showForm ? (
          <div className="rounded-card border border-border bg-surface p-3 space-y-2">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
            <Select
              label="Epic"
              value={epic}
              onChange={(e) => setEpic(e.target.value)}
              options={epics.map((e) => ({ value: e, label: e }))}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as KanbanTask["priority"])
              }
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]}
            />
            <Select
              label="Assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              options={members.map((m) => ({ value: m.name, label: m.name }))}
            />
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleAdd}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-1.5 min-h-[44px] py-2 rounded-card border border-dashed border-border text-xs font-body text-text-muted hover:border-accent hover:text-accent transition-colors"
          >
            <Plus size={14} aria-hidden="true" />
            Add Task
          </button>
        )}
      </div>
    </div>
  );
}
