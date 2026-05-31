import type {
  FeedbackStyle,
  MeetingCadence,
  ProjectTemplate,
} from "./types";

export const WIZARD_STEPS = [
  {
    id: "goals",
    name: "Goals",
    description: "Define your project and what success looks like",
  },
  {
    id: "roles",
    name: "Roles",
    description: "Assign ownership so nothing falls through the cracks",
  },
  {
    id: "processes",
    name: "Processes",
    description: "Decide how you'll communicate and decide",
  },
  {
    id: "norms",
    name: "Norms",
    description: "Write the unwritten rules of your team",
  },
] as const;

export const PROJECT_TEMPLATES: {
  value: ProjectTemplate;
  emoji: string;
  label: string;
  description: string;
}[] = [
  {
    value: "research-paper",
    emoji: "📄",
    label: "Research Paper",
    description: "Academic paper with literature review and analysis",
  },
  {
    value: "business-case",
    emoji: "💼",
    label: "Business Case",
    description: "Strategic analysis with recommendations",
  },
  {
    value: "prototype",
    emoji: "🛠️",
    label: "Prototype / App",
    description: "Build and demo a working product or MVP",
  },
  {
    value: "presentation",
    emoji: "📊",
    label: "Presentation / Pitch",
    description: "Slides and live delivery to an audience",
  },
  {
    value: "consulting-report",
    emoji: "🔍",
    label: "Consulting Report",
    description: "Client-style findings and actionable advice",
  },
];

export const DEFAULT_SUCCESS_CRITERIA = [
  "Submit on time with all sections complete",
  "Every team member contributes equally",
];

export const DEFAULT_CONSTRAINTS = [
  "4-week timeline",
  "All remote / different time zones",
];

export const ROLE_SUGGESTIONS = [
  "Team Lead",
  "Researcher",
  "Designer",
  "Developer",
  "Coordinator",
  "Facilitator",
  "Creative Lead",
  "IT Support",
] as const;

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  "Team Lead":
    "Owns overall direction, coordinates deliverables, and represents the team externally.",
  Researcher:
    "Gathers sources, runs analysis, and ensures claims are evidence-backed.",
  Designer:
    "Shapes visual identity, UX flows, and presentation-ready assets.",
  Developer:
    "Builds technical solutions, prototypes, and maintains implementation quality.",
  Coordinator:
    "Tracks timelines, schedules meetings, and keeps documentation organized.",
  Facilitator:
    "Guides discussions, ensures inclusive participation, and resolves process blockers.",
  "Creative Lead":
    "Defines narrative, storytelling, and creative direction across deliverables.",
  "IT Support":
    "Manages tools, access, integrations, and technical troubleshooting.",
};

export const COVERAGE_FUNCTIONS = [
  { key: "research", label: "Research", keywords: ["research", "analyst", "lead"] },
  { key: "design", label: "Design", keywords: ["design", "creative", "ux"] },
  {
    key: "coordination",
    label: "Coordination",
    keywords: ["coordinator", "lead", "facilitator", "manager"],
  },
  {
    key: "technical",
    label: "Technical",
    keywords: ["developer", "engineer", "it", "technical", "tech"],
  },
] as const;

export const COMMUNICATION_CHANNELS = [
  "WhatsApp",
  "Slack",
  "Discord",
  "Teams",
  "Email",
  "Other",
] as const;

export const MEETING_CADENCE_OPTIONS: {
  value: MeetingCadence;
  label: string;
  description: string;
  timeCommitment: string;
}[] = [
  {
    value: "daily",
    label: "Daily standups",
    description: "Async or sync check-ins every day",
    timeCommitment: "~1–2 hrs / week",
  },
  {
    value: "twice-weekly",
    label: "Twice a week",
    description: "Two focused syncs mid-week",
    timeCommitment: "~2–3 hrs / week",
  },
  {
    value: "weekly",
    label: "Once a week",
    description: "Single team meeting + async updates",
    timeCommitment: "~1.5 hrs / week",
  },
  {
    value: "biweekly",
    label: "Every two weeks",
    description: "Bi-weekly review and planning",
    timeCommitment: "~1 hr / week avg",
  },
];

export const DECISION_OPTIONS = [
  {
    value: "consensus",
    label: "Consensus",
    description: "We discuss until everyone agrees",
  },
  {
    value: "team-lead",
    label: "Team Lead decides",
    description: "After hearing all views",
  },
  {
    value: "majority",
    label: "Majority vote",
    description: "3 out of 5 is enough",
  },
  {
    value: "delegated",
    label: "Delegated",
    description: "Whoever owns the task decides",
  },
] as const;

export const FILE_STORAGE_OPTIONS = [
  "Google Drive",
  "OneDrive",
  "Notion",
  "Dropbox",
  "GitHub",
] as const;

export const FEEDBACK_OPTIONS: {
  value: FeedbackStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "direct",
    label: "Direct & verbal",
    description: "In meetings, face-to-face",
  },
  {
    value: "structured",
    label: "Structured",
    description: "Written, with a template",
  },
  {
    value: "async-written",
    label: "Async written",
    description: "Comments in docs and boards",
  },
  {
    value: "retrospectives",
    label: "Sprint retrospectives only",
    description: "Feedback during scheduled retros",
  },
];

export const AI_POLICY_TEMPLATE =
  "We use AI for brainstorming and drafting only. All output is reviewed, rewritten, and owned by a team member before submission.";

export const RESPONSE_TIME_OPTIONS = ["2 hours", "6 hours", "24 hours", "48 hours"] as const;

export const CONFLICT_OPTIONS = [
  {
    value: "group-immediately",
    label: "Raise it in the group immediately",
  },
  {
    value: "direct-first",
    label: "Speak directly to the person first",
  },
  {
    value: "team-lead",
    label: "Bring it to the Team Lead",
  },
  {
    value: "retrospective",
    label: "Wait for the weekly retrospective",
  },
] as const;

export const DEFAULT_CUSTOM_NORMS = [
  "No last-minute dropouts without 24h notice",
  "Meetings start on time, end on time",
  "Camera on for all video calls",
];

export const TEMPLATE_LABELS: Record<ProjectTemplate, string> = {
  "research-paper": "Research Paper",
  "business-case": "Business Case",
  prototype: "Prototype / App",
  presentation: "Presentation / Pitch",
  "consulting-report": "Consulting Report",
};

export const SCRUM_ROLE_TOOLTIPS = {
  "product-owner": "Owns the vision and priorities — decides what gets built and in what order.",
  "scrum-master": "Removes blockers and protects the process — ensures the team can work effectively.",
  "dev-team": "Delivers the work — designs, builds, and tests the actual output.",
} as const;
