// Re-export LLM concurrency control from rate-limit for convenient single-import in routes
export { acquireLLMSlot, getLLMConcurrencyStatus } from "./rate-limit";

/**
 * Semantic Response Cache
 * 
 * Caches AI responses based on a hash of the request parameters.
 * Uses LRU eviction to bound memory usage.
 * 
 * Production: Replace with Redis/Vercel KV for multi-instance deployments.
 */

interface CacheEntry<T> {
  data: T;
  createdAt: number;
  hits: number;
}

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX_ENTRIES = 500;

// Separate caches per endpoint with different TTLs
const caches = new Map<string, Map<string, CacheEntry<unknown>>>();

function getCache(endpoint: string): Map<string, CacheEntry<unknown>> {
  let cache = caches.get(endpoint);
  if (!cache) {
    cache = new Map();
    caches.set(endpoint, cache);
  }
  return cache;
}

// Simple hash function for cache keys
export function hashKey(...parts: string[]): string {
  const str = parts.join("::");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

export interface CacheConfig {
  ttlMs: number;
  maxEntries: number;
}

const ENDPOINT_CACHE_CONFIG: Record<string, CacheConfig> = {
  chat: { ttlMs: 0, maxEntries: 0 },          // Never cache chat (conversational)
  quiz: { ttlMs: 30 * 60 * 1000, maxEntries: 200 }, // 30 min, quiz gen is expensive
  review: { ttlMs: 15 * 60 * 1000, maxEntries: 200 }, // 15 min
  interview: { ttlMs: 30 * 60 * 1000, maxEntries: 200 },
  progress: { ttlMs: 30 * 1000, maxEntries: 100 }, // 30 sec, DB-backed
};

export function getCached<T>(
  endpoint: string,
  key: string
): T | null {
  const config = ENDPOINT_CACHE_CONFIG[endpoint];
  if (!config || config.ttlMs === 0) return null;

  const cache = getCache(endpoint);
  const entry = cache.get(key);

  if (!entry) return null;

  const age = Date.now() - entry.createdAt;
  if (age > config.ttlMs) {
    cache.delete(key);
    return null;
  }

  entry.hits++;
  return entry.data as T;
}

export function setCache<T>(
  endpoint: string,
  key: string,
  data: T
): void {
  const config = ENDPOINT_CACHE_CONFIG[endpoint];
  if (!config || config.ttlMs === 0) return;

  const cache = getCache(endpoint);

  // LRU eviction: if at capacity, delete oldest entry
  if (cache.size >= config.maxEntries) {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    for (const [k, v] of cache) {
      if (v.createdAt < oldestTime) {
        oldestTime = v.createdAt;
        oldestKey = k;
      }
    }
    if (oldestKey) cache.delete(oldestKey);
  }

  cache.set(key, {
    data,
    createdAt: Date.now(),
    hits: 0,
  });
}

export function invalidateCache(endpoint?: string): void {
  if (endpoint) {
    caches.delete(endpoint);
  } else {
    caches.clear();
  }
}

export function getCacheStats() {
  const stats: Record<string, { entries: number; hits: number }> = {};
  for (const [endpoint, cache] of caches) {
    let hits = 0;
    for (const entry of cache.values()) hits += entry.hits;
    stats[endpoint] = { entries: cache.size, hits };
  }
  return stats;
}

// ─── LLM Call Timeout ─────────────────────────────────────────────────────

export const LLM_TIMEOUT_MS = 30_000; // 30 seconds

/**
 * Creates an AbortController that auto-aborts after the given timeout.
 */
export function createTimeoutController(
  timeoutMs: number = LLM_TIMEOUT_MS
): { controller: AbortController; cleanup: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return {
    controller,
    cleanup: () => clearTimeout(timer),
  };
}