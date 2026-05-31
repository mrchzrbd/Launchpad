"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useMemo, useRef, useState } from "react";
import { DroppableKanbanColumn } from "@/components/workspace/DroppableKanbanColumn";
import { KanbanToolbar } from "@/components/workspace/KanbanToolbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  findColumnIdForTask,
  moveTaskBetweenColumns,
  reorderTasksInColumn,
  resolveOverColumnId,
} from "@/lib/kanban-mutations";
import type {
  KanbanColumn as KanbanColumnType,
  KanbanTask,
  TeamMember,
  WorkspaceData,
} from "@/lib/types";

export interface KanbanBoardProps {
  workspace: WorkspaceData;
  members: TeamMember[];
  onUpdate: (workspace: WorkspaceData) => void;
}

export function KanbanBoard({ workspace, members, onUpdate }: KanbanBoardProps) {
  const [search, setSearch] = useState("");
  const [filterAssignees, setFilterAssignees] = useState<string[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<KanbanTask["priority"][]>([]);
  const [filterEpics, setFilterEpics] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("#4A4A6A");

  const lastCrossColumnRef = useRef<string | null>(null);
  const columns = workspace.kanbanColumns;
  const columnIds = columns.map((c) => c.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const assignees = useMemo(() => {
    const names = new Set<string>();
    columns.forEach((col) =>
      col.tasks.forEach((t) => {
        if (t.assignee) names.add(t.assignee);
      }),
    );
    return Array.from(names);
  }, [columns]);

  const matchesFilters = useCallback(
    (task: KanbanTask) => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (
        filterAssignees.length &&
        (!task.assignee || !filterAssignees.includes(task.assignee))
      ) {
        return false;
      }
      if (filterPriorities.length && !filterPriorities.includes(task.priority)) {
        return false;
      }
      if (filterEpics.length && (!task.epic || !filterEpics.includes(task.epic))) {
        return false;
      }
      return true;
    },
    [search, filterAssignees, filterPriorities, filterEpics],
  );

  const filteredColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter(matchesFilters),
      })),
    [columns, matchesFilters],
  );

  const totalBoardTasks = useMemo(
    () => columns.reduce((s, c) => s + c.tasks.length, 0),
    [columns],
  );

  const filteredTaskCount = useMemo(
    () => filteredColumns.reduce((s, c) => s + c.tasks.length, 0),
    [filteredColumns],
  );

  const hasFilters =
    search.length > 0 ||
    filterAssignees.length > 0 ||
    filterPriorities.length > 0 ||
    filterEpics.length > 0;

  const updateColumns = useCallback(
    (nextColumns: KanbanColumnType[]) => {
      onUpdate({ ...workspace, kanbanColumns: nextColumns });
    },
    [workspace, onUpdate],
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as KanbanTask | undefined;
    setActiveTask(task ?? null);
    lastCrossColumnRef.current = null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const fromColumnId = findColumnIdForTask(columns, activeId);
    const toColumnId = resolveOverColumnId(columns, overId);

    if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) return;

    const key = `${activeId}:${toColumnId}`;
    if (lastCrossColumnRef.current === key) return;
    lastCrossColumnRef.current = key;

    updateColumns(moveTaskBetweenColumns(columns, activeId, fromColumnId, toColumnId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    lastCrossColumnRef.current = null;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const columnId = findColumnIdForTask(columns, activeId);
    const overColumnId = resolveOverColumnId(columns, overId);

    if (!columnId || !overColumnId || columnId !== overColumnId) return;

    if (activeId !== overId) {
      updateColumns(reorderTasksInColumn(columns, columnId, activeId, overId));
    }
  };

  const handleDeleteTask = (taskId: string, columnId: string) => {
    updateColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col,
      ),
    );
    if (focusedTaskId === taskId) setFocusedTaskId(null);
  };

  const handleMoveTaskColumn = (
    taskId: string,
    fromColumnId: string,
    direction: "left" | "right",
  ) => {
    const fromIdx = columnIds.indexOf(fromColumnId);
    const targetIdx = direction === "left" ? fromIdx - 1 : fromIdx + 1;
    const targetCol = columnIds[targetIdx];
    if (targetCol) {
      updateColumns(moveTaskBetweenColumns(columns, taskId, fromColumnId, targetCol));
    }
  };

  const handleAddTask = (columnId: string, taskData: Omit<KanbanTask, "id">) => {
    const newTask: KanbanTask = {
      ...taskData,
      id: `task-custom-${Date.now()}`,
    };
    const nextColumns = columns.map((col) =>
      col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col,
    );
    const epics = new Set(workspace.epics);
    if (taskData.epic) epics.add(taskData.epic);
    onUpdate({
      ...workspace,
      kanbanColumns: nextColumns,
      epics: Array.from(epics).sort(),
    });
  };

  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const id = `col-${newColumnName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    onUpdate({
      ...workspace,
      kanbanColumns: [
        ...columns,
        {
          id,
          title: newColumnName.trim(),
          color: newColumnColor,
          tasks: [],
        },
      ],
    });
    setNewColumnName("");
    setShowAddColumn(false);
  };

  const clearAllFilters = () => {
    setSearch("");
    setFilterAssignees([]);
    setFilterPriorities([]);
    setFilterEpics([]);
  };

  return (
    <div id="kanban-board" className="min-w-0" data-demo-target="workspace-kanban">
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {hasFilters
          ? `Showing ${filteredTaskCount} of ${totalBoardTasks} tasks`
          : `${totalBoardTasks} tasks on board`}
      </div>

      <KanbanToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        assignees={assignees}
        epics={workspace.epics}
        activeAssignees={filterAssignees}
        activePriorities={filterPriorities}
        activeEpics={filterEpics}
        onToggleAssignee={(name) =>
          setFilterAssignees((prev) =>
            prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
          )
        }
        onTogglePriority={(p) =>
          setFilterPriorities((prev) =>
            prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
          )
        }
        onToggleEpic={(epic) =>
          setFilterEpics((prev) =>
            prev.includes(epic) ? prev.filter((e) => e !== epic) : [...prev, epic],
          )
        }
        onClearFilters={clearAllFilters}
        onAddColumn={() => setShowAddColumn(true)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-6 -mx-2 px-2">
          <div className="flex gap-4 min-w-max">
            {filteredColumns.map((column, columnIndex) => (
              <DroppableKanbanColumn
                key={column.id}
                column={column}
                members={members}
                epics={workspace.epics}
                focusedTaskId={focusedTaskId}
                columnIndex={columnIndex}
                columnIds={columnIds}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onMoveTaskColumn={handleMoveTaskColumn}
                onFocusTask={setFocusedTaskId}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[268px] rotate-[1.5deg] scale-105 shadow-card-hover rounded-card border-2 border-accent/40 bg-surface p-3 pointer-events-none">
              <p className="text-sm font-semibold text-text-primary font-body">
                {activeTask.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        open={showAddColumn}
        onClose={() => setShowAddColumn(false)}
        title="Add Column"
      >
        <div className="space-y-4">
          <Input
            label="Column name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="e.g. Blocked"
          />
          <div>
            <label
              htmlFor="column-color"
              className="text-sm font-medium text-text-primary font-body mb-2 block"
            >
              Color
            </label>
            <input
              id="column-color"
              type="color"
              value={newColumnColor}
              onChange={(e) => setNewColumnColor(e.target.value)}
              className="h-11 w-full rounded-input cursor-pointer min-h-[44px]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={handleAddColumn}>
              Create Column
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowAddColumn(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
