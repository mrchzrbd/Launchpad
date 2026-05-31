import type { CoachTool } from "./tool-coach-data";
import type { GRPIData, ProjectTemplate, TeamMember } from "./types";

export interface ToolRecommendation {
  tool: CoachTool;
  headline: string;
  reason: string;
}

function hasTechnicalRole(roles: TeamMember[]): boolean {
  return roles.some((m) => {
    const r = m.role.toLowerCase();
    return (
      r.includes("developer") ||
      r.includes("engineer") ||
      r.includes("it support") ||
      r.includes("technical")
    );
  });
}

function recommendForTemplate(
  template: ProjectTemplate,
  teamSize: number,
  technical: boolean,
): ToolRecommendation {
  if (template === "prototype" && technical) {
    return {
      tool: "clickup",
      headline: "ClickUp fits your build",
      reason:
        "You have a technical team building something real — ClickUp's task hierarchy and sprint view will serve you better than Notion's freeform pages.",
    };
  }

  if (template === "research-paper" || template === "consulting-report") {
    return {
      tool: "notion",
      headline: "Notion fits your project",
      reason:
        "Your project is document-heavy. Notion's linked databases and writing experience are built for research and long-form deliverables.",
    };
  }

  if (template === "presentation" && teamSize <= 3) {
    return {
      tool: "trello",
      headline: "Trello fits your sprint",
      reason:
        "For a short sprint on a visual deliverable with a small team, Trello's simplicity wins. You'll actually use it instead of abandoning it by week two.",
    };
  }

  if (template === "business-case") {
    return {
      tool: "notion",
      headline: "Notion fits your analysis",
      reason:
        "Business cases live in documents, slides, and structured analysis. Notion keeps your research, frameworks, and task list in one linked workspace.",
    };
  }

  if (template === "prototype") {
    return {
      tool: "clickup",
      headline: "ClickUp fits your prototype",
      reason:
        "Even without a dedicated developer, prototypes benefit from sprints and clear task ownership. ClickUp gives you structure without starting from a blank page.",
    };
  }

  if (teamSize <= 3) {
    return {
      tool: "trello",
      headline: "Trello fits your team size",
      reason:
        "Small teams move fastest with less setup. Trello gets everyone on the same board in minutes.",
    };
  }

  return {
    tool: "notion",
    headline: "Notion is our default pick",
    reason:
      "For most student projects, Notion balances flexibility and collaboration. Start with their team template and adjust as you go.",
  };
}

export function recommendFromGRPI(grpi: GRPIData): ToolRecommendation {
  const teamSize = grpi.roles.length;
  const technical = hasTechnicalRole(grpi.roles);
  return recommendForTemplate(grpi.goals.projectTemplate, teamSize, technical);
}

export type QuizProjectType =
  | "research-writing"
  | "app-prototype"
  | "presentation"
  | "business-analysis";

export type QuizTeamSize = "2-3" | "4-5" | "6+";

export type QuizComfort = "very" | "somewhat" | "not";

export interface QuizAnswers {
  projectType: QuizProjectType;
  teamSize: QuizTeamSize;
  comfort: QuizComfort;
}

function quizTeamSizeToNumber(size: QuizTeamSize): number {
  if (size === "2-3") return 3;
  if (size === "4-5") return 5;
  return 6;
}

function quizProjectToTemplate(project: QuizProjectType): ProjectTemplate {
  switch (project) {
    case "research-writing":
      return "research-paper";
    case "app-prototype":
      return "prototype";
    case "presentation":
      return "presentation";
    case "business-analysis":
      return "business-case";
  }
}

export function recommendFromQuiz(answers: QuizAnswers): ToolRecommendation {
  const teamSize = quizTeamSizeToNumber(answers.teamSize);
  const template = quizProjectToTemplate(answers.projectType);
  const technical =
    answers.projectType === "app-prototype" && answers.comfort !== "not";

  const base = recommendForTemplate(template, teamSize, technical);

  if (answers.comfort === "not") {
    if (base.tool === "clickup") {
      return {
        tool: "trello",
        headline: "Trello — simpler for your team",
        reason:
          "You said your team isn't comfortable with new tools. Trello's kanban board is the lowest-friction option — you'll be working in 5 minutes, not 45.",
      };
    }
    if (base.tool === "notion" && answers.projectType === "app-prototype") {
      return {
        tool: "trello",
        headline: "Trello — keep it basic",
        reason:
          "Building an app is complex enough without a complex tool. Trello tracks tasks without asking everyone to learn databases first.",
      };
    }
  }

  if (answers.comfort === "very" && answers.projectType === "app-prototype") {
    return {
      tool: "clickup",
      headline: "ClickUp — use the power",
      reason:
        "Your team is ready for a real project tool. ClickUp's sprints, custom fields, and dashboards match a technical build — invest the setup time once.",
    };
  }

  return base;
}
