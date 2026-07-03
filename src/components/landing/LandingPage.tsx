'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Brain,
  Code,
  TrendingUp,
  MessageSquare,
  ClipboardCheck,
  BarChart3,
  Zap,
  Shield,
  ChevronRight,
  Play,
  ArrowRight,
  Check,
  Star,
  Bot,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
} from 'lucide-react';

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

/* ─── SECTION: Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, setShowAuthModal, setView } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">CodeMentor</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button size="sm" className="bg-primary text-primary-foreground rounded-lg hover:bg-primary/90" onClick={() => setView('dashboard')}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground rounded-lg hover:bg-primary/90" onClick={() => setShowAuthModal(true)}>
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl"
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              {isAuthenticated ? (
                <Button size="sm" className="bg-primary text-primary-foreground rounded-lg" onClick={() => { setMobileOpen(false); setView('dashboard'); }}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="text-muted-foreground justify-start" onClick={() => { setMobileOpen(false); setShowAuthModal(true); }}>
                    Sign In
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground rounded-lg" onClick={() => { setMobileOpen(false); setShowAuthModal(true); }}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

/* ─── SECTION: Hero ─── */
function Hero() {
  const { isAuthenticated, setShowAuthModal, setView } = useAppStore();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="hero-orb w-[500px] h-[500px] bg-primary top-[-10%] left-[-10%]" />
      <div className="hero-orb w-[400px] h-[400px] bg-chart-2 bottom-[5%] right-[-5%]" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary bg-primary/5"
          >
            <Sparkles className="w-3 h-3 mr-1.5" />
            Powered by Multi-Agent AI
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Master Programming with{' '}
          <span className="gradient-text">an AI Tutor That Adapts to You</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          CodeMentor uses specialized AI agents to create personalized learning paths,
          review your code, run mock interviews, and track your growth — so you can
          go from beginner to confident engineer.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={3}
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 h-12 px-8 text-sm font-medium"
            onClick={() => isAuthenticated ? setView('dashboard') : setShowAuthModal(true)}
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Learning Free"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg h-12 px-8 text-sm font-medium border-border hover:bg-accent"
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="relative mx-auto max-w-4xl"
        >
          <div className="glow-cyan rounded-xl border border-border bg-card/80 backdrop-blur-sm overflow-hidden">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 text-center text-xs text-muted-foreground">
                CodeMentor — Learning Dashboard
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Sidebar */}
              <div className="md:col-span-3 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-4">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Topics
                </div>
                {['Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Trees & Graphs', 'Dynamic Programming'].map((t, i) => (
                  <div
                    key={t}
                    className={`text-xs px-2.5 py-1.5 rounded-md ${
                      i === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {t}
                  </div>
                ))}
              </div>

              {/* Main Area */}
              <div className="md:col-span-6 p-4">
                {/* Code Block */}
                <div className="code-block p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Code className="w-3 h-3" />
                    solution.py
                  </div>
                  <pre className="text-xs sm:text-sm leading-relaxed overflow-x-auto">
                    <code>
                      <span className="text-chart-5">def</span>{' '}
                      <span className="text-chart-3">two_sum</span>(nums, target):{'\n'}
                      {'  '}seen = {}{'\n'}
                      {'  '}<span className="text-chart-5">for</span> i, n <span className="text-chart-5">in</span>{' '}
                      <span className="text-chart-3">enumerate</span>(nums):{'\n'}
                      {'    '}comp = target - n{'\n'}
                      {'    '}<span className="text-chart-5">if</span> comp <span className="text-chart-5">in</span> seen:{'\n'}
                      {'      '}<span className="text-chart-5">return</span> [seen[comp], i]{'\n'}
                      {'    '}seen[n] = i
                    </code>
                  </pre>
                </div>
                {/* Mini Chart */}
                <div className="flex items-end gap-1 h-12">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-primary/30"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Problem completion rate — last 12 weeks</p>
              </div>

              {/* Chat Panel */}
              <div className="md:col-span-3 p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Bot className="w-4 h-4 text-primary" />
                  AI Tutor
                </div>
                <div className="space-y-2.5">
                  <div className="bg-muted rounded-lg p-2.5 text-[11px] leading-relaxed">
                    Great approach using a hash map! The time complexity is O(n). Can you explain why the space complexity is also O(n)?
                  </div>
                  <div className="bg-primary/10 rounded-lg p-2.5 text-[11px] leading-relaxed text-primary/90 ml-4">
                    We store up to n elements in the dictionary…
                  </div>
                  <div className="bg-muted rounded-lg p-2.5 text-[11px] leading-relaxed">
                    Exactly right! Now try the Three Sum variant →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SECTION: Trust Bar ─── */
function TrustBar() {
  const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix', 'Stripe'];
  return (
    <section className="py-16 border-t border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by engineers at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {companies.map((name) => (
            <span
              key={name}
              className="text-lg sm:text-xl font-semibold text-muted-foreground/40 tracking-tight select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION: Problem Statement ─── */
function ProblemStatement() {
  const painPoints = [
    {
      title: 'Generic Explanations',
      desc: 'Most platforms give you the same answer regardless of your skill level or learning style. You end up watching hours of content that doesn\'t address your actual gaps.',
      icon: Target,
    },
    {
      title: 'No Personalization',
      desc: 'Static curriculums can\'t adapt when you struggle with a concept. You either fly through easy material or get stuck for weeks on hard topics.',
      icon: Users,
    },
    {
      title: 'Static Content',
      desc: 'Pre-recorded videos and fixed problem sets become outdated fast. There\'s no one to ask when you have a specific question at 2 AM.',
      icon: BookOpen,
    },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">THE PROBLEM</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-4">
            Traditional learning platforms leave you <span className="gradient-text">stuck</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            You&apos;re spending hours on tutorials but still can&apos;t crack interview problems.
            Here&apos;s why.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((p, i) => (
            <motion.div
              key={p.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              variants={fadeUp}
            >
              <Card className="bg-card/50 border-border hover:border-destructive/30 transition-colors h-full">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                    <p.icon className="w-5 h-5 text-destructive" />
                  </div>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION: Features Grid ─── */
function FeaturesGrid() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Tutoring',
      desc: 'A specialized tutor agent explains concepts at your level, adapting explanations in real-time based on your questions and progress.',
    },
    {
      icon: TrendingUp,
      title: 'Adaptive Learning',
      desc: 'Learning paths that adjust dynamically. Struggle with recursion? The system gives you more practice and simpler problems until you master it.',
    },
    {
      icon: Code,
      title: 'Code Review',
      desc: 'Submit your solutions and get detailed, line-by-line feedback on correctness, efficiency, style, and edge cases you might have missed.',
    },
    {
      icon: MessageSquare,
      title: 'Mock Interviews',
      desc: 'Practice with realistic coding interviews. The AI asks questions, evaluates your approach, and provides feedback just like a real interviewer.',
    },
    {
      icon: ClipboardCheck,
      title: 'Quiz Generation',
      desc: 'Custom quizzes generated on any topic at your chosen difficulty. Includes multiple-choice, fill-in-the-blank, and code-output questions.',
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      desc: 'Detailed dashboards showing your strengths, weaknesses, learning velocity, and predicted interview readiness over time.',
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 dot-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">FEATURES</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-4">
            Everything you need to <span className="gradient-text">level up</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Six specialized AI agents working together to give you the most effective
            programming education experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              variants={fadeUp}
            >
              <Card className="group bg-card/50 border-border hover:border-primary/30 transition-all duration-300 hover:bg-card/80 h-full">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION: How It Works ─── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: BookOpen,
      title: 'Choose Your Path',
      desc: 'Select a topic, skill level, and learning goal. Whether it\'s DSA for interviews, system design, or a new language — we build a plan for you.',
    },
    {
      num: '02',
      icon: Brain,
      title: 'Learn with AI',
      desc: 'Interactive sessions with your AI tutor. Ask questions, solve problems, get hints — the AI adapts to your pace and understanding in real-time.',
    },
    {
      num: '03',
      icon: BarChart3,
      title: 'Track & Improve',
      desc: 'See your progress across topics, identify weak areas, and get personalized recommendations on what to study next.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">HOW IT WORKS</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-16">
            Three steps to <span className="gradient-text">mastery</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              variants={fadeUp}
              className="relative flex flex-col items-center text-center px-4"
            >
              {/* Step circle */}
              <div className="relative z-10 w-14 h-14 rounded-full border-2 border-primary/40 bg-background flex items-center justify-center mb-6 glow-cyan-sm">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs font-mono text-primary mb-2">{s.num}</span>
              <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION: AI Agent Workflow ─── */
function AgentWorkflow() {
  const agents = [
    { name: 'Tutor Agent', icon: Brain, color: 'text-chart-3' },
    { name: 'Quiz Agent', icon: ClipboardCheck, color: 'text-chart-4' },
    { name: 'Code Review Agent', icon: Code, color: 'text-chart-1' },
    { name: 'Interview Agent', icon: MessageSquare, color: 'text-warning' },
  ];

  return (
    <section className="py-24 sm:py-32 grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">ARCHITECTURE</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-4">
            Multi-agent <span className="gradient-text">intelligence</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            A supervisor agent routes your requests to the right specialist. Each agent
            is fine-tuned for its specific task.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          {/* Supervisor */}
          <div className="flex justify-center mb-10">
            <div className="glow-cyan rounded-xl border border-primary/30 bg-card/80 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Supervisor Agent</p>
                <p className="text-xs text-muted-foreground">Routes & orchestrates all requests</p>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="flex justify-center mb-10">
            <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
              <div className="w-px h-6 bg-border" />
              <ChevronRight className="w-4 h-4 rotate-90" />
              <div className="w-px h-6 bg-border" />
            </div>
          </div>

          {/* Agent Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((a, i) => (
              <motion.div
                key={a.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
                variants={fadeUp}
              >
                <div className="rounded-xl border border-border bg-card/50 p-4 text-center hover:border-primary/20 transition-colors h-full flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                    <a.icon className={`w-5 h-5 ${a.color}`} />
                  </div>
                  <p className="text-sm font-medium">{a.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SECTION: Code Review Demo ─── */
function CodeReviewDemo() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">CODE REVIEW</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-4">
            See the <span className="gradient-text">difference</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Our Code Review Agent catches bugs, suggests optimizations, and teaches better patterns — all in seconds.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {/* Before */}
          <div className="rounded-xl border border-destructive/20 bg-card/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-destructive/5">
              <Badge variant="outline" className="text-destructive border-destructive/30 text-xs">
                Before
              </Badge>
              <span className="text-xs text-muted-foreground">issues found: 3</span>
            </div>
            <div className="p-4 font-mono text-xs sm:text-sm leading-loose overflow-x-auto">
              <div className="text-muted-foreground">
                <span className="text-chart-5">def</span>{' '}
                <span className="text-chart-3">get_median</span>(arr):
              </div>
              <div className="bg-destructive/10 -mx-4 px-4 border-l-2 border-destructive/50">
                &nbsp;&nbsp;arr.<span className="text-chart-5">sort</span>(){' '}
                <span className="text-destructive/70 text-[10px]">{'//'} mutates input!</span>
              </div>
              <div className="text-muted-foreground">
                &nbsp;&nbsp;n = <span className="text-chart-3">len</span>(arr)
              </div>
              <div className="bg-destructive/10 -mx-4 px-4 border-l-2 border-destructive/50">
                &nbsp;&nbsp;<span className="text-chart-5">if</span> n % 2 == 0:{' '}
                <span className="text-destructive/70 text-[10px]">{'//'} no edge case</span>
              </div>
              <div className="text-muted-foreground">
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-chart-5">return</span> arr[n//2]
              </div>
              <div className="bg-destructive/10 -mx-4 px-4 border-l-2 border-destructive/50">
                &nbsp;&nbsp;<span className="text-chart-5">return</span> arr[n//2]{' '}
                <span className="text-destructive/70 text-[10px]">{'//'} wrong formula</span>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="rounded-xl border border-success/20 bg-card/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-success/5">
              <Badge variant="outline" className="text-success border-success/30 text-xs">
                After
              </Badge>
              <span className="text-xs text-muted-foreground">all issues fixed</span>
            </div>
            <div className="p-4 font-mono text-xs sm:text-sm leading-loose overflow-x-auto">
              <div className="text-muted-foreground">
                <span className="text-chart-5">import</span> statistics
              </div>
              <div className="text-muted-foreground">
                <br />
                <span className="text-chart-5">def</span>{' '}
                <span className="text-chart-3">get_median</span>(arr):
              </div>
              <div className="bg-success/5 -mx-4 px-4 border-l-2 border-success/40">
                &nbsp;&nbsp;<span className="text-chart-5">if not</span> arr:{' '}
                <span className="text-chart-5">return None</span>
              </div>
              <div className="bg-success/5 -mx-4 px-4 border-l-2 border-success/40">
                &nbsp;&nbsp;<span className="text-chart-5">return</span>{' '}
                statistics.<span className="text-chart-3">median</span>(arr)
              </div>
              <div className="text-muted-foreground">
                <br />
                <span className="text-[10px] text-success/70">
                  {'//'} Clean, correct, and uses stdlib
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SECTION: Interview Mode Demo ─── */
function InterviewDemo() {
  return (
    <section className="py-24 sm:py-32 dot-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">INTERVIEW MODE</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-4">
            Practice like the <span className="gradient-text">real thing</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Our Interview Agent simulates real technical interviews with a timer, follow-up
            questions, and post-session feedback.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-xl border border-border bg-card/80 overflow-hidden glow-cyan-sm">
            {/* Interview Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mock Interview</p>
                  <p className="text-[11px] text-muted-foreground">Medium · Arrays</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-warning/30 text-warning">
                  <span className="animate-pulse-glow inline-block w-1.5 h-1.5 rounded-full bg-warning mr-1.5" />
                  24:37
                </Badge>
              </div>
            </div>

            {/* Question Area */}
            <div className="px-4 sm:px-6 py-4 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1.5 font-medium">QUESTION 1 OF 3</p>
              <p className="text-sm leading-relaxed">
                Given an array of integers <code className="bg-muted px-1.5 py-0.5 rounded text-xs">nums</code> and an
                integer <code className="bg-muted px-1.5 py-0.5 rounded text-xs">target</code>,
                return indices of the two numbers such that they add up to target. You may assume
                that each input would have exactly one solution, and you may not use the same element twice.
              </p>
            </div>

            {/* Editor Area */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {['solution.py', 'test.py'].map((tab, i) => (
                    <span
                      key={tab}
                      className={`text-[11px] px-3 py-1.5 rounded-md ${
                        i === 0 ? 'bg-muted text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                <div className="flex-1" />
                <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1.5">
                  <Play className="w-3 h-3" /> Run
                </Button>
                <Button size="sm" className="h-7 text-[11px] bg-primary text-primary-foreground">
                  Submit
                </Button>
              </div>
              <div className="code-block p-3">
                <pre className="text-xs sm:text-sm leading-loose">
                  <code>
                    <span className="text-chart-5">def</span>{' '}
                    <span className="text-chart-3">two_sum</span>(nums, target):{'\n'}
                    {'  '}seen = {}{'\n'}
                    {'  '}<span className="text-chart-5">for</span> i, n <span className="text-chart-5">in</span>{' '}
                    <span className="text-chart-3">enumerate</span>(nums):{'\n'}
                    {'    '}comp = target - n{'\n'}
                    {'    '}<span className="text-chart-5">if</span> comp <span className="text-chart-5">in</span> seen:{'\n'}
                    {'      '}<span className="text-chart-5">return</span> [seen[comp], i]{'\n'}
                    {'    '}seen[n] = i
                    <span className="animate-blink text-primary">│</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SECTION: Analytics Preview ─── */
function AnalyticsPreview() {
  const stats = [
    { label: 'Problems Solved', value: '247', change: '+12 this week' },
    { label: 'Interview Score', value: '82%', change: '+5% from last' },
    { label: 'Study Streak', value: '14 days', change: 'Personal best!' },
    { label: 'Topics Mastered', value: '8 / 15', change: '53% complete' },
  ];

  const topicProgress = [
    { name: 'Arrays & Hashing', pct: 92 },
    { name: 'Two Pointers', pct: 78 },
    { name: 'Sliding Window', pct: 65 },
    { name: 'Trees & Graphs', pct: 45 },
    { name: 'Dynamic Programming', pct: 30 },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">ANALYTICS</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-4">
            Data-driven <span className="gradient-text">improvement</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Track every dimension of your learning with beautiful, actionable analytics.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
          className="max-w-5xl mx-auto"
        >
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => (
              <Card key={s.label} className="bg-card/50 border-border">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                  <p className="text-[11px] text-primary mt-1">{s.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Topic Progress Bars */}
            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Topic Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topicProgress.map((t) => (
                  <div key={t.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{t.name}</span>
                      <span className="font-medium">{t.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${t.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mini Sparkline Chart + Progress Ring */}
            <Card className="bg-card/50 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1.5 h-32 mb-6">
                  {[3, 5, 2, 7, 4, 8, 6, 9, 5, 10, 7, 11].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-primary/40 hover:bg-primary/60 transition-colors"
                      style={{ height: `${(h / 12) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-8">
                  {/* Progress Ring */}
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary" strokeDasharray={`${2 * Math.PI * 34 * 0.68} ${2 * Math.PI * 34}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">68%</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Interview Readiness</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Estimated 3 weeks to target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SECTION: Testimonials ─── */
function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      initials: 'SC',
      color: 'bg-chart-1',
      quote: 'CodeMentor\'s adaptive learning completely changed how I prepared for interviews. The AI tutor identified gaps I didn\'t even know I had. Landed my dream job in 8 weeks.',
    },
    {
      name: 'Marcus Johnson',
      role: 'Senior Developer',
      company: 'Stripe',
      initials: 'MJ',
      color: 'bg-chart-3',
      quote: 'The code review agent is incredibly thorough. It catches edge cases and performance issues that even my senior colleagues miss. It\'s like having a mentor available 24/7.',
    },
    {
      name: 'Priya Patel',
      role: 'New Grad Engineer',
      company: 'Meta',
      initials: 'PP',
      color: 'bg-chart-4',
      quote: 'I went from struggling with basic DSA to confidently solving medium-hard problems. The mock interviews were the closest thing to actual FAANG interviews I\'ve experienced.',
    },
  ];

  return (
    <section className="py-24 sm:py-32 grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">TESTIMONIALS</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-16">
            Loved by <span className="gradient-text">engineers</span> everywhere
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              variants={fadeUp}
            >
              <Card className="bg-card/50 border-border h-full flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-semibold text-background`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role} at {t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION: FAQ ─── */
function FAQ() {
  const faqs = [
    {
      q: 'How does the AI tutor work?',
      a: 'Our AI tutor uses a multi-agent architecture where a supervisor agent routes your questions to specialized agents — a tutor agent for explanations, a code review agent for feedback, a quiz agent for practice, and an interview agent for mock interviews. Each agent is fine-tuned for its specific task, providing more accurate and contextual help than a general-purpose AI.',
    },
    {
      q: 'What topics are covered?',
      a: 'We cover Data Structures & Algorithms (arrays, linked lists, trees, graphs, dynamic programming, etc.), System Design, SQL & Databases, Object-Oriented Programming, and language-specific topics for Python, JavaScript, Java, C++, and Go. New topics are added regularly based on user demand.',
    },
    {
      q: 'Can I get code reviews on my own projects?',
      a: 'Absolutely! You can paste any code into the Code Review Agent and get detailed feedback on correctness, time/space complexity, code style, potential bugs, and edge cases. Pro and Enterprise users get unlimited reviews with line-by-line explanations.',
    },
    {
      q: 'How does interview prep work?',
      a: 'Our Interview Agent simulates real technical interviews. It asks questions at your chosen difficulty, provides hints if you\'re stuck, evaluates your code for correctness and efficiency, and gives post-interview feedback with a score and improvement suggestions — just like a real interviewer.',
    },
    {
      q: 'Is my progress saved across sessions?',
      a: 'Yes! All your progress is saved in your profile. You can pick up exactly where you left off, see your complete learning history, and track improvements over time. We also provide study recommendations based on your progress data.',
    },
    {
      q: 'What makes this different from ChatGPT?',
      a: 'While ChatGPT is a great general-purpose assistant, CodeMentor is purpose-built for programming education. Our multi-agent architecture provides specialized, context-aware help. We track your learning progress, adapt to your level, simulate real interviews, and provide structured learning paths — none of which a general chatbot can do effectively.',
    },
  ];

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">FAQ</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-16">
            Common <span className="gradient-text">questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          custom={0}
          variants={fadeUp}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SECTION: Pricing ─── */
function Pricing() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/mo',
      desc: 'Get started with the basics',
      features: [
        '5 AI tutor sessions per day',
        'Basic code reviews (3/day)',
        'Community topic library',
        'Progress tracking',
        'Single language support',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/mo',
      desc: 'For serious learners and job seekers',
      features: [
        'Unlimited AI tutor sessions',
        'Unlimited code reviews',
        'Mock interviews with feedback',
        'Custom quiz generation',
        'Advanced analytics dashboard',
        'All languages & topics',
        'Priority support',
      ],
      cta: 'Get Pro',
      highlighted: true,
      badge: 'Most Popular',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team management dashboard',
        'Custom learning paths',
        'API access',
        'SSO & admin controls',
        'Dedicated account manager',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 dot-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <p className="text-center text-sm text-primary font-medium mb-4">PRICING</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center tracking-tight max-w-3xl mx-auto mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
            Start free. Upgrade when you&apos;re ready to go all-in.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              custom={i}
              variants={fadeUp}
              className="flex"
            >
              <Card
                className={`relative w-full flex flex-col ${
                  tier.highlighted
                    ? 'border-primary/40 bg-card/80 glow-cyan gradient-border'
                    : 'bg-card/50 border-border'
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground text-xs px-3 py-0.5">
                      {tier.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pt-8 pb-4">
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tier.desc}</p>
                  <div className="pt-2">
                    <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full rounded-lg h-11 text-sm font-medium ${
                      tier.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SECTION: Final CTA ─── */
function FinalCTA() {
  const { isAuthenticated, setShowAuthModal, setView } = useAppStore();

  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
          variants={fadeUp}
          className="relative rounded-2xl border border-primary/20 bg-card/50 glow-cyan overflow-hidden"
        >
          {/* Background orb */}
          <div className="hero-orb w-[300px] h-[300px] bg-primary top-[-20%] right-[-10%] opacity-10" />

          <div className="relative z-10 px-6 sm:px-12 py-16 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto mb-4">
              Ready to transform your programming skills?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Join thousands of engineers who are leveling up faster with AI-powered learning.
              Start free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 h-12 px-8 text-sm font-medium"
                onClick={() => isAuthenticated ? setView('dashboard') : setShowAuthModal(true)}
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-lg h-12 px-8 text-sm font-medium border-border hover:bg-accent"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SECTION: Footer ─── */
function Footer() {
  const columns = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'AI Tutor', 'Code Review', 'Interview Prep', 'Analytics'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Blog', 'Changelog', 'Community', 'Status'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Press', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Security', 'GDPR'],
    },
  ];

  const socials = [
    { icon: Twitter, label: 'Twitter' },
    { icon: Github, label: 'GitHub' },
    { icon: Linkedin, label: 'LinkedIn' },
    { icon: Globe, label: 'Website' },
  ];

  return (
    <footer className="border-t border-border bg-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-semibold tracking-tight">CodeMentor</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              AI-powered programming education that adapts to you. Learn faster, interview better, code smarter.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CodeMentor AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span>SOC 2 Compliant · End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN: Landing Page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <ProblemStatement />
        <FeaturesGrid />
        <HowItWorks />
        <AgentWorkflow />
        <CodeReviewDemo />
        <InterviewDemo />
        <AnalyticsPreview />
        <Testimonials />
        <FAQ />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}