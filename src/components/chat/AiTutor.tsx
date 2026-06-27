'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useAppStore } from '@/store/useAppStore';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

// Strict sanitize schema: allow markdown rendering but block all HTML/script injection
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
  },
  tagNames: [
    // Allow standard markdown output elements
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'a',
    'strong', 'em', 'del', 'blockquote',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'pre', 'code', 'span',
    'div', // needed for code block wrappers
  ],
};
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Send,
  Plus,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  BookOpen,
  Brain,
  Lightbulb,
  ChevronRight,
  X,
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';

// ── Mock conversation history ──────────────────────────────────────────
const MOCK_CONVERSATIONS = [
  { id: 'c1', title: 'Arrays & Hashing', timestamp: '2 hours ago', active: true },
  { id: 'c2', title: 'Binary Search Deep Dive', timestamp: 'Yesterday' },
  { id: 'c3', title: 'Java OOP Concepts', timestamp: '2 days ago' },
  { id: 'c4', title: 'SQL Joins Practice', timestamp: '3 days ago' },
  { id: 'c5', title: 'System Design: URL Shortener', timestamp: '1 week ago' },
];

const QUICK_START_SUGGESTIONS = [
  { icon: Lightbulb, label: 'Explain Big O Notation', query: 'Explain Big O Notation with examples' },
  { icon: Sparkles, label: 'Help me with Two Sum problem', query: 'Help me solve the Two Sum problem step by step' },
  { icon: BookOpen, label: 'Quiz me on Trees', query: 'Quiz me on binary trees and their traversals' },
  { icon: MessageSquare, label: 'Review my Java code', query: 'I need help reviewing my Java code' },
];

const RELATED_TOPICS = ['Arrays', 'Hash Maps', 'Two Pointers', 'Sliding Window', 'Sorting'];

const TOPIC_OPTIONS = [
  { value: 'data-structures', label: 'Data Structures' },
  { value: 'algorithms', label: 'Algorithms' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'sql', label: 'SQL' },
  { value: 'system-design', label: 'System Design' },
  { value: 'interview-prep', label: 'Interview Prep' },
];

// ── Typing indicator ───────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 max-w-3xl"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
        <Bot className="w-4 h-4 text-primary" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Code block with copy button ────────────────────────────────────────
function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  const lang = className?.replace('language-', '') || 'code';

  return (
    <div className="relative group my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-black/40 border border-border rounded-t-lg">
        <span className="text-xs text-muted-foreground font-mono">{lang}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3 h-3 text-success mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <div className="code-block rounded-t-none !rounded-t-none">
        <pre className="p-4 overflow-x-auto">
          <code className={className}>{children}</code>
        </pre>
      </div>
    </div>
  );
}

// ── Resize handle ──────────────────────────────────────────────────────
function ResizeHandle({ direction = 'vertical' }: { direction?: 'vertical' | 'horizontal' }) {
  return (
    <PanelResizeHandle
      className={`group relative flex items-center justify-center transition-colors ${
        direction === 'vertical' ? 'w-1.5 hover:w-2' : 'h-1.5 hover:h-2'
      }`}
    >
      <div
        className={`${
          direction === 'vertical'
            ? 'w-px h-8 rounded-full bg-border group-hover:bg-primary/40 group-active:bg-primary/60 transition-colors'
            : 'h-px w-8 rounded-full bg-border group-hover:bg-primary/40 group-active:bg-primary/60 transition-colors'
        }`}
      />
    </PanelResizeHandle>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function AiTutor() {
  const { chatMessages, chatLoading, addChatMessage, setChatLoading, clearChat } = useAppStore();
  const [input, setInput] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [activeConversation, setActiveConversation] = useState('c1');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  };

  // AbortController ref for cancelling in-flight requests on unmount
  const abortControllerRef = useRef<AbortController | null>(null);
  // Throttle ref to prevent rapid re-submissions
  const lastSendRef = useRef<number>(0);
  const SEND_THROTTLE_MS = 2000; // 2 seconds minimum between sends

  // Cancel any in-flight request on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Send message (with throttling, abort, and input validation)
  const handleSend = useCallback(async () => {
    if (!input.trim() || chatLoading) return;

    // ── Client-side input length validation ──
    if (input.length > 4000) {
      addChatMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Your message is too long. Please keep it under 4000 characters.',
        timestamp: new Date(),
      });
      return;
    }

    // ── Throttle: prevent rapid sends ──
    const now = Date.now();
    if (now - lastSendRef.current < SEND_THROTTLE_MS) {
      return;
    }
    lastSendRef.current = now;

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: input.trim().slice(0, 4000),
      timestamp: new Date(),
    };
    addChatMessage(userMsg);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setChatLoading(true);

    // ── Abort any previous in-flight request ──
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          topic: selectedTopic || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 429) {
          addChatMessage({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: 'You\'re sending messages too quickly. Please wait a moment before trying again.',
            timestamp: new Date(),
          });
        } else {
          addChatMessage({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: errData.error || `Request failed (${res.status}). Please try again.`,
            timestamp: new Date(),
          });
        }
        return;
      }

      const data = await res.json();
      addChatMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
        sources: data._meta?.hallucinationFlags ? ['Response may contain inaccuracies'] : undefined,
        timestamp: new Date(),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Request was cancelled — don't show error
        return;
      }
      addChatMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date(),
      });
    } finally {
      setChatLoading(false);
    }
  }, [input, chatLoading, chatMessages, selectedTopic, addChatMessage, setChatLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    clearChat();
    setActiveConversation('');
  };

  const handleSuggestionClick = (query: string) => {
    setInput(query);
    textareaRef.current?.focus();
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Get sources from the last assistant message
  const lastAssistantMsg = [...chatMessages].reverse().find((m) => m.role === 'assistant');
  const sources = lastAssistantMsg?.sources;

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">CodeMentor AI</h1>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Tutor
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setLeftCollapsed((c) => !c)}
              >
                {leftCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {leftCollapsed ? 'Show history' : 'Hide history'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setRightCollapsed((c) => !c)}
              >
                {rightCollapsed ? (
                  <PanelRightOpen className="w-4 h-4" />
                ) : (
                  <PanelRightClose className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {rightCollapsed ? 'Show context' : 'Hide context'}
            </TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* 3-panel layout */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* ── Left Panel: Conversation History ─────────────────────── */}
        {!leftCollapsed && (
          <>
            <Panel defaultSize={18} minSize={14} maxSize={22} className="flex flex-col">
              <div className="flex flex-col h-full border-r border-border bg-card/30">
                <div className="p-3 flex-shrink-0">
                  <Button
                    onClick={handleNewChat}
                    className="w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                  >
                    <Plus className="w-4 h-4" />
                    New Chat
                  </Button>
                </div>
                <ScrollArea className="flex-1 px-3 pb-3">
                  <div className="space-y-1">
                    {MOCK_CONVERSATIONS.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setActiveConversation(conv.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all group ${
                          activeConversation === conv.id
                            ? 'bg-primary/15 text-foreground border border-primary/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                          <span className="truncate font-medium">{conv.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground/70 ml-5.5 mt-0.5 block">
                          {conv.timestamp}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </Panel>
            <ResizeHandle />
          </>
        )}

        {/* ── Center Panel: Chat Area ──────────────────────────────── */}
        <Panel minSize={40} className="flex flex-col">
          <div className="flex flex-col h-full">
            {chatMessages.length === 0 ? (
              /* Welcome state */
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-center max-w-lg"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/15 flex items-center justify-center glow-cyan-sm">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 gradient-text">
                    How can I help you learn today?
                  </h2>
                  <p className="text-muted-foreground text-sm mb-8">
                    Ask me about data structures, algorithms, system design, or any programming topic.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUICK_START_SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={s.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                        onClick={() => handleSuggestionClick(s.query)}
                        className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                          <s.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-snug">
                          {s.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              /* Messages */
              <ScrollArea className="flex-1 px-4 py-4">
                <div className="max-w-3xl mx-auto space-y-4">
                  <AnimatePresence mode="popLayout">
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 ${
                          msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        {msg.role === 'assistant' && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={`relative max-w-[80%] ${
                            msg.role === 'user'
                              ? 'bg-primary/15 border border-primary/25 rounded-2xl rounded-tr-sm px-4 py-3'
                              : 'bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3'
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <Badge
                              variant="secondary"
                              className="absolute -top-2.5 left-3 text-[10px] px-1.5 py-0 bg-primary/20 text-primary border-0"
                            >
                              AI
                            </Badge>
                          )}

                          <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0.5 [&_h1]:text-base [&_h2]:text-base [&_h3]:text-sm [&_h4]:text-sm [&_strong]:text-foreground [&_code]:text-primary/90 [&_code:not(pre_*)]:bg-muted [&_code:not(pre_*)]:px-1.5 [&_code:not(pre_*)]:py-0.5 [&_code:not(pre_*)]:rounded [&_code:not(pre_*)]:text-xs [&_table]:text-xs [&_th]:border-border [&_td]:border-border [&_th]:p-2 [&_td]:p-2 [&_blockquote]:border-primary/30">
                            <ReactMarkdown
                              rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
                              components={{
                                pre({ children }) {
                                  return <>{children}</>;
                                },
                                code({ className: codeClassName, children, ...props }) {
                                  const isInline = !codeClassName;
                                  const match = /language-(\w+)/.exec(codeClassName || '');
                                  const codeString = String(children).replace(/\n$/, '');

                                  if (isInline) {
                                    return (
                                      <code className={codeClassName} {...props}>
                                        {children}
                                      </code>
                                    );
                                  }

                                  return (
                                    <CodeBlock className={codeClassName}>
                                      {codeString}
                                    </CodeBlock>
                                  );
                                },
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          {/* Copy message button */}
                          <div className="flex items-center justify-end mt-2 gap-1">
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="text-muted-foreground/50 hover:text-muted-foreground transition-colors p-1 rounded"
                              aria-label="Copy message"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {chatLoading && <TypingIndicator />}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}

            {/* Input area */}
            <div className="flex-shrink-0 border-t border-border bg-card/30 p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-end gap-2 bg-card border border-border rounded-2xl px-3 py-2 focus-within:border-primary/40 transition-colors">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about programming..."
                    className="flex-1 min-h-[36px] max-h-[160px] border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm placeholder:text-muted-foreground/50"
                    rows={1}
                    disabled={chatLoading}
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-xl flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40"
                        onClick={handleSend}
                        disabled={!input.trim() || chatLoading}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Send message</TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-44 h-7 text-xs border-border/50 bg-transparent">
                      <SelectValue placeholder="Select topic (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPIC_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-xs">
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-[10px] text-muted-foreground/50">
                    Press Enter to send, Shift+Enter for new line
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* ── Right Panel: Context ─────────────────────────────────── */}
        {!rightCollapsed && (
          <>
            <ResizeHandle />
            <Panel defaultSize={20} minSize={16} maxSize={25} className="flex flex-col">
              <div className="flex flex-col h-full border-l border-border bg-card/30">
                <ScrollArea className="flex-1 px-4 py-4">
                  <div className="space-y-6">
                    {/* Context header */}
                    <div>
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Context
                      </h3>
                    </div>

                    {/* Related Topics */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Related Topics
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {RELATED_TOPICS.map((topic) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-primary/15 hover:text-primary hover:border-primary/30 border border-transparent transition-all"
                          >
                            <ChevronRight className="w-3 h-3 mr-1 opacity-50" />
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Sources */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Sources
                      </h4>
                      {sources && sources.length > 0 ? (
                        <div className="space-y-2">
                          {sources.map((source, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 p-2.5 rounded-lg bg-background/50 border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <BookOpen className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary/70" />
                              <span className="leading-relaxed">{source}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                            <BookOpen className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                          <p className="text-xs text-muted-foreground/50">
                            Sources will appear here
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Quick Actions
                      </h4>
                      <div className="space-y-2">
                        {[
                          { icon: Sparkles, label: 'Generate Quiz' },
                          { icon: MessageSquare, label: 'Start Interview' },
                          { icon: BookOpen, label: 'Show Code Example' },
                        ].map((action) => (
                          <Button
                            key={action.label}
                            variant="outline"
                            className="w-full justify-start gap-2 h-9 text-xs border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all"
                          >
                            <action.icon className="w-3.5 h-3.5" />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
}