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

export interface TeamCharterData {
  purpose?: string;
  vision?: string;
  successCriteria?: string[];
  constraints?: string[];
  communicationNorms?: string;
  meetingNorms?: string;
  feedbackNorms?: string;
  conflictResolution?: string;
  aiPolicy?: string;
  customNorms?: string[];
}

export type TeamMeetingDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type TeamMeetingType =
  | "standup"
  | "planning"
  | "review"
  | "retrospective"
  | "custom";

export interface TeamMeeting {
  id: string;
  title: string;
  day: TeamMeetingDay;
  time: string;
  duration: number;
  type: TeamMeetingType;
  isAsync: boolean;
  agenda: string[];
  recurring: boolean;
}

export interface WorkspaceData {
  teamCharter: string;
  charter?: TeamCharterData;
  kanbanColumns: KanbanColumn[];
  meetingTemplate: string;
  meetingSchedule: MeetingBlock[];
  meetings?: TeamMeeting[];
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
