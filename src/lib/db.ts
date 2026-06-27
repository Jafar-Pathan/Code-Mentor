import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Neon Serverless PostgreSQL Connection
 *
 * Uses the Neon serverless driver over WebSocket/HTTP for:
 * - Cold-start friendly (no TCP connection pooling needed)
 * - Works on serverless platforms (Vercel, Lambda, Edge)
 * - Scales to thousands of concurrent connections
 *
 * Connection strings are set via environment variables:
 * - DATABASE_URL:         Pooled connection (via Neon proxy) — for queries
 * - DIRECT_DATABASE_URL:  Direct connection — for migrations (db push/migrate)
 *
 * Get your Neon connection strings at: https://console.neon.tech
 */

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. " +
      "Add it to your .env file. " +
      "Get a free Neon database at https://neon.tech"
    );
  }

  // Use Neon serverless adapter for WebSocket-based connections
  const sql = neon(databaseUrl);
  const adapter = new PrismaNeon(sql);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}