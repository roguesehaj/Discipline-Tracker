"use client"

interface ProgressRingProps {
  percentage: number
  size: number
  strokeWidth: number
  foreground: string
  background: string
}

export function ProgressRing({ percentage, size, strokeWidth, foreground, background }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={background} strokeWidth={strokeWidth} fill="none" />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={foreground}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.35s ease",
        }}
      />
    </svg>
  )
}
