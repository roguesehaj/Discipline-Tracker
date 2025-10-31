"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface HistoryEntry {
  date: string
  streak: number
  resetDate?: string
}

export function StreakHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("streakHistory")
    if (stored) {
      setHistory(JSON.parse(stored))
    }
    setMounted(true)
  }, [])

  // Log current streak to history when it changes
  useEffect(() => {
    if (!mounted) return

    const streakData = localStorage.getItem("streakData")
    if (streakData) {
      const { currentStreak, lastResetDate } = JSON.parse(streakData)
      const today = new Date().toDateString()

      const existing = localStorage.getItem("streakHistory")
      const historyData: HistoryEntry[] = existing ? JSON.parse(existing) : []

      // Check if today is already logged
      if (historyData.length === 0 || historyData[0].date !== today) {
        const newEntry: HistoryEntry = {
          date: today,
          streak: currentStreak,
          resetDate: lastResetDate,
        }
        historyData.unshift(newEntry)
        localStorage.setItem("streakHistory", JSON.stringify(historyData.slice(0, 30))) // Keep last 30 entries
        setHistory(historyData)
      }
    }
  }, [mounted])

  if (!mounted || history.length === 0) return null

  return (
    <Card className="border-0 bg-card/50 backdrop-blur">
      <div className="p-6 md:p-8">
        <h2 className="text-lg font-light text-foreground mb-6">Recent Activity</h2>

        <div className="space-y-3">
          {history.slice(0, 10).map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground font-light">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="text-sm text-primary font-medium">{entry.streak} day streak</div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center font-light">Tracking last 10 entries</p>
      </div>
    </Card>
  )
}
