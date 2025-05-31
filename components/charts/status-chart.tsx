"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface StatusChartProps {
  data: {
    status: string
    count: number
  }[]
}

export function StatusChart({ data }: StatusChartProps) {
  const STATUS_COLORS = {
    new: "#3b82f6",
    "in-progress": "#f59e0b",
    review: "#8b5cf6",
    completed: "#10b981",
  }

  const STATUS_NAMES = {
    new: "Новые",
    "in-progress": "В работе",
    review: "На проверке",
    completed: "Завершенные",
  }

  const formattedData = data.map((item) => ({
    name: STATUS_NAMES[item.status as keyof typeof STATUS_NAMES],
    value: item.count,
    color: STATUS_COLORS[item.status as keyof typeof STATUS_COLORS],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика по статусам</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} проектов`, "Количество"]} />
              <Bar dataKey="value" name="Количество проектов">
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
