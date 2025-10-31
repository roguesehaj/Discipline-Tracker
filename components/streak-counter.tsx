"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "./progress-ring"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface StreakData {
  currentStreak: number
  lastCheckInDate: string
  goal: number
}

export function StreakCounter() {
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [goal, setGoal] = useState(90)
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false)
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null)
  const [showGoalSelector, setShowGoalSelector] = useState(false)

  const goalOptions = [15, 30, 60, 90, 180, 365]

  useEffect(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem("streakData")
    if (stored) {
      const data: StreakData = JSON.parse(stored)
      const today = new Date().toDateString()
      const lastCheckIn = new Date(data.lastCheckInDate).toDateString()

      if (today === lastCheckIn) {
        setHasCheckedInToday(true)
      } else {
        const lastCheckInDateObj = new Date(data.lastCheckInDate)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (lastCheckInDateObj.toDateString() === yesterday.toDateString()) {
          // User checked in yesterday, streak continues
          setStreak(data.currentStreak)
        } else {
          // User missed a day, streak resets
          setStreak(0)
        }
      }
      setLastCheckInDate(data.lastCheckInDate)
      setGoal(data.goal || 90)
    } else {
      setShowGoalSelector(true)
    }
    setMounted(true)
  }, [])

  const saveStreak = (newStreak: number) => {
    const data: StreakData = {
      currentStreak: newStreak,
      lastCheckInDate: new Date().toISOString(),
      goal: goal,
    }
    localStorage.setItem("streakData", JSON.stringify(data))
    setLastCheckInDate(new Date().toISOString())
  }

  const handleCheckIn = () => {
    let newStreak = streak
    if (!hasCheckedInToday) {
      if (lastCheckInDate) {
        const lastCheckInDateObj = new Date(lastCheckInDate)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (lastCheckInDateObj.toDateString() === yesterday.toDateString()) {
          // Streak continues
          newStreak = streak + 1
        } else {
          // Streak resets to 1
          newStreak = 1
        }
      } else {
        // First check-in ever
        newStreak = 1
      }

      setStreak(newStreak)
      setHasCheckedInToday(true)
      saveStreak(newStreak)
    }
  }

  const handleReset = () => {
    setStreak(0)
    setHasCheckedInToday(false)
    localStorage.removeItem("streakData")
    setLastCheckInDate(null)
    setShowGoalSelector(true)
  }

  const handleGoalSelect = (selectedGoal: number) => {
    setGoal(selectedGoal)
    setShowGoalSelector(false)
    // Save the goal
    const data: StreakData = {
      currentStreak: streak,
      lastCheckInDate: lastCheckInDate || new Date().toISOString(),
      goal: selectedGoal,
    }
    localStorage.setItem("streakData", JSON.stringify(data))
  }

  if (!mounted) return null

  const percentage = Math.min((streak / goal) * 100, 100)
  const daysRemaining = Math.max(goal - streak, 0)
  const isGoalReached = percentage >= 100

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Goal Selector Modal */}
      {showGoalSelector && (
        <div className="w-full mb-4">
          <div className="bg-secondary/50 backdrop-blur rounded-lg p-6 border border-border">
            <h3 className="text-center text-lg font-light text-foreground mb-4">Choose Your Goal</h3>
            <div className="grid grid-cols-3 gap-3">
              {goalOptions.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleGoalSelect(option)}
                  variant={goal === option ? "default" : "outline"}
                  className="text-sm font-light"
                >
                  {option} days
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress Ring with Enhanced Visuals */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-2xl" />

        <ProgressRing
          percentage={percentage}
          size={260}
          strokeWidth={4}
          foreground="hsl(var(--primary))"
          background="hsl(var(--muted))"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl md:text-7xl font-light text-primary mb-2">{streak}</div>
          <div className="text-sm text-muted-foreground font-light tracking-wider">
            DAY{streak === 1 ? "" : "S"} OF FOCUS
          </div>
          {isGoalReached && <div className="text-xs text-accent font-semibold mt-2 animate-pulse">GOAL ACHIEVED!</div>}
        </div>
      </div>

      {/* Goal Progress Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <p className="text-muted-foreground text-sm">
            Goal: <span className="text-foreground font-medium">{goal} days</span>
          </p>
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
        <p className="text-sm text-foreground font-light">
          {daysRemaining > 0 ? (
            <>
              <span className="font-semibold text-accent">{daysRemaining}</span> days to reach your goal
            </>
          ) : (
            <span className="text-accent">Goal achieved! Keep the momentum going!</span>
          )}
        </p>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground font-light">{Math.round(percentage)}% progress</p>
      </div>

      {/* Check In Button */}
      <Button
        onClick={handleCheckIn}
        disabled={hasCheckedInToday}
        size="lg"
        className="px-12 py-6 text-lg font-light tracking-wide bg-primary hover:bg-primary/90 transition-all duration-300"
      >
        {hasCheckedInToday ? "✓ Checked In Today" : "Check In Today"}
      </Button>

      {/* Last Check In Info */}
      {lastCheckInDate && (
        <p className="text-xs text-muted-foreground">
          Last checked in:{" "}
          {new Date(lastCheckInDate).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      <div className="flex gap-3 mt-4">
        <Button
          onClick={() => setShowGoalSelector(!showGoalSelector)}
          variant="outline"
          size="sm"
          className="text-xs font-light"
        >
          Change Goal
        </Button>

        {/* Reset Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent text-xs font-light"
            >
              Reset Streak
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Reset Streak?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset your {streak}-day streak? This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset} className="bg-destructive">
                Reset
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
