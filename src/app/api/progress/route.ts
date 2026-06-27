import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await db.user.findUnique({ where: { email: "alex@example.com" } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const progress = await db.learningProgress.findMany({
      where: { userId: user.id },
      orderBy: { mastery: "desc" },
    });

    const topics = await db.topic.findMany({
      orderBy: { order: "asc" },
    });

    const weeklyActivity = [];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      weeklyActivity.push({
        day: dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1],
        quizzes: Math.floor(Math.random() * 4),
        minutes: Math.floor(Math.random() * 90) + 15,
        xp: Math.floor(Math.random() * 200) + 50,
      });
    }

    const skillBreakdown = progress.map((p) => ({
      topic: p.topic,
      mastery: p.mastery,
      quizzes: p.totalQuizzes,
      timeMinutes: p.totalTime,
    }));

    const totalMastery = progress.length > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.mastery, 0) / progress.length)
      : 0;

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}