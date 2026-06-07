export interface User {
  id: number;
  email: string;
  username: string;
  token?: string;
  isVerified?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Frontend" | "Backend" | "DevOps" | "Database" | "Mobile" | "General";
  status: "Backlog" | "Active" | "Testing" | "Done";
  progressPercentage: number;
  createdAt: string;
}

export interface PracticeLog {
  id: string;
  durationMinutes: number;
  skillAttributed: string;
  sessionNotes: string;
  loggedAt: string;
}

export interface Skill {
  key: string;
  name: string;
  category: string;
  xp: number;
  level: number;
  color: string;
}

export interface RoadmapStep {
  step_order: number;
  title: string;
  description: string;
  timeEstimate: string;
  isCompleted?: boolean;
}

export interface Roadmap {
  id: string;
  topic: string;
  generatedBy: string;
  completed: boolean;
  createdAt: string;
  steps: RoadmapStep[];
}

export interface CareerGoal {
  role: string;
  dreamCompany: string;
  targetTimeline: string;
  milestones: { id: string; title: string; completed: boolean }[];
  salaryExpectation: string;
}

export interface GithubProfile {
  username: string;
  publicReposCount: number;
  followers: number;
  totalStars: number;
  activeLanguages: { language: string; percentage: number }[];
  contributionHistoryCount: number; // For Contribution visual display grid
  avatarUrl?: string;
  bio?: string;
  repos?: { name: string; description: string; stars: number; language: string; url: string }[];
  calendarData?: { date: string; count: number; level: number }[];
}

export interface PortfolioData {
  bio: string;
  headline: string;
  featuredSnippets: { title: string; description: string; tag: string }[];
}
