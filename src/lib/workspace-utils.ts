import type { ProjectTemplate } from "./types";
import { TEMPLATE_LABELS } from "./onboarding-constants";

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getDaysUntilDeadline(deadline: string): number | null {
  const target = new Date(deadline);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDeadlineLabel(deadline: string): string {
  const days = getDaysUntilDeadline(deadline);
  if (days === null) return deadline;
  if (days > 0) return `${days} days left`;
  if (days === 0) return "Due today";
  return `${Math.abs(days)} days overdue`;
}

export function getTemplateLabel(template: ProjectTemplate): string {
  return TEMPLATE_LABELS[template];
}

const EPIC_COLORS: Record<string, string> = {
  Research: "#3A86FF",
  Strategy: "#6A4C93",
  Process: "#8A8AA8",
  "Team Setup": "#C1440E",
  Design: "#E9C46A",
  Build: "#2D6A4F",
  Writing: "#4A4A6A",
  Analysis: "#3A86FF",
  Review: "#E9C46A",
  Delivery: "#C1440E",
};

export function getEpicColor(epic: string): string {
  return EPIC_COLORS[epic] ?? "#4A4A6A";
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getDayLabel(dayOfWeek: number): string {
  return DAY_LABELS[dayOfWeek] ?? "Mon";
}

export function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const suffix = hour >= 12 ? "pm" : "am";
  const m = minute > 0 ? `:${minute.toString().padStart(2, "0")}` : "";
  return `${h}${m}${suffix}`;
}

export function generateIcsContent(
  events: {
    uid: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
  }[],
): string {
  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Launchpad//Team Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  events.forEach((event) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}@launchpad.app`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(event.end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
