"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export const description = "Stock In & Out (30 Days)"

const chartData = [
  { date: "Aug 11", stockIn: 0, stockOut: 0 },
  { date: "Aug 12", stockIn: 0, stockOut: 0 },
  { date: "Aug 13", stockIn: 0, stockOut: 0 },
  { date: "Aug 14", stockIn: 0, stockOut: 0 },
  { date: "Aug 15", stockIn: 0, stockOut: 8000 },
  { date: "Aug 16", stockIn: 0, stockOut: 42000 },
  { date: "Aug 17", stockIn: 0, stockOut: 60500 },
  { date: "Aug 18", stockIn: 0, stockOut: 30000 },
  { date: "Aug 19", stockIn: 0, stockOut: 0 },
  { date: "Aug 20", stockIn: 0, stockOut: 0 },
  { date: "Aug 21", stockIn: 0, stockOut: 1200 },
  { date: "Aug 22", stockIn: 0, stockOut: 1500 },
  { date: "Aug 23", stockIn: 0, stockOut: 900 },
  { date: "Aug 24", stockIn: 0, stockOut: 0 },
  { date: "Aug 25", stockIn: 0, stockOut: 0 },
  { date: "Aug 26", stockIn: 1800, stockOut: 0 },
  { date: "Aug 27", stockIn: 32000, stockOut: 1000 },
  { date: "Aug 28", stockIn: 60000, stockOut: 1800 },
  { date: "Aug 29", stockIn: 10000, stockOut: 2000 },
  { date: "Aug 30", stockIn: 7000, stockOut: 800 },
  { date: "Aug 31", stockIn: 18000, stockOut: 300 },
  { date: "Sep 1", stockIn: 55000, stockOut: 0 },
  { date: "Sep 2", stockIn: 102000, stockOut: 0 },
  { date: "Sep 3", stockIn: 18000, stockOut: 0 },
  { date: "Sep 4", stockIn: 0, stockOut: 0 },
  { date: "Sep 5", stockIn: 0, stockOut: 0 },
  { date: "Sep 6", stockIn: 0, stockOut: 0 },
  { date: "Sep 7", stockIn: 0, stockOut: 0 },
]

export function ChartLineMultiple() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-card">
      {/* Header with blue/purple bar indicator */}
      <div className="flex items-center gap-2 mb-1 shrink-0">
        <span className="h-4 w-1 rounded-full bg-[#4338ca]" />
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Stock In & Out (30 Days)
        </h3>
      </div>

      {/* Line Chart Area */}
      <div className="min-h-0 flex-1 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="#e2e8f0"
              opacity={0.6}
            />
            <XAxis
              dataKey="date"
              ticks={["Aug 11", "Aug 16", "Aug 21", "Aug 26", "Aug 31", "Sep 5"]}
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1", strokeWidth: 1 }}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickMargin={8}
            />
            <YAxis
              ticks={[0, 25000, 50000, 75000, 100000]}
              domain={[0, 110000]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(val) => (val === 0 ? "0" : val.toLocaleString())}
              tickMargin={8}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md dark:border-slate-700 dark:bg-slate-900">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        {label}
                      </div>
                      <div className="flex items-center gap-2 text-[#5b51d8]">
                        <span>Stock In:</span>
                        <span className="font-mono font-medium">
                          {Number(payload[0]?.value || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#e26a2c]">
                        <span>Stock Out:</span>
                        <span className="font-mono font-medium">
                          {Number(payload[1]?.value || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="stockIn"
              stroke="#5b51d8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: "#5b51d8" }}
            />
            <Line
              type="monotone"
              dataKey="stockOut"
              stroke="#e26a2c"
              strokeWidth={2}
              strokeDasharray="3 3"
              dot={false}
              activeDot={{ r: 5, fill: "#e26a2c" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend matching the image */}
      <div className="flex items-center justify-center gap-6 pt-2 pb-0.5 text-xs shrink-0">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <div className="flex items-center">
            <span className="h-[2px] w-2.5 bg-[#5b51d8]" />
            <span className="h-2 w-2 rounded-full border-[1.5px] border-[#5b51d8] bg-white" />
            <span className="h-[2px] w-2.5 bg-[#5b51d8]" />
          </div>
          <span className="text-[#5b51d8] font-medium text-[11px]">Stock In</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <div className="flex items-center">
            <span className="h-[2px] w-2.5 border-t border-dotted border-[#e26a2c]" />
            <span className="h-2 w-2 rounded-full border-[1.5px] border-[#e26a2c] bg-white" />
            <span className="h-[2px] w-2.5 border-t border-dotted border-[#e26a2c]" />
          </div>
          <span className="text-[#e26a2c] font-medium text-[11px]">Stock Out</span>
        </div>
      </div>
    </div>
  )
}
