import { NextRequest, NextResponse } from "next/server";
import { getLLMClient, LLM_MODEL } from "@/lib/llm";
import { validateRequest, ChatRequestSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import {
  detectPromptInjection,
  safeTopicContext,
  HALLUCINATION_GUARD,
  flagSuspiciousResponse,
} from "@/lib/prompt-defense";
import { acquireLLMSlot } from "@/lib/cache";
import { buildRAGContext } from "@/lib/rag";
import { db } from "@/lib/db";

const SYSTEM_PROMPT = `You are CodeMentor AI, an expert programming tutor. Your role is to help students learn programming through clear, patient, and adaptive teaching.

Guidelines:
- Explain concepts step by step with concrete examples
- When explaining code, always provide well-commented examples
- Use analogies to make complex topics accessible
- If a student makes a mistake, gently guide them to the correct answer
- Adjust difficulty based on the student's questions
- Cover: Data Structures, Algorithms, Java, Python, JavaScript, SQL, System Design, and Interview Preparation
- Format code with proper syntax highlighting using markdown code blocks
- Be concise but thorough
- NEVER output raw HTML tags. Use markdown only.
- NEVER include links to external websites.

When responding, use markdown formatting for:
- Code blocks with language tags: \`\`\`java, \`\`\`python, \`\`\`javascript, \`\`\`sql
- Bold for key terms
- Numbered lists for step-by-step explanations
- Tables for comparisons${HALLUCINATION_GUARD}`;

// Track active requests for monitoring
let activeRequests = 0;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // ── Rate Limiting ────────────────────────────────────────────────────
  const rl = rateLimit(clientIP, "chat");
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "Too many messages. Please slow down.",
        retryAfterMs: rl.resetMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Limit": String(rl.limit),
        },
      }
    );
  }

  // ── Request Body Parsing & Validation ─────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON." },
      { status: 400 }
    );
  }

  const validation = validateRequest(ChatRequestSchema, body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { messages, topic } = validation.data;

  // ── Prompt Injection Detection ───────────────────────────────────────
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (lastUserMsg) {
    const injectionCheck = detectPromptInjection(lastUserMsg.content);
    if (!injectionCheck.safe) {
      return NextResponse.json(
        {
          error:
            "Your message contains content that cannot be processed. Please rephrase your question.",
        },
        { status: 400 }
      );
    }
  }

  if (topic) {
    const topicCheck = detectPromptInjection(topic);
    if (!topicCheck.safe) {
      return NextResponse.json(
        { error: "Invalid topic provided." },
        { status: 400 }
      );
    }
  }

  // ── Concurrency Control ──────────────────────────────────────────────
  const releaseSlot = await acquireLLMSlot();
  activeRequests++;

  try {
    const llm = getLLMClient();

    // ── RAG: Retrieve relevant context from knowledge base ───────
    let ragContext: { contextBlock: string; sourceCount: number; sources: string[] } | null = null;
    let ragSources: string[] = [];
    try {
      const user = await db.user.findFirst();
      if (user && lastUserMsg) {
        ragContext = await buildRAGContext(user.id, lastUserMsg.content);
        if (ragContext) {
          ragSources = ragContext.sources;
        }
      }
    } catch (err) {
      // RAG failure should not block chat — log and continue
      console.warn("[Chat] RAG retrieval failed:", err instanceof Error ? err.message : "Unknown");
    }

    let systemContent = topic
      ? `${SYSTEM_PROMPT}\n\n${safeTopicContext(topic)}`
      : SYSTEM_PROMPT;

    // Inject RAG context if found
    if (ragContext) {
      systemContent += `
\n<retrieved_context>
The student has uploaded reference documents. Use these to ground your answers. If the context contains relevant information, prioritize it. If not, answer from your general knowledge.

${ragContext.contextBlock}
</retrieved_context>`;
    }

    const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemContent },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // ── LLM Call ──────────────────────────────────────────────────────
    const completion = await llm.chat.completions.create({
      model: LLM_MODEL,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 4096,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: "No response generated. Please try again." },
        { status: 502 }
      );
    }

    // ── Hallucination Flagging (non-blocking, informational) ──────────
    const hallucinationCheck = flagSuspiciousResponse(response);
    const durationMs = Date.now() - startTime;

    console.log(
      `[Chat] duration=${durationMs}ms chars=${response.length} suspicious=${hallucinationCheck.suspicious} concurrent=${activeRequests} ip=${clientIP.slice(0, 12)}`
    );

    if (hallucinationCheck.suspicious) {
      console.warn(
        `[Chat] Hallucination flags: ${hallucinationCheck.flags.join(", ")}`
      );
    }

    return NextResponse.json(
      {
        response,
        ...(ragSources.length > 0 && { sources: ragSources }),
        ...(hallucinationCheck.suspicious && {
          _meta: {
            hallucinationFlags: hallucinationCheck.flags,
            note: "Some content may be inaccurate. Verify important details.",
          },
        }),
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rl.remaining),
          "X-RateLimit-Limit": String(rl.limit),
          "X-Response-Time": `${durationMs}ms`,
        },
      }
    );
  } catch (error) {
    const durationMs = Date.now() - startTime;
    console.error(
      `[Chat] Error after ${durationMs}ms:`,
      error instanceof Error ? error.message : "Unknown"
    );

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. The question may be too complex — try breaking it down." },
        { status: 504 }
      );
    }

    // Groq rate limit error
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 429) {
      return NextResponse.json(
        { error: "LLM rate limit reached. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process your message. Please try again." },
      { status: 500 }
    );
  } finally {
    releaseSlot();
    activeRequests--;
  }
}