"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Pencil, Plus, Trash2, X } from "lucide-react";
import { useLaunchpad } from "@/lib/store";
import type { TeamMeeting, TeamMeetingDay, TeamMeetingType } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAYS: TeamMeetingDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MEETING_TYPES: TeamMeetingType[] = [
  "standup",
  "planning",
  "review",
  "retrospective",
  "custom",
];

const TYPE_COLORS: Record<TeamMeetingType, string> = {
  standup: "bg-blue-100 text-blue-800 border-blue-200",
  planning: "bg-purple-100 text-purple-800 border-purple-200",
  review: "bg-green-100 text-green-800 border-green-200",
  retrospective: "bg-orange-100 text-orange-800 border-orange-200",
  custom: "bg-accent-light text-accent border-accent/20",
};

const DAY_TO_ICS: Record<TeamMeetingDay, string> = {
  Mon: "MO",
  Tue: "TU",
  Wed: "WE",
  Thu: "TH",
  Fri: "FR",
  Sat: "SA",
  Sun: "SU",
};

function MeetingModal({
  meeting,
  onSave,
  onClose,
}: {
  meeting?: TeamMeeting;
  onSave: (m: TeamMeeting) => void;
  onClose: () => void;
}) {
  const isNew = !meeting;
  const [title, setTitle] = useState(meeting?.title ?? "");
  const [day, setDay] = useState<TeamMeetingDay>(meeting?.day ?? "Mon");
  const [time, setTime] = useState(meeting?.time ?? "10:00");
  const [duration, setDuration] = useState(meeting?.duration ?? 30);
  const [type, setType] = useState<TeamMeetingType>(meeting?.type ?? "custom");
  const [isAsync, setIsAsync] = useState(meeting?.isAsync ?? false);
  const [recurring, setRecurring] = useState(meeting?.recurring ?? true);
  const [agenda, setAgenda] = useState<string[]>(meeting?.agenda ?? []);
  const [newAgendaItem, setNewAgendaItem] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: meeting?.id ?? `meeting-${Date.now()}`,
      title: title.trim(),
      day,
      time,
      duration,
      type,
      isAsync,
      recurring,
      agenda: agenda.filter(Boolean),
    });
  };

  const addAgendaItem = () => {
    if (!newAgendaItem.trim()) return;
    setAgenda((prev) => [...prev, newAgendaItem.trim()]);
    setNewAgendaItem("");
  };

  const removeAgendaItem = (i: number) =>
    setAgenda((prev) => prev.filter((_, idx) => idx !== i));

  const fieldClass =
    "w-full px-3 py-2 bg-background border border-border rounded-lg font-body text-sm text-text-primary focus:outline-none focus:border-accent";

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

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-surface shadow-card-hover">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-lg text-text-primary">
            {isNew ? "Add Meeting" : "Edit Meeting"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-alt transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Meeting Name *
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sprint Planning"
              className={fieldClass}
            />
          </div>

          <div>
            <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Type
            </label>
            <div className="flex flex-wrap gap-2">
              {MEETING_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-full border px-3 py-1 font-body text-xs font-medium capitalize transition-all",
                    type === t
                      ? TYPE_COLORS[t]
                      : "border-transparent bg-surface-alt text-text-secondary hover:bg-border",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as TeamMeetingDay)}
                className={fieldClass}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isAsync}
                className={cn(fieldClass, "disabled:opacity-40")}
              />
            </div>
            <div>
              <label className="mb-1.5 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={fieldClass}
              >
                {[10, 15, 20, 30, 45, 60, 90, 120].map((d) => (
                  <option key={d} value={d}>
                    {d} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isAsync}
                onChange={(e) => setIsAsync(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="font-body text-sm text-text-secondary">
                Async (no set time)
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              <span className="font-body text-sm text-text-secondary">
                Recurring weekly
              </span>
            </label>
          </div>

          <div>
            <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
              Agenda
            </label>
            <div className="mb-2 space-y-1.5">
              {agenda.map((item, i) => (
                <div key={`${item}-${i}`} className="group flex items-center gap-2">
                  <span className="shrink-0 text-xs text-accent">→</span>
                  <span className="flex-1 font-body text-sm text-text-primary">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeAgendaItem(i)}
                    className="text-text-muted opacity-0 transition-all hover:text-red-500 group-hover:opacity-100"
                    aria-label="Remove agenda item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAgendaItem}
                onChange={(e) => setNewAgendaItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAgendaItem();
                  }
                }}
                placeholder="Add agenda item..."
                className={cn(fieldClass, "flex-1")}
              />
              <button
                type="button"
                onClick={addAgendaItem}
                className="rounded-lg bg-surface-alt px-3 py-2 text-text-secondary transition-colors hover:bg-border"
                aria-label="Add agenda item"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-body text-sm text-text-secondary hover:text-text-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim()}
            className="rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isNew ? "Add Meeting" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MeetingCadence() {
  const { state, dispatch } = useLaunchpad();
  const workspace = state.workspace;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<TeamMeeting | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const meetings = workspace?.meetings ?? [];

  const handleSave = (m: TeamMeeting) => {
    if (editingMeeting) {
      dispatch({ type: "EDIT_MEETING", meetingId: m.id, updates: m });
    } else {
      dispatch({ type: "ADD_MEETING", meeting: m });
    }
    setModalOpen(false);
    setEditingMeeting(undefined);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_MEETING", meetingId: id });
    setDeletingId(null);
    if (expandedId === id) setExpandedId(null);
  };

  const byDay = DAYS.reduce(
    (acc, day) => {
      acc[day] = meetings.filter((m) => m.day === day);
      return acc;
    },
    {} as Record<TeamMeetingDay, TeamMeeting[]>,
  );

  const handleDownloadICS = () => {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Digital Collaboration Launchpad//EN",
      "CALSCALE:GREGORIAN",
    ];

    const dayToIndex: Record<TeamMeetingDay, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    meetings
      .filter((m) => !m.isAsync)
      .forEach((m) => {
        const byday = DAY_TO_ICS[m.day];
        const [hours, minutes] = m.time.split(":").map(Number);
        const start = new Date();
        const currentDow = start.getDay();
        const targetDow = dayToIndex[m.day];
        let delta = targetDow - currentDow;
        if (delta <= 0) delta += 7;
        start.setDate(start.getDate() + delta);
        start.setHours(hours ?? 10, minutes ?? 0, 0, 0);

        const pad = (n: number) => String(n).padStart(2, "0");
        const dtStart = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}T${pad(start.getHours())}${pad(start.getMinutes())}00`;

        lines.push(
          "BEGIN:VEVENT",
          `UID:${m.id}@launchpad`,
          `SUMMARY:${m.title}`,
          `DTSTART:${dtStart}`,
          `DURATION:PT${m.duration}M`,
          m.recurring ? `RRULE:FREQ=WEEKLY;BYDAY=${byday}` : "",
          `DESCRIPTION:${m.agenda.join("\\n")}`,
          "END:VEVENT",
        );
      });

    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.filter(Boolean).join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "launchpad-meetings.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openAdd = () => {
    setEditingMeeting(undefined);
    setModalOpen(true);
  };

  const openEdit = (m: TeamMeeting) => {
    setEditingMeeting(m);
    setModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl text-text-primary">Meeting Cadence</h2>
          <p className="font-body text-sm text-text-muted mt-0.5">
            {meetings.length} recurring meeting{meetings.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadICS}
            className="flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg font-body text-sm text-text-secondary hover:border-text-primary transition-colors min-h-[44px]"
          >
            <Calendar className="w-4 h-4" />
            Sync to Calendar
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 px-3 py-2 bg-accent text-white rounded-lg font-body text-sm font-semibold hover:bg-accent-hover transition-colors min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Add Meeting
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-7 gap-1 sm:gap-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center min-w-0">
            <p className="font-mono text-[10px] sm:text-xs text-text-muted uppercase mb-2">
              {day}
            </p>
            <div className="space-y-1">
              {byDay[day]?.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  title={`${m.title} · ${m.isAsync ? "Async" : m.time} · ${m.duration}min`}
                  onClick={() => openEdit(m)}
                  className={cn(
                    "w-full rounded-lg px-1 py-1 text-[10px] sm:text-xs font-body font-medium border transition-opacity hover:opacity-80 truncate",
                    TYPE_COLORS[m.type],
                  )}
                >
                  {m.isAsync ? "~" : m.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {meetings.map((m) => (
          <div
            key={m.id}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4">
              <span
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 font-body text-xs font-medium capitalize",
                  TYPE_COLORS[m.type],
                )}
              >
                {m.type}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-text-primary">{m.title}</p>
                <p className="font-mono text-xs text-text-muted mt-0.5">
                  {m.day} · {m.isAsync ? "Async" : m.time} · {m.duration} min
                  {m.recurring && " · Weekly"}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                  className="px-2.5 py-1.5 font-body text-xs text-text-muted hover:text-text-primary hover:bg-surface-alt rounded-lg transition-colors min-h-[44px]"
                >
                  {expandedId === m.id ? "Hide agenda" : "View agenda"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(m)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-alt transition-colors"
                  aria-label={`Edit ${m.title}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                {deletingId === m.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="rounded-lg bg-red-600 px-2 py-1 font-body text-xs font-semibold text-white hover:bg-red-700 min-h-[44px]"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(null)}
                      className="px-2 py-1 font-body text-xs text-text-muted min-h-[44px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeletingId(m.id)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label={`Delete ${m.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {expandedId === m.id && m.agenda.length > 0 && (
              <div className="border-t border-background px-5 pb-4">
                <p className="mt-3 mb-2 font-body text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Agenda
                </p>
                <div className="space-y-1">
                  {m.agenda.map((item, i) => (
                    <div key={`${item}-${i}`} className="flex items-center gap-2">
                      <span className="shrink-0 font-mono text-xs text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-body text-sm text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {meetings.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border py-16 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-border" />
            <p className="font-body text-sm text-text-muted">No meetings yet</p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-3 font-body text-sm text-accent hover:underline min-h-[44px]"
            >
              Add your first meeting →
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <MeetingModal
          meeting={editingMeeting}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingMeeting(undefined);
          }}
        />
      )}
    </div>
  );
}
