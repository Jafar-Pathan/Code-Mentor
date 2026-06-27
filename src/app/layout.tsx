import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeMentor AI - Your Intelligent Programming Tutor",
  description: "Master programming with AI-powered tutoring. Personalized learning paths, code reviews, mock interviews, and adaptive quizzes for Data Structures, Algorithms, and more.",
  keywords: ["AI Tutor", "Programming Education", "Code Review", "Interview Prep", "Data Structures", "Algorithms", "LeetCode", "System Design"],
  authors: [{ name: "CodeMentor AI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CodeMentor AI - Intelligent Programming Tutor",
    description: "AI-powered programming education with personalized learning paths, code reviews, and interview preparation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}