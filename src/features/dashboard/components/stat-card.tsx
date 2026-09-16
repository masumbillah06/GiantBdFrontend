import React, { ReactNode } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

export interface StatBreakdownItem {
  label: string;
  value: string | number;
}
export interface StatCardProps {
  title: ReactNode;
  value: string | number;
  unit?: string;
  breakdown?: StatBreakdownItem[] | ReactNode;
  trend?: "up" | "down" | "neutral" | "none";
  icon?: ReactNode;
  trendColorClass?: string;
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  title,
  value,
  unit,
  breakdown,
  trend = "up",
  icon,
  trendColorClass,
  className = "",
  onClick,
}: StatCardProps) {
  // Render the top-right indicator / icon
  const renderTrendIcon = () => {
    if (icon) return icon;

    if (trend === "none") return null;

    const 
    defaultColor =
      trendColorClass ||
      (trend === "up"
        ? "text-emerald-500"
        : trend === "down"
        ? "text-rose-500"
        : "text-slate-400");

    if (trend === "up") {
      return (
        <ArrowUp
          className={`h-5 w-5 stroke-[2.2] transition-transform ${defaultColor}`}
          aria-label="Trending up"
        />
      );
    }

    if (trend === "down") {
      return (
        <ArrowDown
          className={`h-5 w-5 stroke-[2.2] transition-transform ${defaultColor}`}
          aria-label="Trending down"
        />
      );
    }

    return (
      <Minus
        className={`h-5 w-5 stroke-[2.2] ${defaultColor}`}
        aria-label="Neutral trend"
      />
    );
  };

  // Render bottom breakdown line
  const renderBreakdown = () => {
    if (!breakdown) return null;

    if (Array.isArray(breakdown)) {
      return (
        <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-[13px] font-medium text-slate-500">
          {breakdown.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-slate-300">|</span>}
              <span>
                {item.value} {item.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      );
    }

    // Direct string or custom ReactNode
    if (typeof breakdown === "string") {
      return (
        <p className="text-xs sm:text-[13px] font-medium text-slate-500">
          {breakdown}
        </p>
      );
    }

    return breakdown;
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-4 shadow-xs transition-all hover:shadow-sm ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Top row: Title and Trend Icon */}
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm sm:text-md font-medium text-slate-800">
          {title}
        </h4>
        <div className="flex items-center justify-center shrink-0">
          {renderTrendIcon()}
        </div>
      </div>

      {/* Middle: Primary Value + Unit */}
      <div className="mt-3.5 sm:mt-7 flex items-baseline gap-1.5">
        <span className="text-md sm:text-lg font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {unit && (
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {unit}
          </span>
        )}
      </div>

      {/* Bottom: Breakdown / Subtitle */}
      {breakdown && <div className="mt-0 sm:mt-0">{renderBreakdown()}</div>}
    </div>
  );
}

