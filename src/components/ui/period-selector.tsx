"use client";

import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PeriodItem {
  id: string;
  label?: string;
  subLabel?: string;
  name?: string;
  dateRange?: string;
  numberString?: string;
}

export interface PeriodSelectorProps<T extends PeriodItem> {
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  scrollOffset?: number;
  getItemLabel?: (item: T) => React.ReactNode;
  getItemSubLabel?: (item: T) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  inactiveItemClassName?: string;
  minItemWidth?: string;
}

export function PeriodSelector<T extends PeriodItem>({
  items,
  selectedId,
  onSelect,
  scrollOffset = 260,
  getItemLabel,
  getItemSubLabel,
  className,
  itemClassName,
  activeItemClassName = "bg-[#1d4ed8] border-[#1d4ed8] text-white shadow-xs font-semibold",
  inactiveItemClassName = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300",
  minItemWidth,
}: PeriodSelectorProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll active item into view on selection change
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(
        `[data-active="true"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedId]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -scrollOffset : scrollOffset;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const resolveLabel = (item: T): React.ReactNode => {
    if (getItemLabel) return getItemLabel(item);
    return item.label ?? item.name ?? item.id;
  };

  const resolveSubLabel = (item: T): React.ReactNode => {
    if (getItemSubLabel) return getItemSubLabel(item);
    return item.subLabel ?? item.dateRange ?? item.numberString ?? null;
  };

  return (
    <div className={cn("flex items-center gap-2 w-full pt-3", className)}>
      {/* Left Scroll Button */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        aria-label="Scroll left"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer focus:outline-none"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 flex-1 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => {
          const isActive = item.id === selectedId;
          const label = resolveLabel(item);
          const subLabel = resolveSubLabel(item);

          return (
            <button
              key={item.id}
              type="button"
              data-active={isActive ? "true" : "false"}
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-1 rounded-lg border text-center transition-all cursor-pointer shrink-0",
                minItemWidth || "min-w-[80px]",
                isActive ? activeItemClassName : inactiveItemClassName,
                itemClassName
              )}
            >
              <span className="text-xs font-semibold leading-tight">
                {label}
              </span>
              {subLabel && (
                <span
                  className={cn(
                    "text-[10px] leading-tight mt-0.5 whitespace-nowrap",
                    isActive ? "text-blue-100" : "text-slate-400"
                  )}
                >
                  {subLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        aria-label="Scroll right"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer focus:outline-none"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default PeriodSelector;

