"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

export const description = "Stock Aging Pie Chart"

const chartData = [
  { name: "Green (0-180d)", value: 82, fill: "#95d5b2" },
  { name: "Yellow (181-360d)", value: 18, fill: "#b08928" },
]

export function ChartPieSimple() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-card">
      {/* Header with blue/purple bar indicator */}
      <div className="flex items-center gap-2 mb-1 shrink-0">
        <span className="h-4 w-1 rounded-full bg-[#4338ca]" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Stock Aging
        </h3>
      </div>

      {/* Pie Chart Area */}
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
                          {item.value}%
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
              outerRadius={72}
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
      <div className="flex items-center justify-center gap-4 pt-1 pb-0.5 text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: item.fill }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
