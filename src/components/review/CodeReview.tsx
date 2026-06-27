'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Code, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
  },
  tagNames: ['h1','h2','h3','h4','h5','h6','p','br','hr','ul','ol','li','a','strong','em','del','blockquote','table','thead','tbody','tr','th','td','pre','code','span','div'],
};

const MAX_CODE_LENGTH = 20000;

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'sql', label: 'SQL' },
];

export default function CodeReview() {
  const {
    reviewCode,
    reviewLanguage,
    reviewResult,
    reviewLoading,
    setReviewCode,
    setReviewLanguage,
    setReviewResult,
    setReviewLoading,
  } = useAppStore();

  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Cancel on unmount
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const handleAnalyze = useCallback(async () => {
    if (!reviewCode.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }
    if (reviewCode.length > MAX_CODE_LENGTH) {
      toast.error(`Code is too long. Maximum ${MAX_CODE_LENGTH.toLocaleString()} characters.`);
      return;
    }
    setReviewLoading(true);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ code: reviewCode, language: reviewLanguage }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || `Request failed (${res.status})`);
        return;
      }
      const data = await res.json();
      setReviewResult(data.review);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      toast.error('Failed to analyze code');
    } finally {
      setReviewLoading(false);
    }
  }, [reviewCode, reviewLanguage, setReviewLoading, setReviewResult]);

  const handleCopy = async () => {
    if (reviewResult) {
      await navigator.clipboard.writeText(reviewResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── LEFT: Code Editor ───────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-lg font-semibold">Code Editor</h2>
            <div className="flex items-center gap-3">
              <Select value={reviewLanguage} onValueChange={setReviewLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAnalyze} disabled={reviewLoading}>
                {reviewLoading ? (
                  <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Analyze Code
              </Button>
            </div>
          </div>

          <div className="relative flex-1">
            <textarea
              value={reviewCode}
              onChange={(e) => setReviewCode(e.target.value)}
              className="font-mono text-sm bg-background border rounded-lg p-4 min-h-[400px] resize-y w-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground/50 leading-relaxed"
              placeholder="Paste your code here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* ─── RIGHT: Review Results ───────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Review Results</h2>
              <Badge variant="outline" className="capitalize">
                {languageOptions.find((l) => l.value === reviewLanguage)?.label ?? reviewLanguage}
              </Badge>
            </div>
            {reviewResult && !reviewLoading && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>

          <Card className="flex-1 min-h-[400px]">
            <CardContent className="pt-6 h-full">
              {/* Placeholder state */}
              {!reviewResult && !reviewLoading && (
                <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center gap-3">
                  <div className="size-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                    <Code className="size-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Submit code to see review results
                  </p>
                </div>
              )}

              {/* Loading state */}
              {reviewLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="pt-2">
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              )}

              {/* Results state */}
              {reviewResult && !reviewLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="prose prose-invert prose-sm max-w-none
                    [&_h1]:text-lg [&_h1]:text-white [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:first:mt-0
                    [&_h2]:text-base [&_h2]:text-white [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4
                    [&_h3]:text-sm [&_h3]:text-white [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-3
                    [&_p]:text-muted-foreground [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-2
                    [&_ul]:my-2 [&_ol]:my-2 [&_li]:text-sm [&_li]:text-muted-foreground [&_li]:my-0.5
                    [&_strong]:text-foreground [&_strong]:font-semibold
                    [&_code]:text-primary/90
                    [&_code:not(pre_*)]:bg-muted [&_code:not(pre_*)]:px-1.5 [&_code:not(pre_*)]:py-0.5 [&_code:not(pre_*)]:rounded [&_code:not(pre_*)]:text-xs
                    [&_pre]:mt-2 [&_pre]:mb-2
                    [&_pre_code]:block [&_pre_code]:p-4 [&_pre_code]:rounded-lg [&_pre_code]:overflow-x-auto [&_pre_code]:text-sm [&_pre_code]:font-mono [&_pre_code]:leading-relaxed
                    [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
                    [&_hr]:border-border [&_hr]:my-4
                    [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2
                    [&_table]:text-xs [&_th]:border-border [&_td]:border-border [&_th]:p-2 [&_td]:p-2
                  "
                >
                  <ReactMarkdown
                    components={{
                      pre({ children }) {
                        return (
                          <div className="code-block">
                            <pre>{children}</pre>
                          </div>
                        );
                      },
                    }}
                  >
                    {reviewResult}
                  </ReactMarkdown>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}