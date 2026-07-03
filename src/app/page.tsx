"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import LandingPage from "@/components/landing/LandingPage";
import AppShell from "@/components/app/AppShell";
import Dashboard from "@/components/app/Dashboard";
import AiTutor from "@/components/chat/AiTutor";
import QuizCenter from "@/components/quiz/QuizCenter";
import CodeReview from "@/components/review/CodeReview";
import InterviewMode from "@/components/interview/InterviewMode";
import Analytics from "@/components/analytics/Analytics";
import LearningRoadmap from "@/components/roadmap/LearningRoadmap";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthModal } from "@/components/auth/AuthModal";

function AppContent() {
  const { currentView } = useAppStore();

  switch (currentView) {
    case "dashboard":
      return <Dashboard />;
    case "tutor":
      return <AiTutor />;
    case "quiz":
      return <QuizCenter />;
    case "review":
      return <CodeReview />;
    case "interview":
      return <InterviewMode />;
    case "analytics":
      return <Analytics />;
    case "roadmap":
      return <LearningRoadmap />;
    default:
      return <Dashboard />;
  }
}

export default function Home() {
  const { currentView, checkSession } = useAppStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (currentView === "landing") {
    return (
      <ErrorBoundary>
        <LandingPage />
        <AuthModal />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AppShell>
        <AppContent />
      </AppShell>
      <AuthModal />
    </ErrorBoundary>
  );
}