"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";
import { Brain, Lock, Mail, User, Loader2 } from "lucide-react";

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, setUser, setIsAuthenticated, setView } = useAppStore();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success("Successfully logged in!");
      setUser(data);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setView("dashboard");
      // Reset form
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      toast.success("Account created successfully!");
      setUser(data);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      setView("dashboard");
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-[420px] bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 via-primary to-purple-500" />
        
        <DialogHeader className="pt-4 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            {activeTab === "login" ? "Welcome Back" : "Get Started"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm text-center">
            {activeTab === "login"
              ? "Sign in to continue your personalized coding path"
              : "Create an account to start learning with AI agents"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "login" | "signup")}
          className="w-full mt-4"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 p-1 border border-border/30">
            <TabsTrigger value="login" className="rounded-lg py-2 text-xs font-semibold">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg py-2 text-xs font-semibold">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4 focus-visible:outline-none">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-10 bg-muted/20 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-10 bg-muted/20 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all mt-6 shadow-lg shadow-primary/10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-4 focus-visible:outline-none">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-10 bg-muted/20 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-10 bg-muted/20 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-10 bg-muted/20 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/95 transition-all mt-6 shadow-lg shadow-primary/10"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
