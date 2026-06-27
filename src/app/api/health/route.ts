import { NextResponse } from "next/server";
import { getCacheStats, getLLMConcurrencyStatus } from "@/lib/cache";
import { db } from "@/lib/db";

/**
 * Health Check Endpoint
 *
 * Returns system status including:
 * - Overall status (healthy / degraded / unhealthy)
 * - Database connectivity
 * - Cache statistics
 * - LLM concurrency status
 * - Uptime and memory usage
 */

const startTime = Date.now();

export async function GET() {
  const health: {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    uptime: string;
    version: string;
    checks: Record<string, { status: string; detail?: string; [key: string]: unknown }>;
  } = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: formatDuration(Date.now() - startTime),
    version: process.env.npm_package_version || "0.2.0",
    checks: {},
  };

  let hasIssue = false;

  // ── Database Check ──
  try {
    const userCount = await db.user.count();
    health.checks.database = {
      status: "ok",
      detail: `Connected. ${userCount} user(s) in DB.`,
    };
  } catch (err) {
    hasIssue = true;
    health.checks.database = {
      status: "error",
      detail: err instanceof Error ? err.message : "Connection failed",
    };
  }

  // ── Cache Check ──
  try {
    const cacheStats = getCacheStats();
    const totalEntries = Object.values(cacheStats).reduce(
      (sum, s) => sum + s.entries,
      0
    );
    const totalHits = Object.values(cacheStats).reduce(
      (sum, s) => sum + s.hits,
      0
    );
    health.checks.cache = {
      status: "ok",
      entries: totalEntries,
      totalHits,
      breakdown: cacheStats,
    };
  } catch (err) {
    hasIssue = true;
    health.checks.cache = {
      status: "error",
      detail: err instanceof Error ? err.message : "Cache read failed",
    };
  }

  // ── LLM Concurrency Check ──
  try {
    const llmStatus = getLLMConcurrencyStatus();
    health.checks.llm = {
      status: llmStatus.queued > 3 ? "degraded" : "ok",
      ...llmStatus,
    };
    if (llmStatus.queued > 3) hasIssue = true;
  } catch (err) {
    hasIssue = true;
    health.checks.llm = {
      status: "error",
      detail: err instanceof Error ? err.message : "LLM status check failed",
    };
  }

  // ── Memory Check ──
  try {
    const mem = process.memoryUsage();
    const heapMB = Math.round(mem.heapUsed / 1024 / 1024);
    const heapLimitMB = Math.round(mem.heapTotal / 1024 / 1024);
    const memRatio = mem.heapUsed / mem.heapTotal;
    health.checks.memory = {
      status: memRatio > 0.9 ? "warning" : "ok",
      heapUsedMB,
      heapLimitMB,
      rssMB: Math.round(mem.rss / 1024 / 1024),
    };
    if (memRatio > 0.9) hasIssue = true;
  } catch {
    // memoryUsage may not be available in all runtimes
  }

  if (hasIssue) {
    health.status = "degraded";
  }

  return NextResponse.json(health, {
    status: health.status === "unhealthy" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}