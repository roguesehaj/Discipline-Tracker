"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const quotes = [
  "Energy conserved is strength earned",
  "Peace over impulse",
  "Discipline is the bridge between goals and accomplishment",
  "Small progress is still progress",
  "Every day is a chance to be better",
  "Mastery requires patience",
  "Consistency beats intensity",
  "You are stronger than your urges",
  "Focus is a superpower",
  "The best time was yesterday, the second best is today",
  "Discipline is choosing what you want most over what you want now",
  "Build your empire one brick at a time",
]

export function MotivationalQuote() {
  const [quote, setQuote] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("lastQuoteTime")
    const today = new Date().toDateString()

    if (stored !== today) {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      setQuote(quotes[randomIndex])
      localStorage.setItem("lastQuoteTime", today)
      localStorage.setItem("todaysQuote", quotes[randomIndex])
    } else {
      const storedQuote = localStorage.getItem("todaysQuote")
      setQuote(storedQuote || quotes[0])
    }
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Card className="border-0 bg-gradient-to-br from-primary/8 to-accent/8 dark:from-primary/12 dark:to-accent/12 hover:shadow-lg transition-all duration-300">
      <div className="p-8 md:p-10">
        <p className="text-center text-lg md:text-2xl text-foreground font-light italic leading-relaxed text-balance">
          "{quote}"
        </p>
      </div>
    </Card>
  )
}
