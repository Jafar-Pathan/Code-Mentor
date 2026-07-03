"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Flame,
  Clock,
  Trophy,
  Target,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Code,
  MessageSquare,
  Zap,
  CheckCircle2,
  Play,
  Mic,
} from "lucide-react";

// ─── Row 1: Welcome Banner ─────────────────────────────────────────
function WelcomeBanner() {
  const { user, setView } = useAppStore();
  const xpProgress = Math.round((user.xp / 3000) * 100);

  return (
    <Card className="relative overflow-hidden border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
      <CardContent className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Welcome back, {user.name ? user.name.split(" ")[0] : "Student"}!
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="font-medium text-foreground">{user.streak} days</span> streak
            </div>
            <div className="flex items-center gap-2 min-w-[200px]">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {user.xp}/3000 XP
              </span>
              <Progress value={xpProgress} className="h-2 flex-1" />
            </div>
          </div>
        </div>
        <Button onClick={() => setView("tutor")} className="shrink-0">
          Continue Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Row 2: Stat Cards ─────────────────────────────────────────────

function CircularProgress({
  value,
  max,
  size = 80,
  strokeWidth = 6,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * 100;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-primary/20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-700"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-foreground text-sm font-bold"
        transform={`rotate(90 ${size / 2} ${size / 2})`}
      >
        {value}/{max}
      </text>
    </svg>
  );
}

function StatCards({ data }: { data: any }) {
  const { user } = useAppStore();
  const completed = data?.overview?.completedTopics ?? 0;
  const total = data?.overview?.totalTopics ?? 20;
  const avgScore = data?.overview?.averageMastery ?? 0;
  const minutes = data?.overview?.weeklyMinutes ?? 0;
  const hours = (minutes / 60).toFixed(1);

  const stats = [
    {
      title: "Topics Mastered",
      value: `${completed}/${total}`,
      icon: Trophy,
      color: "text-primary",
      custom: <CircularProgress value={completed} max={total} />,
    },
    {
      title: "Quiz Score Avg",
      value: `${avgScore}%`,
      icon: Target,
      trend: avgScore > 0 ? "+5%" : undefined,
      color: "text-emerald-400",
    },
    {
      title: "Interview Prep",
      value: String(user.totalInterviews),
      subtitle: "sessions completed",
      icon: Mic,
      color: "text-purple-400",
    },
    {
      title: "Study Time",
      value: `${hours}h`,
      subtitle: "this week",
      icon: Clock,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="flex flex-col items-center gap-3 py-5 text-center">
              {stat.custom ? (
                stat.custom
              ) : (
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground">{stat.title}</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  {stat.trend && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/15 text-emerald-400 border-0 text-xs gap-0.5"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </Badge>
                  )}
                </div>
                {stat.subtitle && (
                  <span className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Row 3: Recent Activity + Weak Topics ──────────────────────────

const recentActivities = [
  {
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    label: "Completed Arrays Quiz",
    detail: "Score: 85%",
    time: "2 hours ago",
  },
  {
    icon: BookOpen,
    iconColor: "text-primary",
    label: "Started Trees topic",
    detail: "Chapter 3 of 8",
    time: "5 hours ago",
  },
  {
    icon: Code,
    iconColor: "text-amber-400",
    label: "Code Review: Two Sum",
    detail: "Optimized from O(n²) to O(n)",
    time: "Yesterday",
  },
  {
    icon: MessageSquare,
    iconColor: "text-purple-400",
    label: "AI Tutor session",
    detail: "Recursion & Backtracking",
    time: "Yesterday",
  },
  {
    icon: Zap,
    iconColor: "text-orange-400",
    label: "Earned 150 XP",
    detail: "Streak bonus: Day 12",
    time: "2 days ago",
  },
];

function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
          {recentActivities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent/50"
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted ${activity.iconColor}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {activity.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activity.detail}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const weakTopics = [
  { name: "Sliding Window", mastery: 35, color: "bg-red-400" },
  { name: "Graphs", mastery: 40, color: "bg-orange-400" },
  { name: "Dynamic Programming", mastery: 25, color: "bg-red-500" },
];

function WeakTopics({ weakTopics = [] }: { weakTopics?: any[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Weak Topics</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col gap-4">
          {weakTopics.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No weak topics identified yet. Start learning to see analytics!
            </p>
          ) : (
            weakTopics.map((topic) => {
              const mastery = topic.mastery ?? 0;
              const color = mastery < 30 ? "bg-red-500" : mastery < 50 ? "bg-red-400" : "bg-orange-400";
              return (
                <button
                  key={topic.topic}
                  onClick={() => console.log(`Navigate to topic: ${topic.topic}`)}
                  className="flex flex-col gap-2 rounded-lg p-2.5 text-left transition-colors hover:bg-accent/50 cursor-pointer w-full"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {topic.topic}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {mastery}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${color}`}
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Row 4: Recommended Next + Weekly Activity ─────────────────────

const recommendedSteps = [
  {
    icon: Target,
    label: "Practice Sliding Window",
    description: "Strengthen your weakest area",
    action: "quiz" as const,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
  {
    icon: BookOpen,
    label: "Review Tree Traversals",
    description: "In-order, Pre-order, Post-order",
    action: "tutor" as const,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Mic,
    label: "Take a Mock Interview",
    description: "Test your readiness",
    action: "interview" as const,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
];

function RecommendedNext() {
  const { setView } = useAppStore();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Recommended Next</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col gap-3">
          {recommendedSteps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.label}
                onClick={() => setView(step.action)}
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-left transition-all hover:border-primary/30 hover:bg-accent/30 cursor-pointer w-full group"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${step.bgColor} ${step.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const weeklyData = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 40 },
  { day: "Wed", value: 85 },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 90 },
  { day: "Sat", value: 30 },
  { day: "Sun", value: 70 },
];

function WeeklyActivity({ weeklyActivity = [] }: { weeklyActivity?: any[] }) {
  const chartData = weeklyActivity.length > 0 ? weeklyActivity : [
    { day: "Mon", minutes: 0 },
    { day: "Tue", minutes: 0 },
    { day: "Wed", minutes: 0 },
    { day: "Thu", minutes: 0 },
    { day: "Fri", minutes: 0 },
    { day: "Sat", minutes: 0 },
    { day: "Sun", minutes: 0 },
  ];

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex items-end justify-between gap-2 h-40">
          {chartData.map((d) => {
            const pct = Math.round((d.minutes / maxMinutes) * 100);
            return (
              <div
                key={d.day}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="w-full flex justify-center" style={{ height: "100px" }}>
                  <div className="w-full max-w-[36px] flex flex-col justify-end">
                    <div
                      className="w-full rounded-t-md bg-primary/80 transition-all duration-500 hover:bg-primary"
                      style={{ height: `${pct}%` }}
                      title={`${d.minutes} mins study time`}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────

export default function Dashboard() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Dashboard failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Row 1: Welcome */}
      <WelcomeBanner />

      {/* Row 2: Stats */}
      <StatCards data={data} />

      {/* Row 3: Activity + Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <WeakTopics weakTopics={data?.weakTopics} />
        </div>
      </div>

      {/* Row 4: Recommended + Weekly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendedNext />
        <WeeklyActivity weeklyActivity={data?.weeklyActivity} />
      </div>
    </div>
  );
}