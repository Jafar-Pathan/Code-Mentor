"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, BookOpen, Target, Flame } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Overview {
  totalTopics: number;
  completedTopics: number;
  averageMastery: number;
  totalXP: number;
  currentStreak: number;
  weeklyQuizzes: number;
  weeklyMinutes: number;
}

interface WeeklyActivity {
  day: string;
  quizzes: number;
  minutes: number;
  xp: number;
}

interface SkillBreakdownItem {
  topic: string;
  mastery: number;
  quizzes: number;
  timeMinutes: number;
}

interface TopicItem {
  topic: string;
  mastery: number;
}

interface ProgressData {
  user: string;
  overview: Overview;
  weeklyActivity: WeeklyActivity[];
  skillBreakdown: SkillBreakdownItem[];
  weakTopics: TopicItem[];
  strongTopics: TopicItem[];
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground capitalize">
            {item.dataKey}:
          </span>
          <span className="font-semibold text-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Loading ───────────────────────────────────────────────────────

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      {/* Chart skeleton */}
      <Skeleton className="h-[300px] rounded-xl" />
      {/* Bottom skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[340px] rounded-xl" />
        <Skeleton className="h-[340px] rounded-xl" />
      </div>
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="border-border h-full">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </span>
            <div
              className="rounded-lg p-2"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="h-4 w-4" style={{ color }} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Topic List Item ────────────────────────────────────────────────────────

function TopicListItem({
  topic,
  mastery,
  variant,
}: {
  topic: string;
  mastery: number;
  variant: "strong" | "weak";
}) {
  const borderColor =
    variant === "strong" ? "border-l-emerald-500" : "border-l-red-500";
  const badgeClass =
    variant === "strong"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : "bg-red-500/15 text-red-400 border-red-500/30";
  const progressColor =
    variant === "strong"
      ? "[&>div]:bg-emerald-500"
      : "[&>div]:bg-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 rounded-lg border border-border border-l-4 ${borderColor} px-3 py-2.5`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-medium truncate">{topic}</span>
          <Badge
            variant="outline"
            className={`text-[10px] shrink-0 border ${badgeClass}`}
          >
            {mastery}%
          </Badge>
        </div>
        <Progress
          value={mastery}
          className={`h-1.5 ${progressColor}`}
        />
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Analytics() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");

  useEffect(() => {
    let cancelled = false;
    async function fetchProgress() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error("Failed to load analytics");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Something went wrong",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProgress();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <AnalyticsSkeleton />;

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { overview, weeklyActivity, skillBreakdown, weakTopics, strongTopics } =
    data;

  const periods: { value: "week" | "month" | "all"; label: string }[] = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          Learning Analytics
        </h1>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriod(p.value)}
              className="text-xs h-7 px-3"
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Zap}
          label="Total XP"
          value={overview.totalXP.toLocaleString()}
          color="#22d3ee"
        />
        <StatCard
          icon={BookOpen}
          label="Topics Mastered"
          value={`${overview.completedTopics}/${overview.totalTopics}`}
          color="#a78bfa"
        />
        <StatCard
          icon={Target}
          label="Avg Mastery"
          value={`${overview.averageMastery}%`}
          color="#f472b6"
        />
        <StatCard
          icon={Flame}
          label="Study Streak"
          value={`${overview.currentStreak} days`}
          color="#fb923c"
        />
      </div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyActivity}
                  margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#888", fontSize: 12 }}
                    axisLine={{ stroke: "#ffffff10" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#888", fontSize: 12 }}
                    axisLine={{ stroke: "#ffffff10" }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="quizzes"
                    fill="#22d3ee"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="minutes"
                    fill="#818cf8"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skill Mastery */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-border h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Skill Mastery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillBreakdown}
                    layout="vertical"
                    margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff10"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: "#888", fontSize: 12 }}
                      axisLine={{ stroke: "#ffffff10" }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="topic"
                      tick={{ fill: "#888", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={110}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="mastery"
                      fill="#22d3ee"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strong & Weak Topics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Strong Topics */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-emerald-400">
                Strong Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {strongTopics.map((t) => (
                <TopicListItem
                  key={t.topic}
                  topic={t.topic}
                  mastery={t.mastery}
                  variant="strong"
                />
              ))}
            </CardContent>
          </Card>

          {/* Weak Topics */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-red-400">
                Weak Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {weakTopics.map((t) => (
                <TopicListItem
                  key={t.topic}
                  topic={t.topic}
                  mastery={t.mastery}
                  variant="weak"
                />
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}