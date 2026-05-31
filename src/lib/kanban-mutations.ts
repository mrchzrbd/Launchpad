import { arrayMove } from "@dnd-kit/sortable";
import type { KanbanColumn, KanbanTask } from "./types";

export function findColumnIdForTask(
  columns: KanbanColumn[],
  taskId: string,
): string | undefined {
  return columns.find((col) => col.tasks.some((t) => t.id === taskId))?.id;
}

export function resolveOverColumnId(
  columns: KanbanColumn[],
  overId: string,
): string | undefined {
  if (columns.some((c) => c.id === overId)) return overId;
  return findColumnIdForTask(columns, overId);
}

export function moveTaskBetweenColumns(
  columns: KanbanColumn[],
  taskId: string,
  fromColumnId: string,
  toColumnId: string,
): KanbanColumn[] {
  if (fromColumnId === toColumnId) return columns;

  let movedTask: KanbanTask | undefined;
  const stripped = columns.map((col) => {
    if (col.id !== fromColumnId) return col;
    const tasks = col.tasks.filter((t) => {
      if (t.id === taskId) {
        movedTask = t;
        return false;
      }
      return true;
    });
    return { ...col, tasks };
  });

  if (!movedTask) return columns;

  return stripped.map((col) =>
    col.id === toColumnId ? { ...col, tasks: [...col.tasks, movedTask!] } : col,
  );
}

export function reorderTasksInColumn(
  columns: KanbanColumn[],
  columnId: string,
  activeId: string,
  overId: string,
): KanbanColumn[] {
  return columns.map((col) => {
    if (col.id !== columnId) return col;
    const oldIndex = col.tasks.findIndex((t) => t.id === activeId);
    const newIndex = col.tasks.findIndex((t) => t.id === overId);
    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return col;
    return { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) };
  });
}
