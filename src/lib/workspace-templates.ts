import type { KanbanTask, ProjectTemplate } from "./types";

export type TaskPhase = "early" | "mid" | "late";

export interface TaskSeed {
  id: string;
  title: string;
  columnId: "backlog" | "in-progress" | "in-review" | "done";
  epic: string;
  priority: KanbanTask["priority"];
  roleKeywords: string[];
  phase: TaskPhase;
}

export const KANBAN_COLUMNS = [
  { id: "backlog", title: "Backlog", color: "#8A8AA8" },
  { id: "in-progress", title: "In Progress", color: "#3A86FF" },
  { id: "in-review", title: "In Review", color: "#E9C46A" },
  { id: "done", title: "Done", color: "#2D6A4F" },
] as const;

const PROTOTYPE_TASKS: TaskSeed[] = [
  { id: "proto-01", title: "Define target group and persona", columnId: "backlog", epic: "Research", priority: "high", roleKeywords: ["research"], phase: "early" },
  { id: "proto-02", title: "Competitive analysis — existing tools", columnId: "backlog", epic: "Research", priority: "medium", roleKeywords: ["research"], phase: "early" },
  { id: "proto-03", title: "Feature prioritization workshop", columnId: "backlog", epic: "Strategy", priority: "medium", roleKeywords: ["lead", "product"], phase: "early" },
  { id: "proto-04", title: "AI use policy documentation", columnId: "backlog", epic: "Process", priority: "low", roleKeywords: ["coordinator", "lead"], phase: "early" },
  { id: "proto-05", title: "GRPI framework setup", columnId: "in-progress", epic: "Team Setup", priority: "critical", roleKeywords: ["lead", "coordinator"], phase: "early" },
  { id: "proto-06", title: "Sprint planning — Sprint 1", columnId: "in-progress", epic: "Process", priority: "high", roleKeywords: ["scrum", "lead"], phase: "mid" },
  { id: "proto-07", title: "Wireframe core user flows", columnId: "in-progress", epic: "Design", priority: "high", roleKeywords: ["design"], phase: "mid" },
  { id: "proto-08", title: "Set up development environment", columnId: "in-progress", epic: "Build", priority: "medium", roleKeywords: ["developer", "it"], phase: "mid" },
  { id: "proto-09", title: "Team charter draft", columnId: "in-review", epic: "Team Setup", priority: "high", roleKeywords: ["coordinator"], phase: "early" },
  { id: "proto-10", title: "MVP scope review", columnId: "in-review", epic: "Strategy", priority: "high", roleKeywords: ["lead", "product"], phase: "mid" },
  { id: "proto-11", title: "Team formed and named", columnId: "done", epic: "Team Setup", priority: "medium", roleKeywords: ["lead"], phase: "early" },
  { id: "proto-12", title: "Onboarding complete", columnId: "done", epic: "Process", priority: "medium", roleKeywords: ["coordinator"], phase: "early" },
  { id: "proto-13", title: "Build MVP core features", columnId: "backlog", epic: "Build", priority: "critical", roleKeywords: ["developer"], phase: "mid" },
  { id: "proto-14", title: "Usability testing round 1", columnId: "backlog", epic: "Design", priority: "medium", roleKeywords: ["design", "research"], phase: "late" },
  { id: "proto-15", title: "Final demo preparation", columnId: "backlog", epic: "Delivery", priority: "high", roleKeywords: ["lead", "creative"], phase: "late" },
  { id: "proto-16", title: "Submit prototype & documentation", columnId: "backlog", epic: "Delivery", priority: "critical", roleKeywords: ["lead"], phase: "late" },
];

const RESEARCH_PAPER_TASKS: TaskSeed[] = [
  { id: "rp-01", title: "Define research question & scope", columnId: "backlog", epic: "Research", priority: "critical", roleKeywords: ["research", "lead"], phase: "early" },
  { id: "rp-02", title: "Literature review — initial sources", columnId: "backlog", epic: "Research", priority: "high", roleKeywords: ["research"], phase: "early" },
  { id: "rp-03", title: "Develop theoretical framework", columnId: "backlog", epic: "Analysis", priority: "high", roleKeywords: ["research", "lead"], phase: "early" },
  { id: "rp-04", title: "Methodology section outline", columnId: "backlog", epic: "Writing", priority: "medium", roleKeywords: ["research"], phase: "mid" },
  { id: "rp-05", title: "Data collection plan", columnId: "in-progress", epic: "Research", priority: "high", roleKeywords: ["research"], phase: "mid" },
  { id: "rp-06", title: "GRPI framework setup", columnId: "in-progress", epic: "Team Setup", priority: "critical", roleKeywords: ["coordinator", "lead"], phase: "early" },
  { id: "rp-07", title: "Draft introduction chapter", columnId: "in-progress", epic: "Writing", priority: "high", roleKeywords: ["research", "lead"], phase: "mid" },
  { id: "rp-08", title: "Citation style guide agreed", columnId: "in-review", epic: "Process", priority: "medium", roleKeywords: ["coordinator"], phase: "early" },
  { id: "rp-09", title: "Team charter draft", columnId: "in-review", epic: "Team Setup", priority: "high", roleKeywords: ["coordinator"], phase: "early" },
  { id: "rp-10", title: "Team formed and named", columnId: "done", epic: "Team Setup", priority: "medium", roleKeywords: ["lead"], phase: "early" },
  { id: "rp-11", title: "Onboarding complete", columnId: "done", epic: "Process", priority: "medium", roleKeywords: ["coordinator"], phase: "early" },
  { id: "rp-12", title: "Analyze collected data", columnId: "backlog", epic: "Analysis", priority: "high", roleKeywords: ["research"], phase: "mid" },
  { id: "rp-13", title: "Write discussion & conclusion", columnId: "backlog", epic: "Writing", priority: "high", roleKeywords: ["research", "lead"], phase: "late" },
  { id: "rp-14", title: "Peer review within team", columnId: "backlog", epic: "Review", priority: "high", roleKeywords: ["lead"], phase: "late" },
  { id: "rp-15", title: "Format & proofread final paper", columnId: "backlog", epic: "Delivery", priority: "critical", roleKeywords: ["coordinator"], phase: "late" },
  { id: "rp-16", title: "Submit final paper", columnId: "backlog", epic: "Delivery", priority: "critical", roleKeywords: ["lead"], phase: "late" },
];

const BUSINESS_CASE_TASKS: TaskSeed[] = [
  { id: "bc-01", title: "Define case scope & client context", columnId: "backlog", epic: "Strategy", priority: "critical", roleKeywords: ["lead"], phase: "early" },
  { id: "bc-02", title: "Market & industry analysis", columnId: "backlog", epic: "Research", priority: "high", roleKeywords: ["research"], phase: "early" },
  { id: "bc-03", title: "Financial data gathering", columnId: "backlog", epic: "Analysis", priority: "high", roleKeywords: ["research", "lead"], phase: "early" },
  { id: "bc-04", title: "Stakeholder mapping", columnId: "backlog", epic: "Strategy", priority: "medium", roleKeywords: ["coordinator"], phase: "early" },
  { id: "bc-05", title: "GRPI framework setup", columnId: "in-progress", epic: "Team Setup", priority: "critical", roleKeywords: ["lead", "coordinator"], phase: "early" },
  { id: "bc-06", title: "Build issue tree / hypothesis map", columnId: "in-progress", epic: "Analysis", priority: "high", roleKeywords: ["lead", "research"], phase: "mid" },
  { id: "bc-07", title: "Draft executive summary outline", columnId: "in-progress", epic: "Writing", priority: "medium", roleKeywords: ["lead", "creative"], phase: "mid" },
  { id: "bc-08", title: "Team charter draft", columnId: "in-review", epic: "Team Setup", priority: "high", roleKeywords: ["coordinator"], phase: "early" },
  { id: "bc-09", title: "Recommendations framework review", columnId: "in-review", epic: "Strategy", priority: "high", roleKeywords: ["lead"], phase: "mid" },
  { id: "bc-10", title: "Team formed and named", columnId: "done", epic: "Team Setup", priority: "medium", roleKeywords: ["lead"], phase: "early" },
  { id: "bc-11", title: "Onboarding complete", columnId: "done", epic: "Process", priority: "medium", roleKeywords: ["coordinator"], phase: "early" },
  { id: "bc-12", title: "Develop strategic options", columnId: "backlog", epic: "Strategy", priority: "high", roleKeywords: ["lead", "research"], phase: "mid" },
  { id: "bc-13", title: "Create financial model", columnId: "backlog", epic: "Analysis", priority: "high", roleKeywords: ["research"], phase: "mid" },
  { id: "bc-14", title: "Design slide deck structure", columnId: "backlog", epic: "Design", priority: "medium", roleKeywords: ["design", "creative"], phase: "late" },
  { id: "bc-15", title: "Final case write-up", columnId: "backlog", epic: "Delivery", priority: "critical", roleKeywords: ["lead", "creative"], phase: "late" },
  { id: "bc-16", title: "Present to jury / submit case", columnId: "backlog", epic: "Delivery", priority: "critical", roleKeywords: ["lead"], phase: "late" },
];

const PRESENTATION_TASKS: TaskSeed[] = [
  { id: "pres-01", title: "Define pitch narrative & audience", columnId: "backlog", epic: "Strategy", priority: "critical", roleKeywords: ["lead", "creative"], phase: "early" },
  { id: "pres-02", title: "Research market & competitors", columnId: "backlog", epic: "Research", priority: "high", roleKeywords: ["research"], phase: "early" },
  { id: "pres-03", title: "Storyboard slide flow", columnId: "backlog", epic: "Design", priority: "high", roleKeywords: ["design", "creative"], phase: "early" },
  { id: "pres-04", title: "Assign speaker roles", columnId: "backlog", epic: "Team Setup", priority: "medium", roleKeywords: ["lead", "facilitator"], phase: "early" },
  { id: "pres-05", title: "GRPI framework setup", columnId: "in-progress", epic: "Team Setup", priority: "critical", roleKeywords: ["coordinator"], phase: "early" },
  { id: "pres-06", title: "Draft slide content — Act 1", columnId: "in-progress", epic: "Writing", priority: "high", roleKeywords: ["creative", "lead"], phase: "mid" },
  { id: "pres-07", title: "Visual design system for deck", columnId: "in-progress", epic: "Design", priority: "high", roleKeywords: ["design"], phase: "mid" },
  { id: "pres-08", title: "Team charter draft", columnId: "in-review", epic: "Team Setup", priority: "high", roleKeywords: ["coordinator"], phase: "early" },
  { id: "pres-09", title: "Pitch script review", columnId: "in-review", epic: "Writing", priority: "high", roleKeywords: ["lead", "facilitator"], phase: "mid" },
  { id: "pres-10", title: "Team formed and named", columnId: "done", epic: "Team Setup", priority: "medium", roleKeywords: ["lead"], phase: "early" },
  { id: "pres-11", title: "Onboarding complete", columnId: "done", epic: "Process", priority: "medium", roleKeywords: ["coordinator"], phase: "early" },
  { id: "pres-12", title: "Build full slide deck", columnId: "backlog", epic: "Design", priority: "critical", roleKeywords: ["design", "creative"], phase: "mid" },
  { id: "pres-13", title: "Rehearsal run #1", columnId: "backlog", epic: "Delivery", priority: "high", roleKeywords: ["facilitator", "lead"], phase: "late" },
  { id: "pres-14", title: "Q&A preparation", columnId: "backlog", epic: "Strategy", priority: "medium", roleKeywords: ["research", "lead"], phase: "late" },
  { id: "pres-15", title: "Final rehearsal & timing check", columnId: "backlog", epic: "Delivery", priority: "high", roleKeywords: ["facilitator"], phase: "late" },
  { id: "pres-16", title: "Deliver final presentation", columnId: "backlog", epic: "Delivery", priority: "critical", roleKeywords: ["lead"], phase: "late" },
];

const CONSULTING_REPORT_TASKS: TaskSeed[] = [
  { id: "cr-01", title: "Client brief analysis", columnId: "backlog", epic: "Research", priority: "critical", roleKeywords: ["lead", "research"], phase: "early" },
  { id: "cr-02", title: "Stakeholder interview plan", columnId: "backlog", epic: "Strategy", priority: "high", roleKeywords: ["coordinator", "lead"], phase: "early" },
  { id: "cr-03", title: "Data request & collection", columnId: "backlog", epic: "Research", priority: "high", roleKeywords: ["research"], phase: "early" },
  { id: "cr-04", title: "Problem statement refinement", columnId: "backlog", epic: "Strategy", priority: "high", roleKeywords: ["lead"], phase: "early" },
  { id: "cr-05", title: "GRPI framework setup", columnId: "in-progress", epic: "Team Setup", priority: "critical", roleKeywords: ["coordinator"], phase: "early" },
  { id: "cr-06", title: "Analysis framework setup", columnId: "in-progress", epic: "Analysis", priority: "high", roleKeywords: ["research", "lead"], phase: "mid" },
  { id: "cr-07", title: "Draft findings outline", columnId: "in-progress", epic: "Writing", priority: "high", roleKeywords: ["lead", "research"], phase: "mid" },
  { id: "cr-08", title: "Team charter draft", columnId: "in-review", epic: "Team Setup", priority: "high", roleKeywords: ["coordinator"], phase: "early" },
  { id: "cr-09", title: "Recommendations peer review", columnId: "in-review", epic: "Strategy", priority: "high", roleKeywords: ["lead"], phase: "mid" },
  { id: "cr-10", title: "Team formed and named", columnId: "done", epic: "Team Setup", priority: "medium", roleKeywords: ["lead"], phase: "early" },
  { id: "cr-11", title: "Onboarding complete", columnId: "done", epic: "Process", priority: "medium", roleKeywords: ["coordinator"], phase: "early" },
  { id: "cr-12", title: "Deep-dive analysis sections", columnId: "backlog", epic: "Analysis", priority: "high", roleKeywords: ["research"], phase: "mid" },
  { id: "cr-13", title: "Executive summary draft", columnId: "backlog", epic: "Writing", priority: "critical", roleKeywords: ["lead", "creative"], phase: "late" },
  { id: "cr-14", title: "Client-ready report formatting", columnId: "backlog", epic: "Design", priority: "medium", roleKeywords: ["design", "coordinator"], phase: "late" },
  { id: "cr-15", title: "Internal quality review", columnId: "backlog", epic: "Review", priority: "high", roleKeywords: ["lead"], phase: "late" },
  { id: "cr-16", title: "Submit consulting report", columnId: "backlog", epic: "Delivery", priority: "critical", roleKeywords: ["lead"], phase: "late" },
];

export const TEMPLATE_TASKS: Record<ProjectTemplate, TaskSeed[]> = {
  prototype: PROTOTYPE_TASKS,
  "research-paper": RESEARCH_PAPER_TASKS,
  "business-case": BUSINESS_CASE_TASKS,
  presentation: PRESENTATION_TASKS,
  "consulting-report": CONSULTING_REPORT_TASKS,
};
