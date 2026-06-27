import Groq from "groq-sdk";

/**
 * Shared Groq LLM Client
 *
 * Centralizes LLM configuration so all API routes use the same
 * client, model, and settings. Easy to swap models or providers.
 *
 * Free tier limits (Groq):
 *   - 30 requests/minute
 *   - 14,400 requests/day
 *   - 6,000 tokens/minute
 *
 * Get your API key: https://console.groq.com/keys
 */

// ─── Model Configuration ─────────────────────────────────────────────────
// Change this one constant to switch the model across the entire app.

export const LLM_MODEL = "llama-3.3-70b-versatile";
// Alternatives (all free on Groq):
// "llama-3.1-8b-instant"       — fastest, good for simple tasks
// "llama-3.3-70b-versatile"    — best quality, recommended
// "mixtral-8x7b-32768"         — 32K context window
// "gemma2-9b-it"               — Google Gemma 2

// ─── Client Singleton ────────────────────────────────────────────────────

let groqClient: Groq | null = null;

export function getLLMClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not set. " +
        "Add it to your .env file. " +
        "Get a free API key at https://console.groq.com/keys"
      );
    }
    groqClient = new Groq({
      apiKey,
      timeout: 30_000, // 30s timeout (matches our LLM_TIMEOUT_MS in cache.ts)
    });
  }
  return groqClient;
}

// ─── Convenience Types ───────────────────────────────────────────────────

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  timeoutMs?: number;
}