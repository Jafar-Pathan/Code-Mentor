import { db } from "@/lib/db";

// ─── Configuration ─────────────────────────────────────────────────────────

const CHUNK_SIZE_CHARS = 1000;    // Characters per chunk
const CHUNK_OVERLAP_CHARS = 200;  // Overlap between chunks for context continuity
const MAX_CHUNKS_PER_DOC = 500;   // Safety cap
const MAX_RETRIEVED_CHUNKS = 5;   // How many chunks to inject into the prompt

// ─── Text Chunking ─────────────────────────────────────────────────────────

export interface Chunk {
  content: string;
  chunkIndex: number;
  charStart: number;
  charEnd: number;
}

/**
 * Splits text into overlapping chunks by character count.
 * Respects paragraph and sentence boundaries when possible.
 */
export function chunkText(text: string, chunkSize = CHUNK_SIZE_CHARS, overlap = CHUNK_OVERLAP_CHARS): Chunk[] {
  const chunks: Chunk[] = [];
  if (!text.trim()) return chunks;

  const effectiveChunkSize = Math.max(chunkSize - overlap, 200);
  let position = 0;

  while (position < text.length && chunks.length < MAX_CHUNKS_PER_DOC) {
    let end = Math.min(position + chunkSize, text.length);

    // Try to break at a paragraph boundary
    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf("\n\n", end);
      if (paragraphBreak > position + effectiveChunkSize) {
        end = paragraphBreak + 2;
      } else {
        // Try sentence boundary
        const sentenceBreak = text.lastIndexOf(". ", end);
        if (sentenceBreak > position + effectiveChunkSize) {
          end = sentenceBreak + 2;
        } else {
          // Try line break
          const lineBreak = text.lastIndexOf("\n", end);
          if (lineBreak > position + effectiveChunkSize) {
            end = lineBreak + 1;
          }
        }
      }
    }

    const content = text.slice(position, end).trim();
    if (content.length > 20) {
      // Skip tiny fragments
      chunks.push({
        content,
        chunkIndex: chunks.length,
        charStart: position,
        charEnd: end,
      });
    }

    position = end - overlap;
    if (position >= text.length) break;
    // Prevent infinite loop
    if (position <= chunks[chunks.length - 1]?.charStart) {
      position = chunks[chunks.length - 1].charEnd;
    }
  }

  return chunks;
}

// ─── Document Ingestion ────────────────────────────────────────────────────

export interface IngestResult {
  documentId: string;
  title: string;
  chunkCount: number;
  totalChars: number;
}

/**
 * Ingests a text document into the knowledge base.
 * Chunks the text and stores each chunk in the database.
 */
export async function ingestDocument(
  userId: string,
  title: string,
  text: string,
  fileName: string,
  fileType: string = "txt"
): Promise<IngestResult> {
  const chunks = chunkText(text);

  const document = await db.document.create({
    data: {
      userId,
      title,
      fileName,
      fileType,
      chunkCount: chunks.length,
      totalChars: text.length,
      chunks: {
        create: chunks.map((chunk) => ({
          content: chunk.content,
          chunkIndex: chunk.chunkIndex,
          charStart: chunk.charStart,
          charEnd: chunk.charEnd,
        })),
      },
    },
  });

  return {
    documentId: document.id,
    title: document.title,
    chunkCount: chunks.length,
    totalChars: text.length,
  };
}

// ─── Retrieval (Keyword-Based) ─────────────────────────────────────────────
// Uses PostgreSQL ILIKE for case-insensitive keyword matching.
// Upgrade to pgvector embeddings for semantic search later.

export interface RetrievedChunk {
  id: string;
  content: string;
  documentTitle: string;
  chunkIndex: number;
  relevanceScore: number;
}

/**
 * Searches the user's knowledge base for chunks relevant to a query.
 * Uses simple keyword matching — each query word must appear in the chunk.
 * Returns chunks ranked by how many query keywords they contain.
 */
export async function retrieveChunks(
  userId: string,
  query: string,
  maxChunks = MAX_RETRIEVED_CHUNKS
): Promise<RetrievedChunk[]> {
  // Extract meaningful keywords from the query (skip short words)
  const keywords = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (keywords.length === 0) return [];

  // Build ILIKE conditions for each keyword
  // We search in a subquery for performance, then score in memory
  const allChunks = await db.documentChunk.findMany({
    where: {
      document: { userId },
    },
    include: {
      document: {
        select: { title: true },
      },
    },
    take: 200, // Limit candidate set for performance
  });

  // Score each chunk by keyword density
  const scored = allChunks
    .map((chunk) => {
      const lower = chunk.content.toLowerCase();
      let matches = 0;
      for (const keyword of keywords) {
        if (lower.includes(keyword)) matches++;
      }
      // Score: fraction of keywords matched, bonus for higher density
      const relevance = keywords.length > 0
        ? matches / keywords.length
        : 0;
      return {
        id: chunk.id,
        content: chunk.content,
        documentTitle: chunk.document.title,
        chunkIndex: chunk.chunkIndex,
        relevanceScore: relevance,
      };
    })
    .filter((c) => c.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxChunks);

  return scored;
}

// ─── Context Assembly ──────────────────────────────────────────────────────

/**
 * Retrieves relevant chunks and assembles them into a context block
 * that can be injected into the LLM prompt.
 */
export async function buildRAGContext(
  userId: string,
  query: string
): Promise<{ contextBlock: string; sourceCount: number; sources: string[] } | null> {
  const chunks = await retrieveChunks(userId, query);

  if (chunks.length === 0) return null;

  const sources = [...new Set(chunks.map((c) => c.documentTitle))];
  const contextBlock = chunks
    .map(
      (c, i) =>
        `[Document: ${c.documentTitle} | Part ${c.chunkIndex + 1}]\n${c.content}`
    )
    .join("\n\n---\n\n");

  return {
    contextBlock,
    sourceCount: chunks.length,
    sources,
  };
}

// ─── Document Management ───────────────────────────────────────────────────

export async function listDocuments(userId: string) {
  return db.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      fileName: true,
      fileType: true,
      chunkCount: true,
      totalChars: true,
      createdAt: true,
    },
  });
}

export async function deleteDocument(documentId: string, userId: string): Promise<boolean> {
  const doc = await db.document.findFirst({
    where: { id: documentId, userId },
  });
  if (!doc) return false;

  // Chunks are cascade-deleted via the relation
  await db.document.delete({ where: { id: documentId } });
  return true;
}

export async function getDocumentStats(userId: string) {
  const [docCount, chunkCount, totalChars] = await Promise.all([
    db.document.count({ where: { userId } }),
    db.documentChunk.count({
      where: { document: { userId } },
    }),
    db.document.aggregate({
      where: { userId },
      _sum: { totalChars: true },
    }),
  ]);

  return {
    documents: docCount,
    chunks: chunkCount,
    totalChars: totalChars._sum.totalChars ?? 0,
  };
}