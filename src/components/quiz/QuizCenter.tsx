'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Link2,
  GitBranch,
  Network,
  Layers as LayersIcon,
  Coffee,
  FileCode,
  Database,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Trophy,
  Zap,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const categories = [
  { id: 'arrays', title: 'Arrays', icon: Layers, description: 'Sorting, searching & manipulation', difficulty: 'Easy', color: 'text-emerald-400' },
  { id: 'linked-lists', title: 'Linked Lists', icon: Link2, description: 'Singly & doubly linked operations', difficulty: 'Easy', color: 'text-emerald-400' },
  { id: 'trees', title: 'Trees', icon: GitBranch, description: 'BST, traversal & balancing', difficulty: 'Medium', color: 'text-amber-400' },
  { id: 'graphs', title: 'Graphs', icon: Network, description: 'BFS, DFS & shortest paths', difficulty: 'Medium', color: 'text-amber-400' },
  { id: 'dp', title: 'Dynamic Programming', icon: LayersIcon, description: 'Optimization & memoization', difficulty: 'Hard', color: 'text-red-400' },
  { id: 'java', title: 'Java', icon: Coffee, description: 'OOP, collections & concurrency', difficulty: 'Medium', color: 'text-amber-400' },
  { id: 'python', title: 'Python', icon: FileCode, description: 'Syntax, data structures & libs', difficulty: 'Easy', color: 'text-emerald-400' },
  { id: 'sql', title: 'SQL', icon: Database, description: 'Queries, joins & optimization', difficulty: 'Medium', color: 'text-amber-400' },
];

const difficultyOptions = [
  { id: 'easy', label: 'Easy', activeColor: 'bg-emerald-500 hover:bg-emerald-600', inactiveColor: 'text-emerald-400' },
  { id: 'medium', label: 'Medium', activeColor: 'bg-amber-500 hover:bg-amber-600', inactiveColor: 'text-amber-400' },
  { id: 'hard', label: 'Hard', activeColor: 'bg-red-500 hover:bg-red-600', inactiveColor: 'text-red-400' },
];

interface LocalQuizState {
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    codeSnippet?: string;
  }[];
  currentIndex: number;
  answers: number[];
  isComplete: boolean;
  score: number;
  category: string;
  difficulty: string;
}

export default function QuizCenter() {
  const [phase, setPhase] = useState<'select' | 'quiz' | 'results'>('select');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [localSelected, setLocalSelected] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<LocalQuizState | null>(null);

  // Reset local selection when question changes
  useEffect(() => {
    setLocalSelected(null);
  }, [quiz?.currentIndex]);

  // Timer effect
  useEffect(() => {
    if (!quiz || quiz.isComplete || phase !== 'quiz') return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz?.currentIndex, quiz?.isComplete, phase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const generateQuiz = useCallback(async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: selectedCategory, difficulty: selectedDifficulty, count: 5 }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || `Quiz generation failed (${res.status})`);
        return;
      }
      const data = await res.json();
      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        toast.error('Received invalid quiz data. Using fallback questions.');
        throw new Error('Invalid quiz response');
      }
      setQuiz({
        questions: data.questions,
        currentIndex: 0,
        answers: [],
        isComplete: false,
        score: 0,
        category: selectedCategory,
        difficulty: selectedDifficulty,
      });
      setTimer(0);
      setPhase('quiz');
    } catch {
      // Fallback mock data
      const mockQuestions = Array.from({ length: 5 }, (_, i) => ({
        id: `q${i}`,
        question: `Sample ${selectedCategory} question ${i + 1}: What is the time complexity of a common ${selectedDifficulty} ${selectedCategory} operation?`,
        options: [
          'O(1) - Constant time',
          'O(log n) - Logarithmic time',
          'O(n) - Linear time',
          'O(n²) - Quadratic time',
        ],
        correctIndex: Math.floor(Math.random() * 4),
        explanation: `This is a mock explanation. In ${selectedCategory} at ${selectedDifficulty} level, the correct approach involves understanding the underlying data structure properties and choosing the optimal algorithm.`,
      }));
      setQuiz({
        questions: mockQuestions,
        currentIndex: 0,
        answers: [],
        isComplete: false,
        score: 0,
        category: selectedCategory,
        difficulty: selectedDifficulty,
      });
      setTimer(0);
      setPhase('quiz');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty]);

  const handleAnswer = () => {
    if (localSelected === null || !quiz) return;
    const newAnswers = [...quiz.answers, localSelected];
    const nextIndex = quiz.currentIndex + 1;
    const isComplete = nextIndex >= quiz.questions.length;
    const correctCount = newAnswers.reduce((acc, ans, idx) => {
      if (ans === quiz.questions[idx].correctIndex) acc++;
      return acc;
    }, 0);
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    if (isComplete) {
      setQuiz({ ...quiz, answers: newAnswers, currentIndex: nextIndex, isComplete: true, score });
      setPhase('results');
    } else {
      setQuiz({ ...quiz, answers: newAnswers, currentIndex: nextIndex });
    }
  };

  const handleReset = () => {
    setQuiz(null);
    setSelectedCategory(null);
    setTimer(0);
    setLocalSelected(null);
    setPhase('select');
  };

  const handleTryAgain = () => {
    setTimer(0);
    setLocalSelected(null);
    if (quiz) {
      setQuiz({ ...quiz, currentIndex: 0, answers: [], isComplete: false, score: 0 });
      setPhase('quiz');
    }
  };

  // ─── RESULTS STATE ─────────────────────────────────────────
  if (phase === 'results' && quiz) {
    const correctCount = quiz.answers.reduce(
      (acc, ans, idx) => (ans === quiz.questions[idx].correctIndex ? acc + 1 : acc),
      0
    );
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (quiz.score / 100) * circumference;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <Trophy className="size-6 text-amber-400" />
          <h1 className="text-2xl font-bold">Quiz Complete!</h1>
        </div>

        <Card className="glow-cyan-sm">
          <CardContent className="flex flex-col items-center py-8 gap-4">
            <div className="relative size-32">
              <svg className="size-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="oklch(1 0 0 / 8%)" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke="oklch(0.75 0.15 195)"
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-cyan-400">{quiz.score}%</span>
                <span className="text-xs text-muted-foreground">Score</span>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              <span className="text-foreground font-semibold">{correctCount}</span> out of {quiz.questions.length} correct
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-6">
            {quiz.questions.map((q, idx) => {
              const userAnswer = quiz.answers[idx];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-4 rounded-lg border bg-card space-y-2"
                >
                  <div className="flex items-start gap-2">
                    {isCorrect
                      ? <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
                      : <XCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
                    }
                    <p className="text-sm font-medium">{q.question}</p>
                  </div>
                  <div className="ml-7 space-y-1.5">
                    <p className="text-xs">
                      Your answer:{' '}
                      <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                        {q.options[userAnswer]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-xs">
                        Correct answer: <span className="text-emerald-400">{q.options[q.correctIndex]}</span>
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{q.explanation}</p>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleTryAgain} variant="default" className="flex-1">
            <RotateCcw className="size-4" />
            Try Again
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex-1">
            <ArrowLeft className="size-4" />
            Back to Quizzes
          </Button>
        </div>
      </motion.div>
    );
  }

  // ─── ACTIVE QUIZ STATE ─────────────────────────────────────
  if (phase === 'quiz' && quiz && !quiz.isComplete) {
    const currentQuestion = quiz.questions[quiz.currentIndex];
    const totalQuestions = quiz.questions.length;
    const progress = ((quiz.currentIndex + 1) / totalQuestions) * 100;
    const hasSelected = localSelected !== null;
    const isLastQuestion = quiz.currentIndex === totalQuestions - 1;
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <ArrowLeft className="size-4" />
            Exit
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {quiz.currentIndex + 1} of {totalQuestions}</span>
            <Badge variant="outline" className="capitalize">{quiz.difficulty}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="glow-cyan-sm">
          <CardContent className="pt-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={quiz.currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-lg font-semibold leading-relaxed">{currentQuestion.question}</h2>

                {currentQuestion.codeSnippet && (
                  <div className="code-block p-4 overflow-x-auto mt-3">
                    <pre className="text-sm whitespace-pre-wrap">{currentQuestion.codeSnippet}</pre>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  {currentQuestion.options.map((option, idx) => {
                    const isCorrect = idx === currentQuestion.correctIndex;
                    const isSelected = localSelected === idx;

                    let borderColor = 'border-border';
                    let bgColor = 'bg-card';
                    if (hasSelected && isCorrect) {
                      borderColor = 'border-emerald-500/60';
                      bgColor = 'bg-emerald-500/10';
                    } else if (hasSelected && isSelected && !isCorrect) {
                      borderColor = 'border-red-500/60';
                      bgColor = 'bg-red-500/10';
                    } else if (isSelected && !hasSelected) {
                      borderColor = 'border-primary/50';
                      bgColor = 'bg-primary/10';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={hasSelected}
                        onClick={() => setLocalSelected(idx)}
                        className={`p-3 rounded-lg border ${borderColor} ${bgColor} transition-all text-left flex items-center gap-3 ${!hasSelected ? 'cursor-pointer hover:border-primary/30' : 'cursor-default'}`}
                      >
                        <span className="flex items-center justify-center size-7 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold shrink-0">
                          {optionLabels[idx]}
                        </span>
                        <span className="text-sm leading-snug">{option}</span>
                        {hasSelected && isCorrect && <CheckCircle2 className="size-5 text-emerald-400 ml-auto shrink-0" />}
                        {hasSelected && isSelected && !isCorrect && <XCircle className="size-5 text-red-400 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {hasSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-secondary/50 border border-border space-y-2"
                >
                  <p className="text-sm font-medium text-emerald-400">Explanation</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <AnimatePresence>
          {hasSelected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isLastQuestion ? (
                <Button className="w-full" size="lg" onClick={handleAnswer}>
                  <Trophy className="size-4" />
                  See Results
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={handleAnswer}>
                  Next Question
                  <ArrowLeft className="size-4 rotate-180" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ─── QUIZ SELECTION STATE ──────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-4 md:p-6"
    >
      <div>
        <h1 className="text-2xl font-bold gradient-text">Quiz Center</h1>
        <p className="text-muted-foreground mt-1">
          Test your knowledge with AI-generated quizzes
        </p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Select Category
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.title;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedCategory(isSelected ? null : cat.title)}
                className={`p-4 rounded-xl border text-left transition-all hover:border-primary/30 ${
                  isSelected ? 'border-primary/50 bg-primary/10 glow-cyan-sm' : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`size-5 ${cat.color}`} />
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${cat.color} border-current/20`}>
                    {cat.difficulty}
                  </Badge>
                </div>
                <p className="font-medium text-sm">{cat.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">{cat.description}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Difficulty
        </h2>
        <div className="flex gap-3">
          {difficultyOptions.map((diff) => {
            const isSelected = selectedDifficulty === diff.id;
            return (
              <Button
                key={diff.id}
                variant={isSelected ? 'default' : 'outline'}
                className={isSelected ? diff.activeColor : ''}
                onClick={() => setSelectedDifficulty(diff.id)}
              >
                <Zap className={`size-4 ${!isSelected ? diff.inactiveColor : ''}`} />
                {diff.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full md:w-auto"
        disabled={!selectedCategory || loading}
        onClick={generateQuiz}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
        {loading ? 'Generating Quiz...' : 'Generate Quiz'}
      </Button>
    </motion.div>
  );
}