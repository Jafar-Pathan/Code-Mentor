# Task 5 — AI Tutor Chat Component

## Agent: AI Tutor Builder

## Work Log
- Created `/home/z/my-project/src/components/chat/AiTutor.tsx` — full 3-panel AI tutor chat component
- Updated `/home/z/my-project/src/app/page.tsx` to import AiTutor and render it on the `"tutor"` view
- Verified `/api/chat` route already exists (uses z-ai-web-dev-sdk for LLM completions)
- ESLint passes with zero errors
- Dev server compiles and serves page with 200 status

## Component Details

### Left Panel (Conversation History, ~18% width, collapsible)
- "New Chat" button with Plus icon — calls `clearChat()` and resets active conversation
- 5 hardcoded mock conversations: "Arrays & Hashing", "Binary Search Deep Dive", "Java OOP Concepts", "SQL Joins Practice", "System Design: URL Shortener"
- Each shows title, timestamp, and MessageSquare icon; active one highlighted with primary bg
- ScrollArea for the list
- Collapsible via header toggle button (PanelLeftClose/PanelLeftOpen)

### Center Panel (Chat Area, 40%+ min)
- **Welcome state** (no messages): Brain icon with glow, "How can I help you learn today?" heading, 4 quick-start suggestion cards with staggered framer-motion animations
- **Messages state**: ScrollArea with animated message bubbles (framer-motion AnimatePresence)
  - User messages: right-aligned, `bg-primary/15` with primary border, rounded
  - Assistant messages: left-aligned, `bg-card` with border, "AI" badge above
  - Markdown rendering via `ReactMarkdown` with custom `code` and `pre` components
  - Code blocks: custom `CodeBlock` component with language label, copy button, `code-block` CSS class
  - Copy button on every message bubble
- **Typing indicator**: 3 animated bouncing dots with Bot avatar
- **Input area**: auto-growing Textarea (max 4 lines / 160px), Send button, topic Select dropdown, keyboard hint text
- Enter to send, Shift+Enter for newline

### Right Panel (Context, ~20% width, collapsible)
- "Context" header with Sparkles icon
- "Related Topics": 5 topic badges (Arrays, Hash Maps, Two Pointers, Sliding Window, Sorting)
- "Sources": dynamically reads from last assistant message's `sources` field; shows empty state when none
- "Quick Actions": 3 buttons — "Generate Quiz", "Start Interview", "Show Code Example"

### Layout & UX
- `react-resizable-panels` PanelGroup horizontal with custom ResizeHandle
- Header bar with CodeMentor branding and panel toggle buttons
- Uses: useAppStore (chatMessages, chatLoading, addChatMessage, setChatLoading, clearChat)
- shadcn: Button, Badge, ScrollArea, Textarea, Tooltip, Select
- lucide-react: Send, Plus, Sparkles, Copy, Check, MessageSquare, BookOpen, Brain, Lightbulb, ChevronRight, Bot, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen
- framer-motion for message appearance, welcome cards stagger, typing indicator

## Stage Summary
- Full-featured AI Tutor chat component built
- File: /home/z/my-project/src/components/chat/AiTutor.tsx
- Page updated: /home/z/my-project/src/app/page.tsx
- Zero lint errors, dev server compiles successfully