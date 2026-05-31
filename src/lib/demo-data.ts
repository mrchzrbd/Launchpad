import type { GRPIData } from "./types";

export const DEMO_MODE_SESSION_KEY = "launchpad-demo-mode";

function demoDeadline(): string {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  return d.toISOString().split("T")[0];
}

export const DEMO_DATA: GRPIData = {
  goals: {
    projectName: "Digital Collaboration Launchpad",
    projectTemplate: "prototype",
    deadline: demoDeadline(),
    primaryGoal:
      "Build a guided onboarding tool that gets student teams from 'just assigned' to 'actually working' in under 15 minutes.",
    successCriteria: [
      "Working interactive prototype delivered on June 1st",
      "15-minute presentation covering all GRPI dimensions",
      "Every team member can speak to their section",
    ],
    constraints: [
      "4-week timeline with SCRUM sprints",
      "All remote collaboration via WhatsApp + Google Drive",
      "ESCP course requirements: GRPI framework must be visible",
    ],
  },
  roles: [
    {
      id: "1",
      name: "Anna Snodgrass",
      role: "Team Lead",
      scrumRole: "product-owner",
      responsibilities: [
        "Defines sprint goals",
        "Makes final scope decisions",
        "Calls meetings only when necessary",
      ],
    },
    {
      id: "2",
      name: "Diarra Samb",
      role: "Facilitator",
      scrumRole: "scrum-master",
      responsibilities: [
        "Runs meetings",
        "Ensures everyone is heard",
        "Removes blockers within 2 hours",
      ],
    },
    {
      id: "3",
      name: "Palak Sharma",
      role: "Researcher",
      scrumRole: "dev-team",
      responsibilities: [
        "Sources evidence",
        "Validates claims",
        "Competitive analysis",
      ],
    },
    {
      id: "4",
      name: "Marc Hazarabedian",
      role: "IT Support & Coordinator",
      scrumRole: "dev-team",
      responsibilities: [
        "Shared tools and file setup",
        "Task tracking",
        "Deadline monitoring",
        "Backlog updates",
      ],
    },
    {
      id: "5",
      name: "Myriam Goupy",
      role: "Creative Lead",
      scrumRole: "dev-team",
      responsibilities: [
        "Solution concept",
        "Visual design",
        "Presentation output",
      ],
    },
  ],
  processes: {
    communicationChannel: "WhatsApp",
    meetingCadence: "weekly",
    decisionMaking: "Team Lead decides — after hearing all views",
    fileStorage: "Google Drive",
    feedbackStyle: "retrospectives",
    aiPolicy:
      "We use Claude, ChatGPT, and Gemini for brainstorming and drafting only. All output is reviewed, substantially rewritten, and owned by a team member before submission. A shared prompt log is maintained in Google Drive.",
  },
  norms: {
    responseTime: "24 hours",
    workingHours: "Mon–Fri, 9am–8pm CET",
    conflictResolution: "Raise it in the group, or directly to Anna",
    commitmentLevel: "Flexible but accountable — low drama, high quality",
    customNorms: [
      "No last-minute dropouts without 24h notice",
      "Meetings start on time, end on time",
      "Assume positive intent",
    ],
  },
};

export interface PresenterNotesContent {
  title: string;
  points: string[];
}

export const PRESENTER_NOTES: Record<string, PresenterNotesContent> = {
  "/": {
    title: "Landing Page",
    points: [
      "Open with the problem — ask the audience how many abandoned their project tool in the first week",
      "Lea is 22, ESCP Berlin. Sunday night, 11pm. She just wants to know who is doing what.",
      "The Launchpad is not another tool. It solves the cold-start problem that kills adoption of every tool.",
    ],
  },
  "/onboarding": {
    title: "GRPI Wizard",
    points: [
      "Four questions — each one maps directly to a dimension of the GRPI framework from the course",
      "Notice: no account, no pricing page, no tutorial to read. Just questions.",
      "The wizard uses the team's answers to generate everything — nothing is generic",
      "Walk through Steps 1–2 live. The audience can see it is real inputs, not a mockup.",
    ],
  },
  "/workspace": {
    title: "Auto-Generated Workspace",
    points: [
      "Everything here was generated from the GRPI answers — none of it was manually created",
      "Kanban: drag one card live. Assign it. Show the filter working.",
      "Team Charter tab: scroll to the Norms section — it's our actual team norms, auto-formatted",
      "Meeting Cadence: show the weekly standup template. Download the .ics live.",
      "Role Overview: show the RACI matrix — maps directly to Scrum role theory from session 2",
    ],
  },
  "/tool-coach": {
    title: "Tool Coach",
    points: [
      "We recommended ClickUp for our team because we chose Prototype as the template",
      "Point to the comparison table — our actual evaluation scores from Sprint 1 research",
      "We scored ClickUp 3/5 on ease of use. That insight is the entire value proposition of the Launchpad.",
      "The tutorial section shows what onboarding looks like WITHOUT the Launchpad — 7 steps just to set up ClickUp",
    ],
  },
};

export function getPresenterNotes(pathname: string): PresenterNotesContent {
  if (pathname === "/") return PRESENTER_NOTES["/"];
  if (pathname.startsWith("/onboarding")) return PRESENTER_NOTES["/onboarding"];
  if (pathname.startsWith("/workspace")) return PRESENTER_NOTES["/workspace"];
  if (pathname.startsWith("/tool-coach")) return PRESENTER_NOTES["/tool-coach"];
  return PRESENTER_NOTES["/"];
}

export type TourStepPosition = "top" | "bottom" | "left" | "right";

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: TourStepPosition;
  path: string;
  workspaceTab?: "kanban" | "charter" | "meetings" | "roster";
}

export const DEMO_TOUR_STEPS: TourStep[] = [
  {
    targetId: "hero-cta",
    title: "One click to start",
    description:
      "Lea lands here. One button. No account required. The cold-start problem begins to dissolve.",
    position: "bottom",
    path: "/",
  },
  {
    targetId: "onboarding-wizard",
    title: "The GRPI Wizard",
    description:
      "Four questions. Goals, Roles, Processes, Norms. Directly from the course framework. Takes 15 minutes.",
    position: "right",
    path: "/onboarding",
  },
  {
    targetId: "kanban-board",
    title: "Auto-generated workspace",
    description:
      "No setup. The kanban, charter, and meeting cadence are built from the team's answers. Ready to use.",
    position: "top",
    path: "/workspace",
    workspaceTab: "kanban",
  },
  {
    targetId: "team-charter-tab",
    title: "A real team charter",
    description:
      "Auto-generated from the GRPI answers. Every section maps to a course concept. Exportable as PDF.",
    position: "bottom",
    path: "/workspace",
    workspaceTab: "charter",
  },
  {
    targetId: "tool-recommendation",
    title: "Honest tool advice",
    description:
      "The Tool Coach recommends ClickUp for this team — we chose Prototype. Backed by our own evaluation scores.",
    position: "left",
    path: "/tool-coach",
  },
];
