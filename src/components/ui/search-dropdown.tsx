"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";

export interface SearchItem {
  id: string;
  path: string[];
}

const DEFAULT_ITEMS: SearchItem[] = [
  { id: "stock-out", path: ["Warehouse FG", "Stock Out"] },
  { id: "stock-out-list", path: ["Warehouse FG", "Stock Out List"] },
  { id: "batch-list", path: ["Warehouse FG", "Batch List"] },
  { id: "weekly-delivery", path: ["Warehouse FG", "FG Report", "Weekly Delivery"] },
  { id: "monthly-delivery", path: ["Warehouse FG", "FG Report", "Monthly Delivery"] },
  { id: "delivery-summary", path: ["Warehouse FG", "FG Report", "Delivery Summary"] },
  { id: "stock-aging", path: ["Warehouse FG", "FG Report", "Stock Aging"] },
];

interface SearchDropdownProps {
  items?: SearchItem[];
  placeholder?: string;
  defaultSelectedId?: string;
  onSelect?: (item: SearchItem) => void;
}

export default function SearchDropdown({
  items = DEFAULT_ITEMS,
  placeholder = "Search...",
  defaultSelectedId,
  onSelect,
}: SearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(defaultSelectedId);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      item.path.join(" > ").toLowerCase().includes(q)
    );
  }, [items, query]);

  function handleSelect(item: SearchItem) {
    setSelectedId(item.id);
    onSelect?.(item);
    setOpen(false);
  }

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div ref={containerRef} className="w-full max-w-lg font-sans">
      {/* Top-level search field */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-full items-center gap-2 rounded-md border border-indigo-800 bg-white px-2 py-1 text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <span
          className={`flex-1 truncate text-xs ${
            selectedItem ? "text-gray-800" : "text-gray-700"
          }`}
        >
          {selectedItem ? selectedItem.path.join(" > ") : placeholder}
        </span>
        <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
      </button>

      {open && (
        <div className="relative mt-1.5">
          <div className="absolute z-10 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {/* Inner search box */}
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full text-[15px] text-gray-700 placeholder:text-gray-700 focus:outline-none"
              />
            </div>

            {/* Results list */}
            <ul className="max-h-72 overflow-y-auto py-1 pr-1">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-700">No results found</li>
              )}
              {filtered.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      className={`block w-full px-4 py-2 text-left text-xs leading-6 text-gray-700 transition-colors hover:bg-gray-50 ${
                        isSelected ? "bg-indigo-50" : ""
                      }`}
                    >
                      {item.path.map((segment, i) => (
                        <span key={i}>
                          {i > 0 && (
                            <span className="mx-1.5 text-gray-800">&gt;</span>
                          )}
                          <span className={i === 0 ? "text-gray-800" : ""}>
                            {segment}
                          </span>
                        </span>
                      ))}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

