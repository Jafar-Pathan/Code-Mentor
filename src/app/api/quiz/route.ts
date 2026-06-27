import { NextRequest, NextResponse } from "next/server";
import { getLLMClient, LLM_MODEL } from "@/lib/llm";
import {
  validateRequest,
  QuizRequestSchema,
  QuizResponseSchema,
} from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { HALLUCINATION_GUARD } from "@/lib/prompt-defense";
import {
  hashKey,
  getCached,
  setCache,
  acquireLLMSlot,
} from "@/lib/cache";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // ── Rate Limiting ────────────────────────────────────────────────────
  const rl = rateLimit(clientIP, "quiz");
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "Too many quiz requests. Please wait before generating another.",
        retryAfterMs: rl.resetMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // ── Validation ───────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const validation = validateRequest(QuizRequestSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { category, difficulty, count } = validation.data;

  // ── Cache Check ──────────────────────────────────────────────────────
  const cacheKey = hashKey(category, difficulty, String(count));
  const cached = getCached<unknown>("quiz", cacheKey);
  if (cached) {
    console.log(`[Quiz] Cache hit: ${category}/${difficulty}`);
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT", "X-RateLimit-Remaining": String(rl.remaining) },
    });
  }

  // ── Concurrency Control ─────────────────────────────────────────────
  const releaseSlot = await acquireLLMSlot();

  try {
    const llm = getLLMClient();

    const prompt = `Generate ${count} multiple-choice quiz questions about "${category}" at ${difficulty} difficulty level.

Respond with valid JSON only in this exact format, no other text:
{
  "title": "Quiz title about ${category}",
  "questions": [
    {
      "id": "q1",
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why correct is right and others are wrong",
      "codeSnippet": "optional code snippet"
    }
  ]
}

Rules:
- Generate exactly ${count} questions
- Each must have exactly 4 options
- correctIndex must be 0-3
- Questions must be factually accurate
- Include code snippets where relevant
- Difficulty: ${difficulty === "easy" ? "basic recall and understanding" : difficulty === "hard" ? "complex problem-solving and edge cases" : "application and analysis"}
${HALLUCINATION_GUARD}`;

    const completion = await llm.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a precise quiz generator for programming education. Every fact you state must be correct. Generate accurate, well-structured multiple-choice questions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, // Low temp for factual accuracy
      max_tokens: 4096,
    });

    let response = completion.choices[0]?.message?.content || "";

    // Extract JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      response = jsonMatch[0];
    }

    const parsed = JSON.parse(response);

    // ── Response Schema Validation ─────────────────────────────────────
    const schemaResult = QuizResponseSchema.safeParse(parsed);
    if (!schemaResult.success) {
      console.error("[Quiz] LLM response failed schema validation:", schemaResult.error.issues);
      return NextResponse.json(
        { error: "Failed to generate a valid quiz. Please try again." },
        { status: 502 }
      );
    }

    const quiz = schemaResult.data;
    const durationMs = Date.now() - startTime;

    // ── Cache Store ────────────────────────────────────────────────────
    setCache("quiz", cacheKey, quiz);

    console.log(
      `[Quiz] Generated ${quiz.questions.length} questions for ${category}/${difficulty} in ${durationMs}ms`
    );

    return NextResponse.json(quiz, {
      headers: {
        "X-Cache": "MISS",
        "X-RateLimit-Remaining": String(rl.remaining),
        "X-Response-Time": `${durationMs}ms`,
      },
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(`[Quiz] Error after ${durationMs}ms:`, error instanceof Error ? error.message : "Unknown");

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Quiz generation timed out. Please try a simpler topic." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  } finally {
    releaseSlot();
  }
}