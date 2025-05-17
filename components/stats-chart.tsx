"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { useTheme } from "next-themes"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

interface DailyStats {
  date: string
  reviewed: number
  again: number
  hard: number
  good: number
  easy: number
}

export function StatsChart() {
  const { reviewLogs } = useStore()
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    // Get the last 7 days
    const days: DailyStats[] = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      days.push({
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        reviewed: 0,
        again: 0,
        hard: 0,
        good: 0,
        easy: 0,
      })
    }

    // Fill in the stats
    reviewLogs.forEach((log) => {
      const logDate = new Date(log.timestamp)
      logDate.setHours(0, 0, 0, 0)

      // Check if the log is within the last 7 days
      const dayIndex = days.findIndex((day) => {
        const dayDate = new Date(now)
        dayDate.setDate(dayDate.getDate() - (6 - days.indexOf(day)))
        dayDate.setHours(0, 0, 0, 0)
        return dayDate.getTime() === logDate.getTime()
      })

      if (dayIndex !== -1) {
        days[dayIndex].reviewed++
        days[dayIndex][log.rating]++
      }
    })

    setDailyStats(days)
  }, [reviewLogs])

  return (
    <div className="grid grid-cols-1 gap-4">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={dailyStats}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
          <XAxis dataKey="date" stroke={isDark ? "#888" : "#666"} />
          <YAxis stroke={isDark ? "#888" : "#666"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f1f1f" : "#fff",
              borderColor: isDark ? "#333" : "#ddd",
              color: isDark ? "#fff" : "#000",
            }}
          />
          <Area
            type="monotone"
            dataKey="reviewed"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={dailyStats}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
          <XAxis dataKey="date" stroke={isDark ? "#888" : "#666"} />
          <YAxis stroke={isDark ? "#888" : "#666"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f1f1f" : "#fff",
              borderColor: isDark ? "#333" : "#ddd",
              color: isDark ? "#fff" : "#000",
            }}
          />
          <Legend />
          <Bar dataKey="again" fill="#ef4444" name="Again" />
          <Bar dataKey="hard" fill="#f97316" name="Hard" />
          <Bar dataKey="good" fill="#22c55e" name="Good" />
          <Bar dataKey="easy" fill="#3b82f6" name="Easy" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
