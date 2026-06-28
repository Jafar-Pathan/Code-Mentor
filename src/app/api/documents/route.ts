import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import {
  ingestDocument,
  listDocuments,
  deleteDocument,
  getDocumentStats,
} from "@/lib/rag";

// ─── Supported file types and size limits ─────────────────────────────────

const ALLOWED_TYPES: Record<string, string[]> = {
  "text/plain": ["txt"],
  "text/markdown": ["md", "markdown"],
  "text/csv": ["csv"],
  "application/json": ["json"],
  "text/x-python": ["py"],
  "text/x-java": ["java"],
  "text/x-javascript": ["js", "jsx", "ts", "tsx"],
  "text/x-sql": ["sql"],
  "text/html": ["html"],
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_TOTAL_DOCS = 50; // Per user
const MAX_TOTAL_CHARS = 5_000_000; // 5MB of text per user

// Demo user ID (production: from auth session)
const DEMO_USER_ID = "demo";

// ─── GET: List documents + stats ──────────────────────────────────────────

export async function GET(request: NextRequest) {
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(clientIP, "progress");
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  try {
    // Resolve user (demo: use first user)
    const user = await (await import("@/lib/db")).db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [documents, stats] = await Promise.all([
      listDocuments(user.id),
      getDocumentStats(user.id),
    ]);

    return NextResponse.json({ documents, stats });
  } catch (error) {
    console.error("[Documents] List error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json({ error: "Failed to list documents." }, { status: 500 });
  }
}

// ─── POST: Upload document ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(clientIP, "review"); // reuse review limits
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || file?.name || "Untitled";

    // ── Validate file exists ──
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // ── Validate file size ──
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum ${Math.round(MAX_FILE_SIZE / 1024)}KB.` },
        { status: 400 }
      );
    }

    if (file.size < 50) {
      return NextResponse.json(
        { error: "File too small (min 50 bytes)." },
        { status: 400 }
      );
    }

    // ── Validate file type ──
    const ext = file.name.split(".").pop()?.toLowerCase() || "txt";
    const allowedExts = Object.values(ALLOWED_TYPES).flat();
    if (!allowedExts.includes(ext) && !file.type.startsWith("text/")) {
      return NextResponse.json(
        {
          error: `Unsupported file type ".${ext}". Supported: ${allowedExts.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Resolve user ──
    const { db } = await import("@/lib/db");
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ── Check limits ──
    const stats = await getDocumentStats(user.id);
    if (stats.documents >= MAX_TOTAL_DOCS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_TOTAL_DOCS} documents reached. Delete some first.` },
        { status: 400 }
      );
    }
    if (stats.totalChars + file.size > MAX_TOTAL_CHARS) {
      return NextResponse.json(
        { error: "Total knowledge base size limit reached." },
        { status: 400 }
      );
    }

    // ── Read file content ──
    const text = await file.text();

    // ── Ingest ──
    const result = await ingestDocument(user.id, title, text, file.name, ext);

    console.log(
      `[Documents] Ingested "${title}" → ${result.chunkCount} chunks (${result.totalChars} chars)`
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(
      "[Documents] Upload error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return NextResponse.json(
      { error: "Failed to process document." },
      { status: 500 }
    );
  }
}

// ─── DELETE: Remove document ──────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rl = rateLimit(clientIP, "progress");
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  try {
    const body = await request.json();
    const documentId = body?.documentId as string | undefined;

    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json(
        { error: "documentId is required." },
        { status: 400 }
      );
    }

    const { db } = await import("@/lib/db");
    const user = await db.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deleted = await deleteDocument(documentId, user.id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Document not found." },
        { status: 404 }
      );
    }

    console.log(`[Documents] Deleted document ${documentId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "[Documents] Delete error:",
      error instanceof Error ? error.message : "Unknown"
    );
    return NextResponse.json(
      { error: "Failed to delete document." },
      { status: 500 }
    );
  }
}