export type ProjectTemplate =
  | "research-paper"
  | "business-case"
  | "prototype"
  | "presentation"
  | "consulting-report";

export type MeetingCadence = "daily" | "twice-weekly" | "weekly" | "biweekly";

export type FeedbackStyle =
  | "direct"
  | "structured"
  | "async-written"
  | "retrospectives";

export type CollaborationTool =
  | "notion"
  | "trello"
  | "clickup"
  | "asana"
  | "google-workspace";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
  scrumRole?: "product-owner" | "scrum-master" | "dev-team";
  avatar?: string;
}

export interface TeamGoals {
  projectName: string;
  projectTemplate: ProjectTemplate;
  deadline: string;
  primaryGoal: string;
  successCriteria: string[];
  constraints: string[];
}

export interface TeamProcesses {
  communicationChannel: string;
  meetingCadence: MeetingCadence;
  decisionMaking: string;
  fileStorage: string;
  feedbackStyle: FeedbackStyle;
  aiPolicy: string;
}

export interface TeamNorms {
  responseTime: string;
  workingHours: string;
  conflictResolution: string;
  commitmentLevel: string;
  customNorms: string[];
}

export interface GRPIData {
  goals: TeamGoals;
  roles: TeamMember[];
  processes: TeamProcesses;
  norms: TeamNorms;
  completedAt?: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "critical";
  epic?: string;
  tags: string[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
  color: string;
}

export interface MeetingBlock {
  id: string;
  title: string;
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  description: string;
}

export interface RaciRow {
  epic: string;
  assignments: Record<string, "R" | "A" | "C" | "I" | "">;
}

export interface WorkspaceData {
  teamCharter: string;
  kanbanColumns: KanbanColumn[];
  meetingTemplate: string;
  meetingSchedule: MeetingBlock[];
  raciMatrix: RaciRow[];
  epics: string[];
  generatedAt: string;
}

export interface LaunchpadState {
  currentStep: number;
  grpi: Partial<GRPIData>;
  workspace?: WorkspaceData;
  isComplete: boolean;
}
