"use client";

import React from "react";
import { useAppStore } from "@/store/useAppStore";
import type { ViewType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardCheck,
  Code,
  Mic,
  BarChart3,
  Map,
  Menu,
  Bell,
  LogOut,
} from "lucide-react";

const navItems: { icon: React.ElementType; label: string; view: ViewType }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: MessageSquare, label: "AI Tutor", view: "tutor" },
  { icon: ClipboardCheck, label: "Quiz Center", view: "quiz" },
  { icon: Code, label: "Code Review", view: "review" },
  { icon: Mic, label: "Interview Prep", view: "interview" },
  { icon: BarChart3, label: "Analytics", view: "analytics" },
  { icon: Map, label: "Learning Roadmap", view: "roadmap" },
];

const viewTitles: Record<Exclude<ViewType, "landing">, string> = {
  dashboard: "Dashboard",
  tutor: "AI Tutor",
  quiz: "Quiz Center",
  review: "Code Review",
  interview: "Interview Prep",
  analytics: "Analytics",
  roadmap: "Learning Roadmap",
};

function SidebarContent({
  currentView,
  onNavigate,
}: {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}) {
  const { user, logout } = useAppStore();
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
          CM
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          CodeMentor
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left w-full ${
                  isActive
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User section */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.level}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
          aria-label="Log Out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { currentView, setView, sidebarOpen, setSidebarOpen, user } = useAppStore();
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const pageTitle =
    currentView === "landing" ? "CodeMentor" : viewTitles[currentView];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-border bg-sidebar">
        <SidebarContent currentView={currentView} onNavigate={setView} />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-r border-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent currentView={currentView} onNavigate={(v) => { setView(v); setSidebarOpen(false); }} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-r border-border">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarContent currentView={currentView} onNavigate={(v) => { setView(v); setSidebarOpen(false); }} />
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold text-foreground">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>

            {/* User avatar */}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}