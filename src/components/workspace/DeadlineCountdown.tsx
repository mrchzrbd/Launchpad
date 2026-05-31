"use client";

export interface DeadlineCountdownProps {
  deadline?: string;
}

export function DeadlineCountdown({ deadline }: DeadlineCountdownProps) {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) return null;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return (
      <span className="font-mono text-xs text-accent font-semibold" role="status">
        Due today
      </span>
    );
  }

  if (diffDays < 0) {
    return (
      <span className="font-mono text-xs text-text-secondary" role="status">
        {deadlineDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </span>
    );
  }

  const color =
    diffDays <= 3 ? "#C1440E" : diffDays <= 7 ? "#E9A84A" : "#2D6A4F";

  return (
    <span
      className="font-mono text-xs font-semibold"
      style={{ color }}
      role="status"
    >
      {diffDays} {diffDays === 1 ? "day" : "days"} left
    </span>
  );
}
