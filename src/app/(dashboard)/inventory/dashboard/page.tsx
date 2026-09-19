"use client";

import Link from "next/link";
import Breadcrumb from "@/components/ui/breadcrumb";
import { ChartBarDefault } from "@/features/dashboard/components/bar-chart";
import { ChartPieDonut } from "@/features/dashboard/components/donut-chart";
import { ChartLineMultiple } from "@/features/dashboard/components/line-chart";
import { ChartPieSimple } from "@/features/dashboard/components/pie-chart";
import StatCard from "@/features/dashboard/components/stat-card";
import ReusableTable from "@/components/ui/table/ReusableTable";
import {
  stockInColumns,
  requisitionColumns,
  renderRequisitionActions,
} from "@/lib/mock-data/dashboard/dashboard.mock";
import type { StockInRow, RequisitionRow } from "@/features/dashboard/types/dashboard.types";
import {
  useDashboardMetrics,
  useDashboardStockIn,
  useDashboardRequisitions,
} from "@/features/dashboard/hooks/use-dashboard-stats";

export default function Dashboard() {
  const { data: metrics, isLoading: isMetricsLoading } = useDashboardMetrics();
  const { data: stockInData = [], isLoading: isStockInLoading } = useDashboardStockIn();
  const { data: requisitionData = [], isLoading: isReqLoading } = useDashboardRequisitions();

  const kpi = metrics?.kpi;

  // Format movement trend items for the line chart
  const movementTrendData = metrics?.movementTrends?.map((m) => ({
    date: m.month,
    stockIn: m.stockIn,
    stockOut: m.stockOut,
  }));

  // Format PO distribution for donut chart
  const poDonutData = metrics?.poDistribution?.map((p) => ({
    name: p.name,
    value: p.count,
    fill: p.color,
  }));

  return (
    <>
      <div>
        <Breadcrumb
          title="Warehouse FG"
          items={[
            { label: "Warehouse FG", href: "/inventory/dashboard" },
            { label: "Dashboard", href: "/inventory/dashboard" },
          ]}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Stock"
          value={isMetricsLoading ? "..." : (kpi?.totalStockPairs ?? 0).toLocaleString()}
          unit="Pairs"
          breakdown="Current Available Stock"
          trend="up"
        />
        <StatCard
          title="Today In"
          value={isMetricsLoading ? "..." : String(kpi?.todayStockInBatches ?? 0)}
          unit="Batches"
          breakdown="Received Today"
          trend="up"
        />
        <StatCard
          title="Today Out"
          value={isMetricsLoading ? "..." : String(kpi?.todayStockOutChallans ?? 0)}
          unit="Challans"
          breakdown="Dispatched Today"
          trend="down"
        />
        <StatCard
          title="Active POs"
          value={isMetricsLoading ? "..." : String(kpi?.activePoCount ?? 0)}
          unit="POs"
          breakdown="Production in progress"
          trend="up"
        />
        <StatCard
          title="PO Fulfillment"
          value={isMetricsLoading ? "..." : `${kpi?.poFulfillmentRate ?? 100}%`}
          unit="Rate"
          breakdown="Completed vs Total"
          trend="up"
        />
      </div>
      {/* Main Inventory Trends Chart */}
      <div className="mt-4 h-[340px] w-full">
        <ChartLineMultiple data={movementTrendData} />
      </div>

      {/* Inventory Breakdown Charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:h-[280px]">
        <div className="h-[280px] lg:h-full w-full">
          <ChartBarDefault />
        </div>
        <div className="h-[280px] lg:h-full w-full">
          <ChartPieDonut title="PO Status Breakdown" data={poDonutData} />
        </div>
        <div className="h-[280px] lg:h-full w-full">
          <ChartPieSimple />
        </div>
      </div>

      {/* Tables Section */}
      <div className="mt-4 bg-[var(--color-bg)]">
        {/* Recent FG Stock In */}
        <div className="rounded-xl bg-[var(--color-bg)] overflow-hidden">
          <div className="flex items-center justify-between py-4">
            <div className="bg-white h-7 w-auto px-3 flex items-center justify-center rounded-md shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Recent FG Stock In</h2>
            </div>
            <Link
              href="/inventory/stock-out"
              className="rounded-md bg-indigo-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              + Stock Out
            </Link>
          </div>

          <ReusableTable<StockInRow>
            data={stockInData}
            columns={stockInColumns}
            showCheckbox={false}
            showId={true}
            idLabel="ID"
            showActions={false}
            minWidth="1100px"
            isLoading={isStockInLoading}
          />
        </div>

        {/* Requisition For Shipment */}
        <div className="rounded-xl bg-[var(--color-bg)] overflow-hidden mt-4">
          <div className="flex items-center justify-between py-4">
            <div className="bg-white h-7 w-auto px-3 flex items-center justify-center rounded-md shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Requisitions / Dispatches</h2>
            </div>
          </div>

          <ReusableTable<RequisitionRow>
            data={requisitionData}
            columns={requisitionColumns}
            showCheckbox={false}
            showId={true}
            idLabel="ID"
            showActions={true}
            actionsLabel="Action"
            renderActions={renderRequisitionActions}
            minWidth="1200px"
            isLoading={isReqLoading}
          />
        </div>
      </div>
    </>
  );
}