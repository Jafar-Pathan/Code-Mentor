import { db } from "@/lib/db";

const DEFAULT_USER_EMAIL = "alex@example.com";

async function seed() {
  // Create default user
  const existing = await db.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!existing) {
    await db.user.create({
      data: {
        name: "Alex Chen",
        email: DEFAULT_USER_EMAIL,
        role: "student",
        level: "Intermediate",
        streak: 12,
        xp: 2450,
      },
    });
    console.log("Created default user");
  }

  // Create topics
  const topics = [
    { name: "Arrays", category: "Data Structures", order: 1, difficulty: "beginner" },
    { name: "Linked Lists", category: "Data Structures", order: 2, difficulty: "beginner" },
    { name: "Stacks & Queues", category: "Data Structures", order: 3, difficulty: "beginner" },
    { name: "Hash Maps", category: "Data Structures", order: 4, difficulty: "beginner" },
    { name: "Trees", category: "Data Structures", order: 5, difficulty: "intermediate" },
    { name: "Graphs", category: "Data Structures", order: 6, difficulty: "intermediate" },
    { name: "Heaps", category: "Data Structures", order: 7, difficulty: "intermediate" },
    { name: "Tries", category: "Data Structures", order: 8, difficulty: "intermediate" },
    { name: "Binary Search", category: "Algorithms", order: 9, difficulty: "beginner" },
    { name: "Sliding Window", category: "Algorithms", order: 10, difficulty: "intermediate" },
    { name: "Two Pointers", category: "Algorithms", order: 11, difficulty: "beginner" },
    { name: "Recursion", category: "Algorithms", order: 12, difficulty: "intermediate" },
    { name: "Dynamic Programming", category: "Algorithms", order: 13, difficulty: "advanced" },
    { name: "Greedy", category: "Algorithms", order: 14, difficulty: "intermediate" },
    { name: "Backtracking", category: "Algorithms", order: 15, difficulty: "advanced" },
    { name: "Java Basics", category: "Languages", order: 16, difficulty: "beginner" },
    { name: "Python Basics", category: "Languages", order: 17, difficulty: "beginner" },
    { name: "JavaScript ES6+", category: "Languages", order: 18, difficulty: "beginner" },
    { name: "SQL Fundamentals", category: "Languages", order: 19, difficulty: "beginner" },
    { name: "System Design", category: "Interview", order: 20, difficulty: "advanced" },
  ];

  for (const topic of topics) {
    const exists = await db.topic.findUnique({ where: { name: topic.name } });
    if (!exists) {
      await db.topic.create({ data: topic });
    }
  }

  // Create learning progress for user
  const user = await db.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (user) {
    const progressTopics = [
      { topic: "Arrays", mastery: 85, totalQuizzes: 5, totalTime: 120 },
      { topic: "Linked Lists", mastery: 72, totalQuizzes: 4, totalTime: 90 },
      { topic: "Stacks & Queues", mastery: 90, totalQuizzes: 6, totalTime: 150 },
      { topic: "Hash Maps", mastery: 65, totalQuizzes: 3, totalTime: 80 },
      { topic: "Trees", mastery: 45, totalQuizzes: 2, totalTime: 60 },
      { topic: "Binary Search", mastery: 80, totalQuizzes: 4, totalTime: 100 },
      { topic: "Two Pointers", mastery: 70, totalQuizzes: 3, totalTime: 75 },
      { topic: "Sliding Window", mastery: 35, totalQuizzes: 1, totalTime: 30 },
      { topic: "Recursion", mastery: 55, totalQuizzes: 2, totalTime: 50 },
      { topic: "Java Basics", mastery: 78, totalQuizzes: 4, totalTime: 110 },
    ];

    for (const p of progressTopics) {
      const existing = await db.learningProgress.findFirst({
        where: { userId: user.id, topic: p.topic },
      });
      if (!existing) {
        await db.learningProgress.create({
          data: {
            userId: user.id,
            topic: p.topic,
            mastery: p.mastery,
            totalQuizzes: p.totalQuizzes,
            totalTime: p.totalTime,
            lastStudied: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
  }

  console.log("Seed complete");
}

seed()
  .catch(console.error)
  .finally(() => process.exit(0));