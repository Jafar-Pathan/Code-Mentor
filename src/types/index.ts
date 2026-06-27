export type ViewType =
  | "landing"
  | "dashboard"
  | "tutor"
  | "quiz"
  | "review"
  | "interview"
  | "analytics"
  | "roadmap";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export interface QuizState {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: number[];
  startTime: number;
  timeLimit: number;
  isComplete: boolean;
  score: number;
}

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked" | "available";
  xp: number;
  topics: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: "coding" | "behavioral" | "system-design";
  difficulty: string;
  hints: string[];
  timeLimit: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  level: string;
  streak: number;
  xp: number;
  totalQuizzes: number;
  totalInterviews: number;
  topicsCompleted: number;
}