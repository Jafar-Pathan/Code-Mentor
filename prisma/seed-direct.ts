import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    // Check if user exists
    let res = await client.query("SELECT id FROM \"User\" WHERE email = $1", ["alex@example.com"]);
    let userId: string;
    if (res.rows.length === 0) {
      res = await client.query(
        `INSERT INTO "User" (id, name, email, role, level, streak, xp, "createdAt", "updatedAt") VALUES (gen_random_uuid(), 'Alex Chen', 'alex@example.com', 'student', 'Intermediate', 12, 2450, NOW(), NOW()) RETURNING id`
      );
      userId = res.rows[0].id;
      console.log("Created user:", userId);
    } else {
      userId = res.rows[0].id;
      console.log("User exists:", userId);
    }

    // Topics
    const topics = [
      ["Arrays", "Data Structures", 1, "beginner"],
      ["Linked Lists", "Data Structures", 2, "beginner"],
      ["Stacks & Queues", "Data Structures", 3, "beginner"],
      ["Hash Maps", "Data Structures", 4, "beginner"],
      ["Trees", "Data Structures", 5, "intermediate"],
      ["Graphs", "Data Structures", 6, "intermediate"],
      ["Heaps", "Data Structures", 7, "intermediate"],
      ["Tries", "Data Structures", 8, "intermediate"],
      ["Binary Search", "Algorithms", 9, "beginner"],
      ["Sliding Window", "Algorithms", 10, "intermediate"],
      ["Two Pointers", "Algorithms", 11, "beginner"],
      ["Recursion", "Algorithms", 12, "intermediate"],
      ["Dynamic Programming", "Algorithms", 13, "advanced"],
      ["Greedy", "Algorithms", 14, "intermediate"],
      ["Backtracking", "Algorithms", 15, "advanced"],
      ["Java Basics", "Languages", 16, "beginner"],
      ["Python Basics", "Languages", 17, "beginner"],
      ["JavaScript ES6+", "Languages", 18, "beginner"],
      ["SQL Fundamentals", "Languages", 19, "beginner"],
      ["System Design", "Interview", 20, "advanced"],
    ];

    for (const [name, cat, order, diff] of topics) {
      await client.query(
        `INSERT INTO "Topic" (id, name, category, "order", difficulty, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW()) ON CONFLICT (name) DO NOTHING`,
        [name, cat, order, diff]
      );
    }
    console.log("Topics seeded");

    // Learning progress
    const progress = [
      ["Arrays", 85, 5, 120],
      ["Linked Lists", 72, 4, 90],
      ["Stacks & Queues", 90, 6, 150],
      ["Hash Maps", 65, 3, 80],
      ["Trees", 45, 2, 60],
      ["Binary Search", 80, 4, 100],
      ["Two Pointers", 70, 3, 75],
      ["Sliding Window", 35, 1, 30],
      ["Recursion", 55, 2, 50],
      ["Java Basics", 78, 4, 110],
    ];

    for (const [topic, mastery, quizzes, time] of progress) {
      await client.query(
        `INSERT INTO "LearningProgress" (id, "userId", topic, mastery, "totalQuizzes", "totalTime", "lastStudied", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW() - (random() * 7 * interval '1 day'), NOW(), NOW()) ON CONFLICT DO NOTHING`,
        [userId, topic, mastery, quizzes, time]
      );
    }
    console.log("Progress seeded");
    console.log("DONE");
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(e => { console.error(e); process.exit(1); });
