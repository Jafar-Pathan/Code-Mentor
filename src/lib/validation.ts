import { z } from "zod";

// ─── Shared Validators ───────────────────────────────────────────────────────

export const ALLOWED_LANGUAGES = ["javascript", "python", "java", "sql"] as const;
export type AllowedLanguage = (typeof ALLOWED_LANGUAGES)[number];

export const ALLOWED_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type AllowedDifficulty = (typeof ALLOWED_DIFFICULTIES)[number];

export const ALLOWED_INTERVIEW_TYPES = ["coding", "behavioral", "system-design"] as const;
export type AllowedInterviewType = (typeof ALLOWED_INTERVIEW_TYPES)[number];

export const ALLOWED_QUIZ_CATEGORIES = [
  "Arrays",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Java",
  "Python",
  "SQL",
  "Sorting",
  "Recursion",
  "Hash Maps",
  "Binary Search",
  "Two Pointers",
  "Sliding Window",
  "Stacks & Queues",
  "Heaps",
  "Tries",
  "Strings",
  "Greedy",
  "Backtracking",
  "System Design",
] as const;
export type AllowedQuizCategory = (typeof ALLOWED_QUIZ_CATEGORIES)[number];

// ─── Chat Schema ─────────────────────────────────────────────────────────────

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message too long (max 4000 chars)"),
});

export const ChatRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, "At least one message required")
    .max(50, "Too many messages (max 50)"),
  topic: z
    .string()
    .max(100, "Topic too long")
    .regex(/^[a-zA-Z0-9\s\-&,./]+$/, "Topic contains invalid characters")
    .optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// ─── Quiz Schema ─────────────────────────────────────────────────────────────

export const QuizRequestSchema = z.object({
  category: z.enum(ALLOWED_QUIZ_CATEGORIES, {
    errorMap: () => ({ message: "Invalid quiz category" }),
  }),
  difficulty: z.enum(ALLOWED_DIFFICULTIES, {
    errorMap: () => ({ message: "Invalid difficulty" }),
  }).default("medium"),
  count: z
    .number()
    .int()
    .min(1, "At least 1 question")
    .max(10, "Maximum 10 questions")
    .default(5),
});

export type QuizRequest = z.infer<typeof QuizRequestSchema>;

// ─── Code Review Schema ──────────────────────────────────────────────────────

export const CodeReviewRequestSchema = z.object({
  code: z
    .string()
    .min(10, "Code too short (min 10 chars)")
    .max(20000, "Code too long (max 20000 chars)"),
  language: z.enum(ALLOWED_LANGUAGES, {
    errorMap: () => ({ message: "Invalid language" }),
  }),
});

export type CodeReviewRequest = z.infer<typeof CodeReviewRequestSchema>;

// ─── Interview Schema ────────────────────────────────────────────────────────

export const InterviewRequestSchema = z.object({
  type: z.enum(ALLOWED_INTERVIEW_TYPES, {
    errorMap: () => ({ message: "Invalid interview type" }),
  }).default("coding"),
  topic: z
    .string()
    .max(100, "Topic too long")
    .regex(/^[a-zA-Z0-9\s\-&,./]+$/, "Topic contains invalid characters")
    .optional(),
  count: z
    .number()
    .int()
    .min(1, "At least 1 question")
    .max(10, "Maximum 10 questions")
    .default(5),
});

export type InterviewRequest = z.infer<typeof InterviewRequestSchema>;

// ─── LLM Response Schemas ────────────────────────────────────────────────────

const QuizQuestionResponseSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
  codeSnippet: z.string().optional(),
});

export const QuizResponseSchema = z.object({
  title: z.string(),
  questions: z.array(QuizQuestionResponseSchema),
});

export type QuizResponse = z.infer<typeof QuizResponseSchema>;

const InterviewQuestionResponseSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.string(),
  difficulty: z.string(),
  hints: z.array(z.string()),
  timeLimit: z.number().int().min(5).max(60),
});

export const InterviewResponseSchema = z.object({
  title: z.string(),
  questions: z.array(InterviewQuestionResponseSchema),
});

export type InterviewResponse = z.infer<typeof InterviewResponseSchema>;

// ─── Helper ──────────────────────────────────────────────────────────────────

export function validateRequest<T>(schema: z.ZodSchema<T>, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message).join("; ");
    return { success: false as const, error: errors };
  }
  return { success: true as const, data: result.data };
}