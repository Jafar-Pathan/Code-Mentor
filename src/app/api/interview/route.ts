import { NextRequest, NextResponse } from "next/server";
import { getLLMClient, LLM_MODEL } from "@/lib/llm";
import {
  validateRequest,
  InterviewRequestSchema,
  InterviewResponseSchema,
} from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { detectPromptInjection, HALLUCINATION_GUARD } from "@/lib/prompt-defense";
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
  const rl = rateLimit(clientIP, "interview");
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many interview requests. Please wait." },
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

  const validation = validateRequest(InterviewRequestSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { type, topic, count } = validation.data;

  // ── Prompt Injection on topic ────────────────────────────────────────
  if (topic) {
    const topicCheck = detectPromptInjection(topic);
    if (!topicCheck.safe) {
      return NextResponse.json(
        { error: "Invalid topic provided." },
        { status: 400 }
      );
    }
  }

  // ── Cache Check ──────────────────────────────────────────────────────
  const cacheKey = hashKey(type, topic ?? "general", String(count));
  const cached = getCached<unknown>("interview", cacheKey);
  if (cached) {
    console.log(`[Interview] Cache hit: ${type}/${topic ?? "general"}`);
    return NextResponse.json(cached, {
      headers: { "X-Cache": "HIT", "X-RateLimit-Remaining": String(rl.remaining) },
    });
  }

  // ── Concurrency Control ─────────────────────────────────────────────
  const releaseSlot = await acquireLLMSlot();

  try {
    const llm = getLLMClient();

    const safeTopic = topic
      ? topic.replace(/[<>"'&]/g, "").slice(0, 100)
      : "Data Structures and Algorithms";

    const completion = await llm.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a senior technical interviewer at a top tech company. Generate realistic, factually accurate interview questions.
          
${HALLUCINATION_GUARD}

Respond with valid JSON only:
{
  "title": "Interview: ${safeTopic}",
  "questions": [
    {
      "id": "q1",
      "question": "The full question",
      "type": "${type}",
      "difficulty": "medium",
      "hints": ["Hint 1", "Hint 2"],
      "timeLimit": 30
    }
  ]
}`,
        },
        {
          role: "user",
          content: `Generate ${count} ${type} interview questions about ${safeTopic}.

For coding questions: include practical problems with clear input/output expectations.
For behavioral questions: use STAR method framework.
For system design: cover scalability, trade-offs, and real-world constraints.

Rules:
- Generate exactly ${count} questions
- Difficulty: medium to hard
- 2-3 hints per question
- Time limits between 20-45 minutes
- Questions must be factually accurate and realistic`,
        },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    });

    let response = completion.choices[0]?.message?.content || "";
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      response = jsonMatch[0];
    }

    const parsed = JSON.parse(response);

    // ── Response Schema Validation ─────────────────────────────────────
    const schemaResult = InterviewResponseSchema.safeParse(parsed);
    if (!schemaResult.success) {
      console.error(
        "[Interview] LLM response failed schema validation:",
        schemaResult.error.issues
      );
      return NextResponse.json(
        { error: "Failed to generate valid questions. Please try again." },
        { status: 502 }
      );
    }

    const interview = schemaResult.data;
    const durationMs = Date.now() - startTime;

    // ── Cache Store ────────────────────────────────────────────────────
    setCache("interview", cacheKey, interview);

    console.log(
      `[Interview] Generated ${interview.questions.length} ${type} questions in ${durationMs}ms`
    );

    return NextResponse.json(interview, {
      headers: {
        "X-Cache": "MISS",
        "X-RateLimit-Remaining": String(rl.remaining),
        "X-Response-Time": `${durationMs}ms`,
      },
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(
      `[Interview] Error after ${durationMs}ms:`,
      error instanceof Error ? error.message : "Unknown"
    );

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Interview generation timed out. Please try again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate interview. Please try again." },
      { status: 500 }
    );
  } finally {
    releaseSlot();
  }
}