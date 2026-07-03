import { create } from "zustand";
import type { ViewType, Message, QuizState, RoadmapNode, UserProfile, InterviewQuestion } from "@/types";

interface AppState {
  // Navigation
  currentView: ViewType;
  previousView: ViewType | null;
  setView: (view: ViewType) => void;
  goBack: () => void;

  // User
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;

  // Chat
  chatMessages: Message[];
  chatLoading: boolean;
  addChatMessage: (message: Message) => void;
  setChatLoading: (loading: boolean) => void;
  clearChat: () => void;

  // Quiz
  quizState: QuizState | null;
  setQuizState: (quiz: QuizState | null) => void;
  answerQuestion: (answerIndex: number) => void;

  // Interview
  interviewQuestions: InterviewQuestion[];
  interviewCurrentIndex: number;
  interviewTimer: number;
  interviewActive: boolean;
  setInterviewQuestions: (questions: InterviewQuestion[]) => void;
  setInterviewCurrentIndex: (index: number) => void;
  setInterviewTimer: (time: number) => void;
  setInterviewActive: (active: boolean) => void;

  // Code Review
  reviewCode: string;
  reviewLanguage: string;
  reviewResult: string | null;
  reviewLoading: boolean;
  setReviewCode: (code: string) => void;
  setReviewLanguage: (lang: string) => void;
  setReviewResult: (result: string | null) => void;
  setReviewLoading: (loading: boolean) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const defaultUser: UserProfile = {
  name: "Alex Chen",
  email: "alex@example.com",
  level: "Intermediate",
  streak: 12,
  xp: 2450,
  totalQuizzes: 34,
  totalInterviews: 8,
  topicsCompleted: 15,
};

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentView: "landing",
  previousView: null,
  setView: (view) =>
    set((state) => ({
      previousView: state.currentView,
      currentView: view,
      sidebarOpen: false,
    })),
  goBack: () =>
    set((state) => ({
      currentView: state.previousView || "dashboard",
      previousView: null,
    })),

  // User
  user: defaultUser,
  setUser: (partial) =>
    set((state) => ({
      user: { ...state.user, ...partial },
    })),
  isAuthenticated: false,
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  showAuthModal: false,
  setShowAuthModal: (show) => set({ showAuthModal: show }),
  logout: async () => {
    try {
      await fetch("/api/auth/me", { method: "POST" });
    } catch (e) {
      console.error("Logout request failed:", e);
    }
    set({
      user: defaultUser,
      isAuthenticated: false,
      currentView: "landing",
    });
  },
  checkSession: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({
          user: data,
          isAuthenticated: true,
        });
      }
    } catch (e) {
      console.error("Session verification failed", e);
    }
  },

  // Chat
  chatMessages: [],
  chatLoading: false,
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  setChatLoading: (loading) => set({ chatLoading: loading }),
  clearChat: () => set({ chatMessages: [] }),

  // Quiz
  quizState: null,
  setQuizState: (quiz) => set({ quizState: quiz }),
  answerQuestion: (answerIndex) =>
    set((state) => {
      if (!state.quizState) return {};
      const newAnswers = [...state.quizState.answers, answerIndex];
      const nextIndex = state.quizState.currentIndex + 1;
      const isComplete = nextIndex >= state.quizState.questions.length;
      const correctCount = newAnswers.reduce((acc, ans, idx) => {
        if (ans === state.quizState!.questions[idx].correctIndex) acc++;
        return acc;
      }, 0);

      return {
        quizState: {
          ...state.quizState,
          answers: newAnswers,
          currentIndex: nextIndex,
          isComplete,
          score: Math.round((correctCount / state.quizState.questions.length) * 100),
        },
      };
    }),

  // Interview
  interviewQuestions: [],
  interviewCurrentIndex: 0,
  interviewTimer: 0,
  interviewActive: false,
  setInterviewQuestions: (questions) => set({ interviewQuestions: questions }),
  setInterviewCurrentIndex: (index) => set({ interviewCurrentIndex: index }),
  setInterviewTimer: (time) => set({ interviewTimer: time }),
  setInterviewActive: (active) => set({ interviewActive: active }),

  // Code Review
  reviewCode: `function findTwoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return null;
}`,
  reviewLanguage: "javascript",
  reviewResult: null,
  reviewLoading: false,
  setReviewCode: (code) => set({ reviewCode: code }),
  setReviewLanguage: (lang) => set({ reviewLanguage: lang }),
  setReviewResult: (result) => set({ reviewResult: result }),
  setReviewLoading: (loading) => set({ reviewLoading: loading }),

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));