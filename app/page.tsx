"use client";

import { useState, useEffect } from "react";
import { StreakCounter } from "@/components/streak-counter";
import { StreakHistory } from "@/components/streak-history";
import { MotivationalQuote } from "@/components/motivational-quote";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <DarkModeToggle />
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-3 tracking-tight">
            Focus Streak by{" "}
            <a
              href="https://github.com/roguesehaj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              SB
            </a>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            Build unbreakable discipline
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Streak Counter */}
          <div className="animate-fade-in-up-delay-1">
            <StreakCounter />
          </div>

          {/* Motivational Quote */}
          <div className="animate-fade-in-up-delay-2">
            <MotivationalQuote />
          </div>

          {/* Streak History */}
          <div className="animate-fade-in-up-delay-3">
            <StreakHistory />
          </div>
        </div>
      </div>
    </main>
  );
}
