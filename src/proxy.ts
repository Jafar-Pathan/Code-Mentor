import { NextRequest, NextResponse } from "next/server";

// ─── Global Rate Limit (per IP, all endpoints combined) ────────────────
const globalBuckets = new Map<string, { count: number; resetAt: number }>();
const GLOBAL_MAX = 100; // 100 requests per minute total
const GLOBAL_WINDOW_MS = 60_000;

function globalRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let bucket = globalBuckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + GLOBAL_WINDOW_MS };
    globalBuckets.set(ip, bucket);
  }

  bucket.count++;
  const remaining = Math.max(0, GLOBAL_MAX - bucket.count);

  return { allowed: bucket.count <= GLOBAL_MAX, remaining };
}

// Cleanup stale buckets every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of globalBuckets) {
    if (now > bucket.resetAt) globalBuckets.delete(key);
  }
}, 120_000);

// ─── Max Request Body Size ─────────────────────────────────────────────
const MAX_API_BODY_SIZE = 1 * 1024 * 1024; // 1 MB for API routes
const MAX_PAGE_BODY_SIZE = 100_000; // 100 KB for page routes

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.clone();

  // Skip static files, _next, and favicon
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".svg") ||
    url.pathname === "/robots.txt"
  ) {
    return response;
  }

  const clientIP =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // ── Request Body Size Enforcement ───────────────────────────────────
  const contentLength = request.headers.get("content-length");
  if (contentLength) {
    const bytes = parseInt(contentLength, 10);
    if (!isNaN(bytes)) {
      const isApi = url.pathname.startsWith("/api");
      const maxSize = isApi ? MAX_API_BODY_SIZE : MAX_PAGE_BODY_SIZE;
      if (bytes > maxSize) {
        return NextResponse.json(
          {
            error: `Request body too large. Maximum: ${Math.round(maxSize / 1024)}KB.`,
          },
          { status: 413, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // ── Block Non-Standard HTTP Methods on API ──────────────────────────
  const method = request.method.toUpperCase();
  if (
    url.pathname.startsWith("/api") &&
    !["GET", "POST", "PUT", "DELETE", "OPTIONS"].includes(method)
  ) {
    return NextResponse.json(
      { error: "Method not allowed" },
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Global Rate Limiting ───────────────────────────────────────────
  const gl = globalRateLimit(clientIP);
  response.headers.set("X-RateLimit-Remaining", String(gl.remaining));

  if (!gl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "Content-Type": "application/json",
        },
      }
    );
  }

  // ── Security Headers ───────────────────────────────────────────────

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://d8j0ntlcm91z4.cloudfront.net",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // XSS Protection (legacy, but doesn't hurt)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy (disable features not needed)
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // HSTS (enforce HTTPS in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Request ID for tracing
  const requestId = crypto.randomUUID().slice(0, 8);
  response.headers.set("X-Request-Id", requestId);

  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Also match the page route for security headers
    "/",
  ],
};