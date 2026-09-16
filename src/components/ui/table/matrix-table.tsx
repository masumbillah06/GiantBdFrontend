"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface MatrixPeriodColumn {
  id: string;
  label: string;
  subLabel?: string;
  minWidth?: string;
}

export interface MatrixTableProps<T> {
  columns: MatrixPeriodColumn[];
  items: T[];
  getGroupKey: (item: T) => string;
  getSubGroupKey: (item: T) => string;
  getPrimaryLabel: (item: T) => string;
  getSecondaryLabel: (item: T) => string;
  getColorLabel: (item: T) => string;
  getQuantities: (item: T) => Record<string, number>;
  getItemId?: (item: T, index: number) => string | number;
  primaryHeader?: string;
  secondaryHeader?: string;
  totalPosition?: "start" | "end";
  minWidth?: string;
  emptyMessage?: string;
  className?: string;
}

export function MatrixTable<T>({
  columns,
  items,
  getGroupKey,
  getSubGroupKey,
  getPrimaryLabel,
  getSecondaryLabel,
  getColorLabel,
  getQuantities,
  getItemId,
  primaryHeader = "Buyer",
  secondaryHeader = "Product",
  totalPosition = "end",
  minWidth = "1000px",
  emptyMessage = "No delivery records found for this period.",
  className,
}: MatrixTableProps<T>) {
  // Group items by outer group key (e.g. Material)
  const groupedData = useMemo(() => {
    const map: Record<string, T[]> = {};
    items.forEach((item) => {
      const gKey = getGroupKey(item);
      if (!map[gKey]) {
        map[gKey] = [];
      }
      map[gKey].push(item);
    });
    return map;
  }, [items, getGroupKey]);

  // Grand totals across all items
  const grandTotals = useMemo(() => {
    const periodTotals: Record<string, number> = {};
    columns.forEach((col) => {
      periodTotals[col.id] = 0;
    });

    items.forEach((item) => {
      const q = getQuantities(item);
      columns.forEach((col) => {
        periodTotals[col.id] += q[col.id] || 0;
      });
    });

    const sum = Object.values(periodTotals).reduce((a, b) => a + b, 0);
    return { periods: periodTotals, sum };
  }, [items, columns, getQuantities]);

  const groupKeys = Object.keys(groupedData);
  const totalColSpan = columns.length + 4;

  const renderTotalHeader = () => (
    <th className="px-4 py-3.5 text-center font-bold text-slate-900 w-28 text-xs sm:text-sm">
      Total
    </th>
  );

  const renderPeriodHeaders = () =>
    columns.map((col) => (
      <th
        key={col.id}
        className={cn(
          "px-3 py-2.5 text-center font-bold text-slate-800 text-xs",
          col.minWidth || "min-w-[42px]"
        )}
      >
        {col.subLabel && (
          <div className="text-xs text-slate-700 font-semibold">{col.subLabel}</div>
        )}
        <div className={cn("text-xs text-slate-900 font-bold", col.subLabel ? "mt-0.5" : "")}>
          {col.label}
        </div>
      </th>
    ));

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-xs",
        className
      )}
    >
      <table
        className="w-full border-collapse text-left text-xs sm:text-sm"
        style={{ minWidth }}
      >
        <thead>
          <tr className="border-b border-slate-200 bg-white">
            <th className="px-5 py-3.5 font-bold text-slate-800 text-xs sm:text-sm w-44">
              {primaryHeader}
            </th>
            <th className="px-5 py-3.5 font-bold text-slate-800 text-xs sm:text-sm w-44">
              {secondaryHeader}
            </th>
            <th className="px-5 py-3.5 font-bold text-slate-800 text-xs sm:text-sm w-36">
              Color
            </th>

            {totalPosition === "start" && renderTotalHeader()}
            {renderPeriodHeaders()}
            {totalPosition === "end" && renderTotalHeader()}
          </tr>
        </thead>

        <tbody>
          {groupKeys.length === 0 ? (
            <tr>
              <td
                colSpan={totalColSpan}
                className="px-6 py-12 text-center text-sm text-slate-400 font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            groupKeys.map((groupKey) => {
              const groupItems = groupedData[groupKey];

              // Group within this group by subGroupKey (e.g. Buyer / Factory)
              const subGroupMap: Record<string, T[]> = {};
              groupItems.forEach((item) => {
                const sKey = getSubGroupKey(item);
                if (!subGroupMap[sKey]) {
                  subGroupMap[sKey] = [];
                }
                subGroupMap[sKey].push(item);
              });

              // Group subtotal sums
              const groupPeriodTotals: Record<string, number> = {};
              columns.forEach((c) => {
                groupPeriodTotals[c.id] = 0;
              });
              groupItems.forEach((item) => {
                const q = getQuantities(item);
                columns.forEach((c) => {
                  groupPeriodTotals[c.id] += q[c.id] || 0;
                });
              });
              const groupSum = Object.values(groupPeriodTotals).reduce((a, b) => a + b, 0);

              return (
                <React.Fragment key={groupKey}>
                  {/* Group Header Row */}
                  <tr className="border-t border-slate-100 bg-white">
                    <td
                      colSpan={totalColSpan}
                      className="px-5 py-3 font-bold text-slate-900 text-sm"
                    >
                      {groupKey}
                    </td>
                  </tr>

                  {/* SubGroups */}
                  {Object.keys(subGroupMap).map((subKey) => {
                    const subItems = subGroupMap[subKey];

                    // Subgroup period totals
                    const subPeriodTotals: Record<string, number> = {};
                    columns.forEach((c) => {
                      subPeriodTotals[c.id] = 0;
                    });
                    subItems.forEach((item) => {
                      const q = getQuantities(item);
                      columns.forEach((c) => {
                        subPeriodTotals[c.id] += q[c.id] || 0;
                      });
                    });
                    const subSum = Object.values(subPeriodTotals).reduce((a, b) => a + b, 0);

                    return (
                      <React.Fragment key={subKey}>
                        {/* Data rows */}
                        {subItems.map((item, idx) => {
                          const id = getItemId ? getItemId(item, idx) : idx;
                          const q = getQuantities(item);
                          const itemTotal = columns.reduce(
                            (acc, c) => acc + (q[c.id] || 0),
                            0
                          );

                          const renderTotalCell = () => (
                            <td className="px-4 py-2.5 text-center font-bold text-slate-900 text-xs sm:text-sm">
                              {itemTotal > 0 ? itemTotal : "—"}
                            </td>
                          );

                          const renderPeriodCells = () =>
                            columns.map((c) => {
                              const val = q[c.id];
                              return (
                                <td
                                  key={c.id}
                                  className="px-3 py-2.5 text-center text-xs sm:text-sm text-slate-800"
                                >
                                  {val !== undefined && val > 0 ? (
                                    <span className="font-medium text-slate-900">
                                      {val}
                                    </span>
                                  ) : (
                                    <span className="text-slate-300 font-normal">
                                      —
                                    </span>
                                  )}
                                </td>
                              );
                            });

                          return (
                            <tr
                              key={String(id)}
                              className="border-b border-slate-100 bg-white hover:bg-slate-50/60 transition-colors"
                            >
                              <td className="px-5 py-2.5 text-xs sm:text-sm text-slate-800">
                                {getPrimaryLabel(item)}
                              </td>
                              <td className="px-5 py-2.5 text-xs sm:text-sm text-slate-800">
                                {getSecondaryLabel(item)}
                              </td>
                              <td className="px-5 py-2.5 text-xs sm:text-sm text-slate-600">
                                {getColorLabel(item)}
                              </td>

                              {totalPosition === "start" && renderTotalCell()}
                              {renderPeriodCells()}
                              {totalPosition === "end" && renderTotalCell()}
                            </tr>
                          );
                        })}

                        {/* SubGroup Subtotal Row */}
                        <tr className="border-b border-slate-100 bg-[#fffbeb]/70 border-l-4 border-l-amber-400">
                          <td className="px-5 py-2.5 font-bold text-amber-900 text-xs sm:text-sm">
                            {subKey} Total
                          </td>
                          <td className="px-5 py-2.5" />
                          <td className="px-5 py-2.5" />

                          {totalPosition === "start" && (
                            <td className="px-4 py-2.5 text-center font-bold text-amber-900 text-xs sm:text-sm">
                              {subSum > 0 ? subSum : "—"}
                            </td>
                          )}

                          {columns.map((c) => {
                            const val = subPeriodTotals[c.id];
                            return (
                              <td
                                key={c.id}
                                className="px-3 py-2.5 text-center font-semibold text-amber-900 text-xs sm:text-sm"
                              >
                                {val > 0 ? val : "—"}
                              </td>
                            );
                          })}

                          {totalPosition === "end" && (
                            <td className="px-4 py-2.5 text-center font-bold text-amber-900 text-xs sm:text-sm">
                              {subSum > 0 ? subSum : "—"}
                            </td>
                          )}
                        </tr>
                      </React.Fragment>
                    );
                  })}

                  {/* Outer Group Subtotal Row */}
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold">
                    <td className="px-5 py-3 font-bold text-slate-900 text-xs sm:text-sm">
                      {groupKey} Total
                    </td>
                    <td className="px-5 py-3" />
                    <td className="px-5 py-3" />

                    {totalPosition === "start" && (
                      <td className="px-4 py-3 text-center font-bold text-slate-900 text-xs sm:text-sm">
                        {groupSum > 0 ? groupSum : "—"}
                      </td>
                    )}

                    {columns.map((c) => {
                      const val = groupPeriodTotals[c.id];
                      return (
                        <td
                          key={c.id}
                          className="px-3 py-3 text-center font-bold text-slate-900 text-xs sm:text-sm"
                        >
                          {val > 0 ? val : "—"}
                        </td>
                      );
                    })}

                    {totalPosition === "end" && (
                      <td className="px-4 py-3 text-center font-bold text-slate-900 text-xs sm:text-sm">
                        {groupSum > 0 ? groupSum : "—"}
                      </td>
                    )}
                  </tr>
                </React.Fragment>
              );
            })
          )}
        </tbody>

        {/* Grand Total Footer */}
        {groupKeys.length > 0 && (
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-[#f8fafc] font-bold">
              <td className="px-5 py-4 font-extrabold text-slate-900 text-sm">
                Grand Total
              </td>
              <td className="px-5 py-4" />
              <td className="px-5 py-4" />

              {totalPosition === "start" && (
                <td className="px-4 py-4 text-center font-extrabold text-blue-700 text-sm">
                  {grandTotals.sum > 0 ? grandTotals.sum : "—"}
                </td>
              )}

              {columns.map((c) => {
                const val = grandTotals.periods[c.id];
                return (
                  <td
                    key={c.id}
                    className="px-3 py-4 text-center font-bold text-slate-900 text-xs sm:text-sm"
                  >
                    {val > 0 ? val : "—"}
                  </td>
                );
              })}

              {totalPosition === "end" && (
                <td className="px-4 py-4 text-center font-extrabold text-blue-700 text-sm">
                  {grandTotals.sum > 0 ? grandTotals.sum : "—"}
                </td>
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default MatrixTable;

