"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export const description = "Stock In : Master (30 Days)"

const chartData = [
  { name: "TD Shirt", value: 48, fill: "#7c3aed" },
  { name: "NH-150", value: 22, fill: "#52b788" },
  { name: "test", value: 16, fill: "#d4941e" },
  { name: "300 Flow -150 Man", value: 5, fill: "#c53030" },
  { name: "MacBook Pro", value: 3, fill: "#2563eb" },
  { name: "test (2)", label: "test", value: 3, fill: "#86efac" },
  { name: "Chair", value: 2, fill: "#b83280" },
  { name: "test000", value: 1, fill: "#6366f1" },
]

const legendItems = [
  { label: "Chair", fill: "#b83280" },
  { label: "300 Flow -150 Man", fill: "#c53030" },
  { label: "MacBook Pro", fill: "#2563eb" },
  { label: "NH-150", fill: "#52b788" },
  { label: "TD Shirt", fill: "#7c3aed" },
  { label: "test", fill: "#d4941e" },
  { label: "test", fill: "#86efac" },
  { label: "test000", fill: "#6366f1" },
]

export function ChartPieDonut() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-card">
      {/* Header with blue/purple bar indicator */}
      <div className="flex items-center gap-2 mb-1 shrink-0">
        <span className="h-4 w-1 rounded-full bg-[#4338ca]" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Stock In : Master (30 Days)
        </h3>
      </div>

      {/* Donut Chart Area */}
      <div className="min-h-0 flex-1 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0]
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.payload?.fill }}
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {item.name}:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={44}
              outerRadius={72}
              paddingAngle={1}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend matching the image */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-1 pb-0.5 text-[10px] text-slate-500 shrink-0">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <span
              className="h-2 w-2.5 shrink-0 rounded-[1px]"
              style={{ backgroundColor: item.fill }}
            />
            <span className="leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
