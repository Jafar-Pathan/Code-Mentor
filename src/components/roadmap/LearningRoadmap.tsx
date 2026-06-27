"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  Sparkles,
  Lock,
  Play,
  Zap,
  Clock,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface RoadmapStage {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "available" | "locked";
  subtopics: string[];
  xp: number;
  time: string;
  progress?: number;
}

const stages: RoadmapStage[] = [
  {
    id: "foundation",
    title: "Foundation",
    status: "completed",
    subtopics: ["Arrays", "Linked Lists", "Stacks & Queues"],
    xp: 500,
    time: "~8 hours",
  },
  {
    id: "search-sort",
    title: "Search & Sort",
    status: "completed",
    subtopics: ["Binary Search", "Two Pointers", "Sorting Algorithms"],
    xp: 400,
    time: "~6 hours",
  },
  {
    id: "hashing-trees",
    title: "Hashing & Trees",
    status: "in-progress",
    subtopics: ["Hash Maps", "Trees", "Heaps", "Tries"],
    xp: 600,
    time: "~12 hours",
    progress: 65,
  },
  {
    id: "graphs-advanced",
    title: "Graphs & Advanced",
    status: "available",
    subtopics: ["Graphs", "DFS", "BFS", "Shortest Paths"],
    xp: 700,
    time: "~15 hours",
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    status: "locked",
    subtopics: ["1D DP", "2D DP", "Knapsack", "String DP"],
    xp: 800,
    time: "~20 hours",
  },
  {
    id: "system-design",
    title: "System Design",
    status: "locked",
    subtopics: ["Scalability", "Databases", "Caching", "Load Balancing"],
    xp: 1000,
    time: "~25 hours",
  },
];

function getStatusBadge(status: RoadmapStage["status"]) {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="bg-green-500/15 text-green-400 border-green-500/20 hover:bg-green-500/25"
        >
          <Check className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge
          variant="secondary"
          className="bg-cyan-500/15 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/25"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    case "available":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <Play className="w-3 h-3 mr-1" />
          Available
        </Badge>
      );
    case "locked":
      return (
        <Badge variant="secondary" className="bg-muted/50 text-muted-foreground">
          <Lock className="w-3 h-3 mr-1" />
          Locked
        </Badge>
      );
  }
}

function getCircleIndicator(status: RoadmapStage["status"]) {
  const base =
    "flex items-center justify-center rounded-full shrink-0 z-10 transition-all";

  switch (status) {
    case "completed":
      return (
        <div
          className={`${base} w-10 h-10 bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]`}
        >
          <Check className="w-5 h-5 text-white" />
        </div>
      );
    case "in-progress":
      return (
        <div
          className={`${base} w-10 h-10 bg-cyan-500 animate-pulse-glow shadow-[0_0_16px_rgba(6,182,212,0.5)]`}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      );
    case "available":
      return (
        <div
          className={`${base} w-10 h-10 border-2 border-muted-foreground/50 bg-background hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-colors cursor-pointer`}
        >
          <Play className="w-4 h-4 text-muted-foreground ml-0.5" />
        </div>
      );
    case "locked":
      return (
        <div className={`${base} w-10 h-10 bg-muted`}>
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      );
  }
}

function RoadmapNodeCard({
  stage,
  index,
}: {
  stage: RoadmapStage;
  index: number;
}) {
  const { setView } = useAppStore();
  const isLocked = stage.status === "locked";
  const isClickable =
    stage.status === "completed" ||
    stage.status === "in-progress" ||
    stage.status === "available";

  const handleClick = () => {
    if (isClickable) {
      setView("tutor");
    }
  };

  const cardContent = (
    <Card
      className={`
        relative transition-all duration-300
        ${
          isLocked
            ? "opacity-50 cursor-not-allowed border-muted/40 bg-muted/10"
            : isClickable
              ? "cursor-pointer border-border/50 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] bg-card"
              : ""
        }
        ${stage.status === "completed" ? "hover:border-green-500/30" : ""}
        ${stage.status === "in-progress" ? "border-cyan-500/30 shadow-[0_0_16px_rgba(6,182,212,0.06)]" : ""}
      `}
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-5">
        {/* Status badge + Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-background/50 border border-border/40 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg text-foreground leading-tight truncate">
              {stage.title}
            </h3>
          </div>
          <div className="shrink-0">{getStatusBadge(stage.status)}</div>
        </div>

        {/* Subtopics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {stage.subtopics.map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="text-xs font-normal border-border/60 text-muted-foreground hover:bg-muted/50"
            >
              {topic}
            </Badge>
          ))}
        </div>

        {/* XP and Time */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{stage.xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{stage.time}</span>
          </div>
        </div>

        {/* Progress bar for in-progress */}
        {stage.status === "in-progress" && stage.progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium text-cyan-400">
                {stage.progress}%
              </span>
            </div>
            <Progress
              value={stage.progress}
              className="h-2 bg-muted/50 [&>[data-slot=progress-indicator]]:bg-cyan-500"
            />
          </div>
        )}

        {/* Completed indicator */}
        {stage.status === "completed" && (
          <div className="mt-4 flex items-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}

        {/* Locked message */}
        {stage.status === "locked" && (
          <p className="mt-3 text-xs text-muted-foreground/60">
            Complete previous stages to unlock
          </p>
        )}

        {/* CTA for available */}
        {stage.status === "available" && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 h-8 px-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 gap-1.5"
          >
            Start Learning
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      className="relative flex items-start gap-4 sm:gap-6"
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {/* Circle indicator */}
      {isLocked ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="pt-1">{getCircleIndicator(stage.status)}</div>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-sm">
            Complete previous stages first
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="pt-1">{getCircleIndicator(stage.status)}</div>
      )}

      {/* Card content */}
      <div className="flex-1 min-w-0 pb-8">{cardContent}</div>
    </motion.div>
  );
}

export default function LearningRoadmap() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Learning Roadmap
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Follow your personalized path from basics to advanced topics
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connecting line */}
        <div
          className="absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-green-500 via-cyan-500 to-muted z-0"
          aria-hidden="true"
        />

        {/* Nodes */}
        <div className="relative z-10">
          {stages.map((stage, index) => (
            <RoadmapNodeCard
              key={stage.id}
              stage={stage}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}