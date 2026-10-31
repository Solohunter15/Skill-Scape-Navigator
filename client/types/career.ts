export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Cloud & DevOps"
  | "AI & Data"
  | "System Architecture"
  | "Leadership";

export type SkillStatus = "mastered" | "in_progress" | "gap" | "locked";

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0 - 100
  targetLevel: number; // 0 - 100
  xp: number;
  xpToNextLevel: number;
  growth: number; // percentage growth e.g. +14
  status: SkillStatus;
  prerequisites: string[]; // skill IDs
  description: string;
  position3D: [number, number, number];
  color: string;
  iconName?: string;
  marketDemandPercentile?: number; // 0 - 100
}

export interface CareerRoleBenchmark {
  id: string;
  title: string;
  tier: "Mid-Level" | "Senior" | "Staff" | "Principal" | "Executive";
  category: string;
  description: string;
  averageSalary: string;
  salaryPercentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  requiredSkills: Record<string, number>; // skillId -> targetLevel
  milestones: string[];
}

export interface ScenarioChoice {
  id: string;
  text: string;
  isOptimal: boolean;
  feedback: string;
  xpReward: number;
}

export interface ScenarioQuest {
  id: string;
  title: string;
  category: SkillCategory;
  skillId: string;
  difficulty: "Foundational" | "Intermediate" | "Architect" | "Master";
  xpReward: number;
  scenario: string;
  context: string;
  choices: ScenarioChoice[];
  completed: boolean;
  userSelectedChoiceId?: string;
}

export interface CareerNudge {
  id: string;
  title: string;
  description: string;
  type: "learning" | "skill" | "networking" | "architecture";
  priority: "high" | "medium" | "low";
  source: string;
  actionLabel: string;
  skillId?: string;
  questId?: string;
  completed: boolean;
  createdAt: string;
}

export interface CareerProfile {
  firstName: string;
  lastName: string;
  email: string;
  currentTitle: string;
  targetRoleId: string;
  totalXp: number;
  level: number;
  streakDays: number;
  marketReadinessScore: number;
  salaryProjection: string;
  avatarUrl: string;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  source: "GitHub" | "Calendar" | "Jira" | "Coursera" | "Agent";
  message: string;
  xpEarned: number;
  type: "commit" | "review" | "deepwork" | "course" | "nudge";
}

export interface IntegrationItem {
  id: string;
  name: string;
  provider: "github" | "calendar" | "jira" | "coursera" | "slack";
  category: string;
  connected: boolean;
  lastSync: string;
  telemetryCount: number;
  description: string;
}
