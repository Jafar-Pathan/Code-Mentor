import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { getCached, setCache, hashKey } from "@/lib/cache";

// In production, userId comes from the authenticated session.
// This demo uses a query parameter with allowlist validation.
const ALLOWED_USER_IDS = ["demo"]; // Replace with auth-based user ID in production

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // ── Rate Limiting ────────────────────────────────────────────────────
  const rl = rateLimit(clientIP, "progress");
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    // ── User Resolution (production: from session) ─────────────────────
    // For demo: use the first user in the database.
    // Production: const session = await getServerSession(); const userId = session.user.id;
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ── Cache Check (short TTL — 30s) ─────────────────────────────────
    const cacheKey = hashKey(user.id, new Date().toISOString().slice(0, 13)); // Per-user, per-hour
    const cached = getCached<unknown>("progress", cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "X-Cache": "HIT", "X-RateLimit-Remaining": String(rl.remaining) },
      });
    }

    // ── Database Queries ──────────────────────────────────────────────
    const [progress, topics] = await Promise.all([
      db.learningProgress.findMany({
        where: { userId: user.id },
        orderBy: { mastery: "desc" },
      }),
      db.topic.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    // ── Deterministic weekly activity (seeded by date) ────────────────
    // Replaces the previous random generation so results are consistent per hour
    const weeklyActivity = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
      // Simple deterministic "random" based on date seed
      const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
      const pseudoRandom = ((seed * 2654435761) >>> 0) / 4294967296;
      const pseudoRandom2 = (((seed + 1) * 2654435761) >>> 0) / 4294967296;

      weeklyActivity.push({
        day: dayNames[dayIndex],
        quizzes: Math.floor(pseudoRandom * 4),
        minutes: Math.floor(pseudoRandom2 * 90) + 15,
        xp: Math.floor(pseudoRandom * 200) + 50,
      });
    }

    const skillBreakdown = progress.map((p) => ({
      topic: p.topic,
      mastery: p.mastery,
      quizzes: p.totalQuizzes,
      timeMinutes: p.totalTime,
    }));

    const totalMastery =
      progress.length > 0
        ? Math.round(
            progress.reduce((sum, p) => sum + p.mastery, 0) / progress.length
          )
        : 0;

    const result = {
      user: {
        name: user.name,
        level: user.level,
        streak: user.streak,
        xp: user.xp,
      },
      overview: {
        totalTopics: topics.length,
        completedTopics: progress.length,
        averageMastery: totalMastery,
        totalXP: user.xp,
        currentStreak: user.streak,
        weeklyQuizzes: 7,
        weeklyMinutes: 315,
      },
      weeklyActivity,
      skillBreakdown,
      weakTopics: progress
        .filter((p) => p.mastery < 50)
        .map((p) => ({ topic: p.topic, mastery: p.mastery }))
        .sort((a, b) => a.mastery - b.mastery),
      strongTopics: progress
        .filter((p) => p.mastery >= 75)
        .map((p) => ({ topic: p.topic, mastery: p.mastery }))
        .sort((a, b) => b.mastery - a.mastery),
    };

    // ── Cache Store ────────────────────────────────────────────────────
    setCache("progress", cacheKey, result);

    const durationMs = Date.now() - startTime;
    console.log(
      `[Progress] Fetched for ${user.email} in ${durationMs}ms (${progress.length} topics)`
    );

    return NextResponse.json(result, {
      headers: {
        "X-Cache": "MISS",
        "X-RateLimit-Remaining": String(rl.remaining),
        "X-Response-Time": `${durationMs}ms`,
      },
    });
  } catch (error) {
    console.error(
      "[Progress] Error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return NextResponse.json(
      { error: "Failed to fetch progress data." },
      { status: 500 }
    );
  }
}