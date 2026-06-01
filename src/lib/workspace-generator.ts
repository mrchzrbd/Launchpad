import { buildInitialCharter } from "./charter-utils";
import { DEFAULT_MEETINGS } from "./default-meetings";
import { TEMPLATE_LABELS } from "./onboarding-constants";
import type {
  GRPIData,
  KanbanColumn,
  KanbanTask,
  MeetingBlock,
  RaciRow,
  TeamMember,
  WorkspaceData,
} from "./types";
import {
  KANBAN_COLUMNS,
  TEMPLATE_TASKS,
  type TaskPhase,
  type TaskSeed,
} from "./workspace-templates";

const PHASE_OFFSET: Record<TaskPhase, number> = {
  early: 0.3,
  mid: 0.65,
  late: 0.9,
};

function getProjectTimeline(deadline: string): {
  start: Date;
  end: Date;
  generatedAt: string;
} {
  const end = new Date(deadline);
  if (Number.isNaN(end.getTime())) {
    const fallback = new Date("2025-06-01");
    return {
      start: fallback,
      end: fallback,
      generatedAt: fallback.toISOString(),
    };
  }
  const start = new Date(end);
  start.setDate(start.getDate() - 84);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return { start, end, generatedAt: start.toISOString() };
}

function computeDueDate(
  deadline: string,
  phase: TaskPhase,
  projectStart: Date,
): string {
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);

  if (Number.isNaN(end.getTime())) return deadline;

  const total = end.getTime() - projectStart.getTime();
  const offset = total > 0 ? total * PHASE_OFFSET[phase] : 0;
  const due = new Date(projectStart.getTime() + offset);
  return due.toISOString().split("T")[0] ?? deadline;
}

function findAssignee(members: TeamMember[], keywords: string[]): string | undefined {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  for (const kw of lowerKeywords) {
    const match = members.find(
      (m) =>
        m.role.toLowerCase().includes(kw) ||
        m.responsibilities.some((r) => r.toLowerCase().includes(kw)),
    );
    if (match) return match.name;
  }

  const lead = members.find((m) => m.role.toLowerCase().includes("lead"));
  if (lead) return lead.name;

  const scrumMaster = members.find((m) => m.scrumRole === "scrum-master");
  if (scrumMaster) return scrumMaster.name;

  return members[0]?.name;
}

function seedToTask(seed: TaskSeed, grpi: GRPIData, projectStart: Date): KanbanTask {
  const assignee = findAssignee(grpi.roles, seed.roleKeywords);
  return {
    id: seed.id,
    title: seed.title,
    epic: seed.epic,
    priority: seed.priority,
    assignee,
    dueDate: computeDueDate(grpi.goals.deadline, seed.phase, projectStart),
    tags: [seed.epic.toLowerCase().replace(/\s+/g, "-")],
  };
}

function buildKanbanColumns(grpi: GRPIData, projectStart: Date): KanbanColumn[] {
  const seeds = TEMPLATE_TASKS[grpi.goals.projectTemplate];
  const tasksByColumn = new Map<string, KanbanTask[]>();

  for (const col of KANBAN_COLUMNS) {
    tasksByColumn.set(col.id, []);
  }

  for (const seed of seeds) {
    const task = seedToTask(seed, grpi, projectStart);
    tasksByColumn.get(seed.columnId)?.push(task);
  }

  return KANBAN_COLUMNS.map((col) => ({
    ...col,
    tasks: tasksByColumn.get(col.id) ?? [],
  }));
}

function buildTeamCharter(grpi: GRPIData, generatedAt: string): string {
  const { goals, roles, processes, norms } = grpi;
  const date = new Date(generatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const roleBlocks = roles
    .map((m) => {
      const scrum =
        m.scrumRole === "product-owner"
          ? "Product Owner"
          : m.scrumRole === "scrum-master"
            ? "Scrum Master"
            : "Dev Team";
      return `### ${m.name}\n**${m.role}** · ${scrum}\n\n${m.responsibilities.map((r) => `- ${r}`).join("\n")}`;
    })
    .join("\n\n");

  const decisionLabel =
    processes.decisionMaking === "consensus"
      ? "Consensus — we discuss until everyone agrees"
      : processes.decisionMaking === "team-lead"
        ? "Team Lead decides — after hearing all views"
        : processes.decisionMaking === "majority"
          ? "Majority vote"
          : processes.decisionMaking === "delegated"
            ? "Delegated — task owner decides"
            : processes.decisionMaking;

  const feedbackLabel =
    processes.feedbackStyle === "direct"
      ? "Direct & verbal (in meetings)"
      : processes.feedbackStyle === "structured"
        ? "Structured (written, with template)"
        : processes.feedbackStyle === "async-written"
          ? "Async written (comments in docs)"
          : "Sprint retrospectives only";

  return `# Team Charter

## ${goals.projectName}
**${TEMPLATE_LABELS[goals.projectTemplate]}** · Generated ${date} · Deadline ${goals.deadline}

---

## Section 1 — Our Purpose

${goals.primaryGoal}

### Success Criteria
${goals.successCriteria.map((c, i) => `${i + 1}. ${c}`).join("\n")}

### Constraints
${goals.constraints.map((c, i) => `${i + 1}. ${c}`).join("\n")}

---

## Section 2 — Team Members & Roles

${roleBlocks}

---

## Section 3 — Ways of Working

We communicate primarily via **${processes.communicationChannel}**. Our meeting cadence is **${processes.meetingCadence.replace("-", " ")}**. Decisions are made by: **${decisionLabel}**. Files live in **${processes.fileStorage}**. Feedback happens through: **${feedbackLabel}**.

| Area | Agreement |
|------|-----------|
| Communication | ${processes.communicationChannel} |
| Meetings | ${processes.meetingCadence} |
| Decisions | ${decisionLabel} |
| File storage | ${processes.fileStorage} |
| Feedback | ${feedbackLabel} |

---

## Section 4 — Team Norms

1. **Response time:** ${norms.responseTime}
2. **Working hours:** ${norms.workingHours}
3. **Conflict resolution:** ${getConflictLabel(norms.conflictResolution)}
4. **Commitment:** ${norms.commitmentLevel}
${norms.customNorms.map((n, i) => `${i + 5}. ${n}`).join("\n")}

---

## Section 5 — AI Use Policy

${processes.aiPolicy}

---

*Generated by The Digital Collaboration Launchpad · ${date}*`;
}

function getConflictLabel(value: string): string {
  const map: Record<string, string> = {
    "group-immediately": "Raise it in the group immediately",
    "direct-first": "Speak directly to the person first",
    "team-lead": "Bring it to the Team Lead",
    retrospective: "Wait for the weekly retrospective",
  };
  return map[value] ?? value;
}

function buildMeetingTemplate(grpi: GRPIData): string {
  return `# Meeting Templates — ${grpi.goals.projectName}

## Sprint Planning (Sunday, 30 min)
1. Review backlog
2. Set sprint goal
3. Assign tasks
4. Confirm owners

## Daily Standup (async)
- What did I complete yesterday?
- What am I doing today?
- Any blockers?

## Sprint Retrospective (Saturday, 15 min)
- What worked?
- What didn't?
- What do we change?
`;
}

function buildMeetingSchedule(grpi: GRPIData): MeetingBlock[] {
  const cadence = grpi.processes.meetingCadence;
  const blocks: MeetingBlock[] = [];

  if (cadence === "daily") {
    blocks.push(
      { id: "standup-mon", title: "Daily Standup", dayOfWeek: 0, startHour: 9, startMinute: 0, durationMinutes: 15, description: "Async or sync check-in" },
      { id: "standup-tue", title: "Daily Standup", dayOfWeek: 1, startHour: 9, startMinute: 0, durationMinutes: 15, description: "Async or sync check-in" },
      { id: "standup-wed", title: "Daily Standup", dayOfWeek: 2, startHour: 9, startMinute: 0, durationMinutes: 15, description: "Async or sync check-in" },
      { id: "standup-thu", title: "Daily Standup", dayOfWeek: 3, startHour: 9, startMinute: 0, durationMinutes: 15, description: "Async or sync check-in" },
      { id: "standup-fri", title: "Daily Standup", dayOfWeek: 4, startHour: 9, startMinute: 0, durationMinutes: 15, description: "Async or sync check-in" },
      { id: "retro-sat", title: "Weekly Retro", dayOfWeek: 5, startHour: 16, startMinute: 0, durationMinutes: 15, description: "Sprint retrospective" },
    );
  } else if (cadence === "twice-weekly") {
    blocks.push(
      { id: "sync-tue", title: "Team Sync", dayOfWeek: 1, startHour: 18, startMinute: 0, durationMinutes: 30, description: "Progress & blockers" },
      { id: "sync-thu", title: "Team Sync", dayOfWeek: 3, startHour: 18, startMinute: 0, durationMinutes: 30, description: "Progress & blockers" },
      { id: "planning-sun", title: "Sprint Planning", dayOfWeek: 6, startHour: 17, startMinute: 0, durationMinutes: 30, description: "Plan the week ahead" },
    );
  } else if (cadence === "weekly") {
    blocks.push(
      { id: "weekly-wed", title: "Weekly Team Meeting", dayOfWeek: 2, startHour: 18, startMinute: 0, durationMinutes: 45, description: "Full team sync" },
      { id: "planning-sun", title: "Sprint Planning", dayOfWeek: 6, startHour: 17, startMinute: 0, durationMinutes: 30, description: "Plan the week ahead" },
      { id: "retro-sat", title: "Retrospective", dayOfWeek: 5, startHour: 16, startMinute: 0, durationMinutes: 15, description: "Reflect & improve" },
    );
  } else {
    blocks.push(
      { id: "biweekly-mon", title: "Bi-weekly Review", dayOfWeek: 0, startHour: 18, startMinute: 0, durationMinutes: 60, description: "Review & planning" },
      { id: "retro-sat", title: "Retrospective", dayOfWeek: 5, startHour: 16, startMinute: 0, durationMinutes: 15, description: "Reflect & improve" },
    );
  }

  return blocks;
}

function buildRaciMatrix(grpi: GRPIData, epics: string[]): RaciRow[] {
  const members = grpi.roles;

  return epics.map((epic) => {
    const assignments: Record<string, "R" | "A" | "C" | "I" | ""> = {};

    members.forEach((member, index) => {
      const roleLower = member.role.toLowerCase();
      const epicLower = epic.toLowerCase();

      let code: "R" | "A" | "C" | "I" | "" = "";

      if (member.scrumRole === "product-owner" && (epicLower.includes("strategy") || epicLower.includes("delivery"))) {
        code = "A";
      } else if (member.scrumRole === "scrum-master" && epicLower.includes("process")) {
        code = "A";
      } else if (roleLower.includes("research") && epicLower.includes("research")) {
        code = "R";
      } else if (roleLower.includes("design") && epicLower.includes("design")) {
        code = "R";
      } else if (roleLower.includes("develop") && (epicLower.includes("build") || epicLower === "delivery")) {
        code = "R";
      } else if (roleLower.includes("lead") && index === 0) {
        code = epicLower.includes("team") ? "A" : "C";
      } else if (roleLower.includes("coordinator") && epicLower.includes("process")) {
        code = "R";
      } else if (roleLower.includes("creative") && (epicLower.includes("writing") || epicLower.includes("design"))) {
        code = "C";
      } else {
        code = "I";
      }

      assignments[member.id] = code;
    });

    const hasR = Object.values(assignments).some((v) => v === "R");
    if (!hasR && members[0]) {
      assignments[members[0].id] = "R";
    }

    return { epic, assignments };
  });
}

function collectEpics(columns: KanbanColumn[]): string[] {
  const set = new Set<string>();
  columns.forEach((col) =>
    col.tasks.forEach((t) => {
      if (t.epic) set.add(t.epic);
    }),
  );
  return Array.from(set).sort();
}

/**
 * Generates a ready-to-use workspace from completed GRPI data.
 * Deterministic: same inputs always produce the same outputs.
 */
export function generateWorkspace(grpi: Partial<GRPIData>): WorkspaceData {
  const goals = grpi.goals;
  const roles = grpi.roles ?? [];
  const deadline =
    goals?.deadline ??
    new Date(Date.now() + 28 * 86400000).toISOString().split("T")[0];

  const fullGrpi: GRPIData = {
    goals: {
      projectName: goals?.projectName ?? "Untitled Project",
      projectTemplate: goals?.projectTemplate ?? "prototype",
      deadline,
      primaryGoal: goals?.primaryGoal ?? "",
      successCriteria: goals?.successCriteria ?? [],
      constraints: goals?.constraints ?? [],
    },
    roles,
    processes: grpi.processes ?? {
      communicationChannel: "WhatsApp",
      meetingCadence: "weekly",
      decisionMaking: "Team consensus",
      fileStorage: "Google Drive",
      feedbackStyle: "retrospectives",
      aiPolicy: "",
    },
    norms: grpi.norms ?? {
      responseTime: "24 hours",
      workingHours: "Flexible",
      conflictResolution: "Discuss as a team",
      commitmentLevel: "Accountable",
      customNorms: [],
    },
    completedAt: grpi.completedAt,
  };

  const { start: projectStart, generatedAt } = getProjectTimeline(deadline);

  const kanbanColumns = buildKanbanColumns(fullGrpi, projectStart);
  const epics = collectEpics(kanbanColumns);
  const meetingSchedule = buildMeetingSchedule(fullGrpi);

  const charter = buildInitialCharter(fullGrpi);

  return {
    teamCharter: buildTeamCharter(fullGrpi, generatedAt),
    charter,
    kanbanColumns,
    meetingTemplate: buildMeetingTemplate(fullGrpi),
    meetingSchedule,
    meetings: DEFAULT_MEETINGS.map((m) => ({ ...m })),
    raciMatrix: buildRaciMatrix(fullGrpi, epics),
    epics,
    generatedAt,
  };
}
