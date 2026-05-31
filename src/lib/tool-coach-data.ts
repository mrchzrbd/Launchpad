export type CoachTool = "notion" | "trello" | "clickup";

export interface ToolComparisonRow {
  id: string;
  label: string;
  notion: string | ComparisonBadge;
  trello: string | ComparisonBadge;
  clickup: string | ComparisonBadge;
}

export interface ComparisonBadge {
  type: "badge";
  value: string;
  level: "easy" | "medium" | "hard" | "gentle" | "moderate" | "steep";
  detail?: string;
}

export interface StarRating {
  type: "stars";
  filled: number;
  total?: number;
}

export interface ScoreRating {
  type: "score";
  score: number;
  max: number;
}

export type CellValue = string | ComparisonBadge | StarRating | ScoreRating;

export const TOOL_META: Record<
  CoachTool,
  {
    name: string;
    tagline: string;
    pros: string[];
    cons: string[];
    idealBlurb: string;
    signupUrl: string;
    badgeLabel: string;
  }
> = {
  notion: {
    name: "Notion",
    tagline:
      "The thinking person's tool — powerful if you commit, overwhelming if you don't.",
    pros: [
      "Best-in-class for writing and linked documents",
      "Flexible databases that grow with your project",
      "Huge template library including student workflows",
    ],
    cons: [
      "Can feel slow on mobile",
      "Easy to over-structure and never start working",
      "Real-time editing gets messy with 6+ people",
    ],
    idealBlurb:
      "Choose Notion when your deliverable is primarily written — research papers, consulting reports, or knowledge bases. Teams that enjoy organizing ideas in one place will love it.",
    signupUrl: "https://www.notion.so",
    badgeLabel: "N",
  },
  trello: {
    name: "Trello",
    tagline: "The one everyone actually finishes the project with.",
    pros: [
      "Up and running in under 5 minutes",
      "Kanban everyone understands instantly",
      "Best mobile app of the three",
    ],
    cons: [
      "Weak for long-form documents",
      "Gets cluttered on complex projects",
      "Limited reporting without Power-Ups",
    ],
    idealBlurb:
      "Choose Trello for short, visual sprints — pitches, event planning, or small teams who just need a board and deadlines. If your team hates tool setup, start here.",
    signupUrl: "https://trello.com",
    badgeLabel: "T",
  },
  clickup: {
    name: "ClickUp",
    tagline: "Maximum power, maximum setup cost — worth it for the right team.",
    pros: [
      "Full sprint planning, goals, and dashboards",
      "Handles technical projects without duct tape",
      "Most complete free tier for power users",
    ],
    cons: [
      "30–45 minutes before the team is operational",
      "Steep learning curve for non-technical members",
      "Mobile experience lags behind desktop",
    ],
    idealBlurb:
      "Choose ClickUp when you're building something real — apps, prototypes, or multi-month projects with clear sprints. Technical teams who want one hub for everything will grow into it.",
    signupUrl: "https://clickup.com",
    badgeLabel: "C",
  },
};

export const COMPARISON_ROWS: {
  id: string;
  label: string;
  notion: CellValue;
  trello: CellValue;
  clickup: CellValue;
}[] = [
  {
    id: "setup",
    label: "Setup Time",
    notion: {
      type: "badge",
      value: "Medium",
      level: "medium",
      detail: "15–20 min to be productive",
    },
    trello: {
      type: "badge",
      value: "Easy",
      level: "easy",
      detail: "~5 min to a working board",
    },
    clickup: {
      type: "badge",
      value: "Hard",
      level: "hard",
      detail: "30–45 min before operational",
    },
  },
  {
    id: "learning",
    label: "Learning Curve",
    notion: { type: "badge", value: "Moderate", level: "moderate", detail: "Block editor clicks once you try it" },
    trello: { type: "badge", value: "Gentle", level: "gentle", detail: "Kanban is universally understood" },
    clickup: { type: "badge", value: "Steep", level: "steep", detail: "Feature-rich = initially overwhelming" },
  },
  {
    id: "best-for",
    label: "Best For",
    notion: "Document-heavy projects, research, wikis",
    trello: "Short projects, visual teams, simple task tracking",
    clickup: "Technical teams, long projects, dashboard lovers",
  },
  {
    id: "mobile",
    label: "Mobile App",
    notion: { type: "stars", filled: 3 },
    trello: { type: "stars", filled: 4 },
    clickup: { type: "stars", filled: 2 },
  },
  {
    id: "free",
    label: "Free Plan",
    notion: "Yes — unlimited pages, up to 10 guests",
    trello: "Yes — unlimited cards, up to 10 boards",
    clickup: "Yes — unlimited tasks, storage limited",
  },
  {
    id: "collaboration",
    label: "Collaboration",
    notion: "Real-time editing, inline comments, @mentions",
    trello: "Comments, attachments, checklists, due dates",
    clickup: "Sprints, goals, docs, whiteboards — extremely powerful",
  },
  {
    id: "templates",
    label: "Templates",
    notion: "Excellent — huge library, student templates available",
    trello: "Good — focused on kanban workflows",
    clickup: "Excellent — most complete of the three",
  },
  {
    id: "team-size",
    label: "Ideal Team Size",
    notion: "2–8 people",
    trello: "2–6 people",
    clickup: "3–10 people",
  },
  {
    id: "score",
    label: "Our Score",
    notion: { type: "score", score: 8, max: 10 },
    trello: { type: "score", score: 7, max: 10 },
    clickup: { type: "score", score: 9, max: 10 },
  },
];

export interface TutorialStep {
  title: string;
  description: string;
  diagram?: "workspace" | "board" | "hierarchy";
}

export const TUTORIALS: Record<CoachTool, TutorialStep[]> = {
  notion: [
    {
      title: "Create your account",
      description:
        "Go to notion.so and sign up with your student email — you'll get extra features on the education plan.",
      diagram: "workspace",
    },
    {
      title: 'Click "New Page" → Team workspace',
      description:
        'Choose the "Team workspace" template so everyone gets a shared home base from day one.',
    },
    {
      title: "Create three sub-pages",
      description:
        "Add: Project Brief (goals & scope), Task Tracker (your board), and Meeting Notes (agendas & decisions).",
      diagram: "workspace",
    },
    {
      title: "Build your Task Tracker database",
      description:
        'In Task Tracker, type /database → Table view. Add columns: Status, Assignee, Due Date, Priority.',
    },
    {
      title: "Share with your team",
      description:
        'Top-right "Share" → Invite by email → set permission to "Can edit" for all teammates.',
    },
    {
      title: "Pin to sidebar",
      description:
        "Drag your workspace to Favorites in the left sidebar so nobody has to hunt for it.",
    },
  ],
  trello: [
    {
      title: "Create your account",
      description: "Go to trello.com and sign up free — no credit card needed.",
    },
    {
      title: "Create your project board",
      description:
        "New Board → name it your project → pick a background color the team will recognize.",
      diagram: "board",
    },
    {
      title: "Add four lists",
      description: "Create lists: Backlog, In Progress, In Review, Done.",
      diagram: "board",
    },
    {
      title: "Add cards for each task",
      description:
        "Click + Add a card on each list. Open a card to set due date, assignee, checklist, and description.",
      diagram: "board",
    },
    {
      title: "Invite teammates",
      description:
        'Board menu (top right) → "Invite to Board" → enter emails → they join instantly.',
    },
  ],
  clickup: [
    {
      title: "Create your account",
      description:
        'Go to clickup.com and select the "Student" plan during signup for the best free tier.',
    },
    {
      title: "Create a Workspace",
      description: "New Workspace → name it your team name. This is the top level.",
      diagram: "hierarchy",
    },
    {
      title: "Build the hierarchy",
      description: "Inside Workspace: create a Space → Folder → List. Yes, three levels — that's ClickUp.",
      diagram: "hierarchy",
    },
    {
      title: "Switch to Board view",
      description:
        'Open your List → top-right view picker → "Board" for the kanban feel your team expects.',
      diagram: "board",
    },
    {
      title: "Add custom fields",
      description: "List settings → Custom Fields → add Priority, Assignee, Sprint, and Epic.",
    },
    {
      title: "Set up Sprint 1",
      description:
        'Sidebar → Sprints → Create Sprint 1 with start/end dates aligned to your deadline.',
    },
    {
      title: "Invite teammates",
      description:
        "Workspace Settings → Members → Invite → teammates accept and land in your Space.",
    },
  ],
};
