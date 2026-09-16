"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export const description = "Batch by Period"

const chartData = [
  { period: "Today", value: 0, fill: "#52b788" },
  { period: "Yesterday", value: 1, fill: "#52b788" },
  { period: "This Week", value: 1, fill: "#d4941e" },
  { period: "This Month", value: 5, fill: "#cf4b4b" },
]

export function ChartBarDefault() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-card">
      {/* Header with blue/purple bar indicator */}
      <div className="flex items-center gap-2 mb-1 shrink-0">
        <span className="h-4 w-1 rounded-full bg-[#4338ca]" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Batch by Period
        </h3>
      </div>

      {/* Bar Chart Area */}
      <div className="min-h-0 flex-1 w-full pt-2 pb-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="#e2e8f0"
              opacity={0.6}
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickMargin={8}
            />
            <YAxis
              ticks={[0, 2, 4, 6, 8]}
              domain={[0, 8]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickMargin={8}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {label}:{" "}
                      </span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {payload[0]?.value}
                      </span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="value" barSize={44} radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
