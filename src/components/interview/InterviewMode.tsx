"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  MessageSquare,
  Server,
  Trophy,
  Clock,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppStore } from "@/store/useAppStore";
import type { InterviewQuestion } from "@/types";

type InterviewType = "coding" | "behavioral" | "system-design";
type InterviewPhase = "setup" | "active" | "summary";

interface InterviewConfig {
  type: InterviewType;
  topic: string;
  count: number;
}

const INTERVIEW_TYPES: {
  value: InterviewType;
  label: string;
  icon: typeof Code;
  description: string;
}[] = [
  {
    value: "coding",
    label: "Coding Interview",
    icon: Code,
    description: "Algorithm & data structure problems",
  },
  {
    value: "behavioral",
    label: "Behavioral Interview",
    icon: MessageSquare,
    description: "STAR method questions",
  },
  {
    value: "system-design",
    label: "System Design",
    icon: Server,
    description: "Scalability & architecture",
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  hard: "bg-red-500/15 text-red-400 border-red-500/30",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ─── Setup Phase ────────────────────────────────────────────────────────────

function SetupPhase({
  onStart,
}: {
  onStart: (config: InterviewConfig) => void;
}) {
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);

  const canStart = selectedType !== null && topic.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Interview Preparation
        </h1>
        <p className="text-muted-foreground">
          Practice with AI-powered mock interviews
        </p>
      </div>

      {/* Interview Type Cards */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          Choose Interview Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {INTERVIEW_TYPES.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedType === t.value;
            return (
              <motion.button
                key={t.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(t.value)}
                className={`relative rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <Icon
                  className={`h-5 w-5 mb-2 ${
                    isSelected ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <div className="font-medium text-sm">{t.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t.description}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Topic Input */}
      <div className="space-y-2">
        <label
          htmlFor="interview-topic"
          className="text-sm font-medium text-muted-foreground"
        >
          Specific Topic
        </label>
        <Input
          id="interview-topic"
          placeholder='e.g. "Arrays and Strings", "Leadership", "URL Shortener"'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-card border-border"
        />
      </div>

      {/* Question Count */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          Number of Questions
        </label>
        <div className="flex gap-2">
          {[3, 5, 7].map((n) => (
            <Button
              key={n}
              variant={count === n ? "default" : "outline"}
              onClick={() => setCount(n)}
              className="flex-1"
            >
              {n} Questions
            </Button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <Button
        size="lg"
        className="w-full"
        disabled={!canStart}
        onClick={() =>
          onStart({
            type: selectedType!,
            topic: topic.trim(),
            count,
          })
        }
      >
        Start Interview
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  );
}

// ─── Active Interview Phase ─────────────────────────────────────────────────

function ActivePhase({
  config,
  questions,
  onEnd,
}: {
  config: InterviewConfig;
  questions: InterviewQuestion[];
  onEnd: (
    answers: string[],
    timeSpent: number,
  ) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    Array(questions.length).fill(""),
  );
  const [hintsShown, setHintsShown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit ?? 300,
  );
  const [startTime] = useState(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleNextRef = useRef<() => void>(() => {});

  const question = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setHintsShown(0);
      setTimeLeft(questions[currentIndex + 1]?.timeLimit ?? 300);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      onEnd(answers, timeSpent);
    }
  }, [currentIndex, totalQuestions, answers, startTime, onEnd, questions]);

  handleNextRef.current = handleNext;

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextRef.current();
          return questions[currentIndex]?.timeLimit ?? 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions]);

  const handleEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    onEnd(answers, timeSpent);
  }, [answers, startTime, onEnd]);

  if (!question) return null;

  const difficulty =
    question.difficulty === "Easy"
      ? "easy"
      : question.difficulty === "Medium"
        ? "medium"
        : "hard";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-4"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-destructive font-mono font-semibold tabular-nums">
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <Badge variant="outline" className="text-xs">
            Question {currentIndex + 1} of {totalQuestions}
          </Badge>
        </div>
        <Button variant="destructive" size="sm" onClick={handleEnd}>
          <AlertTriangle className="h-4 w-4 mr-1" />
          End Interview
        </Button>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge
                  className={`text-xs border ${DIFFICULTY_COLORS[difficulty] ?? ""}`}
                >
                  {question.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {config.type.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-lg leading-relaxed font-medium">
                {question.question}
              </p>

              {/* Answer Textarea */}
              <Textarea
                placeholder="Type your answer or approach here..."
                value={answers[currentIndex]}
                onChange={(e) => {
                  const updated = [...answers];
                  updated[currentIndex] = e.target.value;
                  setAnswers(updated);
                }}
                className="min-h-[160px] bg-background border-border text-sm resize-y"
              />

              {/* Hints */}
              {question.hints.length > 0 && (
                <div className="space-y-2">
                  {hintsShown < question.hints.length && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHintsShown((h) => h + 1)}
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Show Hint {hintsShown + 1}
                    </Button>
                  )}

                  <Accordion
                    type="multiple"
                    className="w-full"
                  >
                    {question.hints.slice(0, hintsShown).map((hint, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`hint-${idx}`}
                        className="border-border"
                      >
                        <AccordionTrigger className="text-xs text-muted-foreground py-2">
                          Hint {idx + 1}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {hint}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Next Question Button */}
      <div className="flex justify-end">
        <Button onClick={handleNext} className="min-w-[160px]">
          {currentIndex < totalQuestions - 1 ? (
            <>
              Next Question
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Finish Interview
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Summary Phase ──────────────────────────────────────────────────────────

function SummaryPhase({
  questions,
  answers,
  timeSpent,
  onRestart,
  onDashboard,
}: {
  questions: InterviewQuestion[];
  answers: string[];
  timeSpent: number;
  onRestart: () => void;
  onDashboard: () => void;
}) {
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;
  const avgTime =
    questions.length > 0
      ? Math.round(timeSpent / questions.length)
      : 0;

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <Trophy className="h-12 w-12 mx-auto text-amber-400" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight">
          Interview Complete
        </h1>
        <p className="text-muted-foreground">
          Great effort! Here&apos;s your session summary.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {answeredCount}/{questions.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Questions Answered
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {formatTime(timeSpent)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total Time
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {avgTime}s
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Avg per Question
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Review List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          Question Review
        </h3>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {questions.map((q, idx) => {
            const isExpanded = expandedIdx === idx;
            const userAnswer = answers[idx] || "No answer provided";
            const isLong = userAnswer.length > 200;
            const displayAnswer =
              isLong && !isExpanded
                ? userAnswer.slice(0, 200) + "..."
                : userAnswer;

            const difficulty =
              q.difficulty === "Easy"
                ? "easy"
                : q.difficulty === "Medium"
                  ? "medium"
                  : "hard";

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Q{idx + 1}.
                      </span>
                      <Badge
                        className={`text-[10px] border ${DIFFICULTY_COLORS[difficulty] ?? ""}`}
                      >
                        {q.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      {q.question}
                    </p>
                    <div className="bg-background rounded-lg p-3 text-sm text-muted-foreground border border-border">
                      {displayAnswer}
                    </div>
                    {isLong && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() =>
                          setExpandedIdx(isExpanded ? null : idx)
                        }
                      >
                        {isExpanded ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Show Full Answer
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onRestart}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start New Interview
        </Button>
        <Button
          className="flex-1"
          onClick={onDashboard}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function InterviewMode() {
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [summaryAnswers, setSummaryAnswers] = useState<string[]>([]);
  const [summaryTime, setSummaryTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setView } = useAppStore();

  const handleStart = useCallback(async (cfg: InterviewConfig) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: cfg.type,
          topic: cfg.topic,
          count: cfg.count,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate interview questions");
      const data = await res.json();
      // API returns timeLimit in minutes; convert to seconds
      const normalized = (data.questions ?? []).map((q: InterviewQuestion) => ({
        ...q,
        timeLimit: q.timeLimit <= 200 ? q.timeLimit * 60 : q.timeLimit,
      }));
      setConfig(cfg);
      setQuestions(normalized);
      setPhase("active");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEnd = useCallback(
    (answers: string[], timeSpent: number) => {
      setSummaryAnswers(answers);
      setSummaryTime(timeSpent);
      setPhase("summary");
    },
    [],
  );

  const handleRestart = useCallback(() => {
    setPhase("setup");
    setConfig(null);
    setQuestions([]);
    setSummaryAnswers([]);
    setSummaryTime(0);
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Generating interview questions...
          </p>
        </div>
      )}

      {error && !loading && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="ml-auto"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && phase === "setup" && <SetupPhase onStart={handleStart} />}

      {!loading && phase === "active" && config && (
        <ActivePhase
          config={config}
          questions={questions}
          onEnd={handleEnd}
        />
      )}

      {!loading && phase === "summary" && (
        <SummaryPhase
          questions={questions}
          answers={summaryAnswers}
          timeSpent={summaryTime}
          onRestart={handleRestart}
          onDashboard={() => setView("dashboard")}
        />
      )}
    </div>
  );
}