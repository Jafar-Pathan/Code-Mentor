# CodeMentor

An AI-powered learning platform for programming and technical interview prep — chat with an AI tutor grounded in your own uploaded materials (RAG), take adaptive quizzes, get AI code reviews, run mock interviews, and track your progress on a visual learning roadmap.

**Live demo:** [code-mentor-jm7a.vercel.app](https://code-mentor-jm7a.vercel.app/)

## Features

- **AI Tutor (RAG-powered chat)** — Ask questions and get answers grounded in a personal knowledge base. Upload `.txt`, `.md`, `.json`, `.csv`, and common source-code files; CodeMentor chunks and indexes them, retrieves the most relevant chunks per query (keyword-based scoring), and injects that context into the LLM prompt — with source documents cited in the response.
- **Quiz Center** — Category- and difficulty-based quizzes with a timer, live progress, answer explanations, and a results summary.
- **Code Review** — Paste code in a chosen language and get an AI-generated review rendered as structured markdown.
- **Interview Mode** — Simulated technical interviews with configurable type/topic/question count, timed answers, hints, and a session summary.
- **Analytics Dashboard** — Charts and stats on quiz performance, weekly activity, and topic mastery (strong vs. weak areas).
- **Learning Roadmap** — A visual, staged roadmap (locked / available / in-progress / completed) with per-node subtopics, XP, and time estimates.
- **Dashboard** — XP progress, recent activity, weak-topic callouts, and recommended next steps.

## Tech Stack

**Framework & UI**
- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Tailwind CSS 4, shadcn/ui on Radix UI primitives
- Zustand for client state, TanStack Query & Table
- framer-motion, recharts, dnd-kit, react-markdown, react-syntax-highlighter

**Backend & Data**
- Prisma ORM on PostgreSQL (Neon serverless)
- NextAuth for authentication
- Route handlers for chat, quiz, code review, interview, progress, documents, and health check

**AI**
- [Groq](https://console.groq.com/) (`openai/gpt-oss-120b`) via `groq-sdk`
- Custom RAG pipeline: paragraph/sentence-aware chunking → PostgreSQL storage → keyword-based retrieval → context injection (upgradeable to vector/pgvector retrieval)

**Runtime & Tooling**
- [Bun](https://bun.sh/) for scripts/runtime, ESLint, Caddy (reverse proxy config included)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- A [Neon](https://neon.tech/) PostgreSQL database (pooled + direct connection strings)
- A [Groq](https://console.groq.com/keys) API key

### Installation

```bash
git clone https://github.com/Jafar-Pathan/Code-Mentor.git
cd Code-Mentor
bun install
```

### Environment variables

Create a `.env` file with:

```bash
DATABASE_URL=            # Neon pooled connection string
DIRECT_URL=               # Neon direct connection string
GROQ_API_KEY=              # from console.groq.com/keys
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

### Database setup

```bash
bun run db:push       # push Prisma schema to your database
bun prisma db seed    # optional: seed sample data
```

### Run locally

```bash
bun run dev
```

The app runs at `http://localhost:3000`.

### Build for production

```bash
bun run build
bun run start
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the dev server |
| `bun run build` | Build for production |
| `bun run start` | Run the production build |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push Prisma schema to the database |
| `bun run db:generate` | Generate the Prisma client |
| `bun run db:migrate` | Run Prisma migrations (dev) |
| `bun run db:reset` | Reset the database |

## Project Structure

```
├── data/            # RAG knowledge-base seed content (curriculum, examples, cheatsheets, FAQs)
├── prisma/          # Prisma schema & seed script
├── src/
│   ├── app/         # Next.js App Router pages & API routes
│   ├── components/  # Landing, dashboard, chat, quiz, review, interview, analytics, roadmap UI
│   ├── hooks/        # Custom hooks (e.g. debounce)
│   ├── lib/          # LLM client, RAG pipeline, db client
│   └── store/         # Zustand store
├── mini-services/   # Supporting services
└── Caddyfile        # Reverse proxy config
```

## Production Hardening

The app includes Zod input validation, dual-layer rate limiting, prompt-injection and hallucination guards, LRU caching, an LLM concurrency semaphore with timeouts, client-side debouncing, React error boundaries, security headers (CSP, HSTS, X-Frame-Options), request body size limits, database indexes, and a `/api/health` endpoint reporting DB connectivity, cache stats, and uptime.

## Notes

- The RAG pipeline currently uses keyword-based relevance scoring rather than vector embeddings; it's structured to be upgraded to embedding-based retrieval (e.g. pgvector) later.
- Groq's free tier is used for LLM calls (rate limits apply — check the [Groq console](https://console.groq.com/) for current limits).

## Author

Built by [Jafar Pathan](https://github.com/Jafar-Pathan).

## License

No license file is currently included in this repository.
