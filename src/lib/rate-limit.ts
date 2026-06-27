// ─── In-Memory Rate Limiter (Token Bucket) ──────────────────────────────────
// Production: Replace with Redis-backed Upstash or similar for multi-instance

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

interface RateLimitConfig {
  /** Max requests per window */
  maxRequests: number;
  /** Window duration in ms */
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 20,
  windowMs: 60_000,
};

// Per-endpoint stricter limits
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  chat: { maxRequests: 15, windowMs: 60_000 },       // 15/min — LLM is expensive
  quiz: { maxRequests: 5, windowMs: 60_000 },        // 5/min — quiz gen is heavy
  review: { maxRequests: 10, windowMs: 60_000 },     // 10/min
  interview: { maxRequests: 5, windowMs: 60_000 },   // 5/min
  progress: { maxRequests: 60, windowMs: 60_000 },   // 60/min — lightweight
};

// Cleanup stale buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    const age = now - bucket.lastRefill;
    if (age > 300_000) buckets.delete(key);
  }
}, 300_000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  limit: number;
}

export function rateLimit(
  identifier: string,
  endpoint?: string,
  config?: Partial<RateLimitConfig>
): RateLimitResult {
  const cfg = {
    ...DEFAULT_CONFIG,
    ...(endpoint && RATE_LIMITS[endpoint] ? RATE_LIMITS[endpoint] : {}),
    ...config,
  };

  const key = `${endpoint ?? "global"}:${identifier}`;
  const now = Date.now();

  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: cfg.maxRequests, lastRefill: now };
    buckets.set(key, bucket);
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  const tokensToAdd = (elapsed / cfg.windowMs) * cfg.maxRequests;
  bucket.tokens = Math.min(cfg.maxRequests, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetMs: cfg.windowMs,
      limit: cfg.maxRequests,
    };
  }

  const resetMs = Math.ceil(
    ((1 - bucket.tokens) / cfg.maxRequests) * cfg.windowMs
  );

  return {
    allowed: false,
    remaining: 0,
    resetMs,
    limit: cfg.maxRequests,
  };
}

// ─── Concurrency Limiter (Semaphore) ────────────────────────────────────────
// Prevents too many simultaneous LLM calls

const MAX_CONCURRENT_LLM = 5;
let currentLLMCalls = 0;
const waitQueue: Array<() => void> = [];

export async function acquireLLMSlot(): Promise<() => void> {
  if (currentLLMCalls < MAX_CONCURRENT_LLM) {
    currentLLMCalls++;
    return releaseLLMSlot;
  }

  return new Promise<() => void>((resolve) => {
    waitQueue.push(() => {
      currentLLMCalls++;
      resolve(releaseLLMSlot);
    });
  });
}

function releaseLLMSlot() {
  currentLLMCalls = Math.max(0, currentLLMCalls - 1);
  const next = waitQueue.shift();
  if (next) next();
}

export function getLLMConcurrencyStatus() {
  return {
    current: currentLLMCalls,
    max: MAX_CONCURRENT_LLM,
    queued: waitQueue.length,
  };
}