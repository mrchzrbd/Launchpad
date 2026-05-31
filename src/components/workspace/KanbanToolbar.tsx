"use client";

import { Filter, Plus, Search } from "lucide-react";
import { useState } from "react";
import type { KanbanTask } from "@/lib/types";
import { getInitials } from "@/lib/workspace-utils";
import { cn } from "@/lib/utils";

const PRIORITY_ACTIVE: Record<KanbanTask["priority"], string> = {
  low: "bg-text-muted text-surface ring-2 ring-accent ring-offset-1",
  medium: "bg-warning text-text-primary ring-2 ring-accent ring-offset-1",
  high: "bg-accent text-white ring-2 ring-accent ring-offset-1",
  critical: "bg-error text-white ring-2 ring-accent ring-offset-1",
};

export interface KanbanToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  assignees: string[];
  epics: string[];
  activeAssignees: string[];
  activePriorities: KanbanTask["priority"][];
  activeEpics: string[];
  onToggleAssignee: (name: string) => void;
  onTogglePriority: (p: KanbanTask["priority"]) => void;
  onToggleEpic: (epic: string) => void;
  onClearFilters: () => void;
  onAddColumn: () => void;
}

export function KanbanToolbar({
  searchQuery,
  onSearchChange,
  assignees,
  epics,
  activeAssignees,
  activePriorities,
  activeEpics,
  onToggleAssignee,
  onTogglePriority,
  onToggleEpic,
  onClearFilters,
  onAddColumn,
}: KanbanToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeFilterCount =
    activeAssignees.length + activePriorities.length + activeEpics.length;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search tasks"
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-input font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-[3px] focus:ring-accent/40 focus:border-accent"
          />
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-button border font-body text-sm transition-all",
            filtersOpen || activeFilterCount > 0
              ? "bg-accent text-white border-accent"
              : "bg-surface text-text-secondary border-border hover:border-accent",
          )}
        >
          <Filter className="w-4 h-4" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-surface text-accent rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="font-body text-sm text-text-muted hover:text-accent transition-colors min-h-[44px] px-2"
          >
            Clear all
          </button>
        )}

        <div className="ml-auto">
          <button
            type="button"
            onClick={onAddColumn}
            className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-surface border border-border rounded-button font-body text-sm text-text-secondary hover:border-text-primary transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add Column
          </button>
        </div>
      </div>

      {filtersOpen && (
        <div className="mt-3 p-4 bg-surface border border-border rounded-card">
          <div className="flex flex-wrap gap-6">
            {assignees.length > 0 && (
              <div>
                <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Assignee
                </p>
                <div className="flex gap-2 flex-wrap">
                  {assignees.map((name) => (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => onToggleAssignee(name)}
                      className={cn(
                        "w-9 h-9 rounded-full font-mono text-xs font-bold transition-all",
                        activeAssignees.includes(name)
                          ? "bg-text-primary text-background ring-2 ring-accent ring-offset-1"
                          : "bg-surface-alt text-text-primary hover:bg-border",
                      )}
                    >
                      {getInitials(name)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Priority
              </p>
              <div className="flex gap-2 flex-wrap">
                {(["low", "medium", "high", "critical"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onTogglePriority(p)}
                    className={cn(
                      "px-3 py-1 min-h-[36px] rounded-full font-mono text-xs font-semibold capitalize transition-all",
                      activePriorities.includes(p)
                        ? PRIORITY_ACTIVE[p]
                        : "bg-surface-alt text-text-secondary hover:bg-border",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {epics.length > 0 && (
              <div>
                <p className="font-body text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Epic
                </p>
                <div className="flex flex-wrap gap-2">
                  {epics.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => onToggleEpic(e)}
                      className={cn(
                        "px-3 py-1 min-h-[36px] rounded-full font-body text-xs font-medium transition-all",
                        activeEpics.includes(e)
                          ? "bg-text-primary text-background"
                          : "bg-surface-alt text-text-secondary hover:bg-border",
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
