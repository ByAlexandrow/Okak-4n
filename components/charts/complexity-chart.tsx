"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ComplexityChartProps {
  data: {
    complexity: string
    count: number
  }[]
}

export function ComplexityChart({ data }: ComplexityChartProps) {
  const COLORS = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    critical: "#ef4444",
  }

  const formattedData = data.map((item) => ({
    name:
      item.complexity === "low"
        ? "Низкая"
        : item.complexity === "medium"
          ? "Средняя"
          : item.complexity === "high"
            ? "Высокая"
            : "Критическая",
    value: item.count,
    color: COLORS[item.complexity as keyof typeof COLORS],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Распределение по сложности</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} проектов`, "Количество"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
