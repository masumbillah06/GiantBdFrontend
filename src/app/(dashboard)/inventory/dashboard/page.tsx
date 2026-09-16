"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { ChartBarDefault } from "@/features/dashboard/components/bar-chart";
import { ChartPieDonut } from "@/features/dashboard/components/donut-chart";
import { ChartLineMultiple } from "@/features/dashboard/components/line-chart";
import { ChartPieSimple } from "@/features/dashboard/components/pie-chart";
import StatCard from "@/features/dashboard/components/stat-card";
import ReusableTable from "@/components/ui/table/ReusableTable";
import {
  stockInData,
  stockInColumns,
  requisitionData,
  requisitionColumns,
  renderRequisitionActions,
} from "@/lib/mock-data/dashboard/dashboard.mock";
import type { StockInRow, RequisitionRow } from "@/features/dashboard/types/dashboard.types";

export default function Dashboard() {
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
        <StatCard title="Daily In" value="0" unit="Pairs" breakdown="0 Bat | 0 Mas | 0 Var" trend="up" />
        <StatCard title="Weekly In" value="30" unit="Pairs" breakdown="1 Bat | 1 Mas | 2 Var" trend="up" />
        <StatCard title="Monthly In" value="148,016" unit="Pairs" breakdown="5 Bat | 3 Mas | 28 Var" trend="up" />
        <StatCard title="Yearly In" value="21,795,941" unit="Pairs" breakdown="41 Bat | 12 Mas | 271 Var" trend="up" />
        <StatCard title="Total In" value="21,795,941" unit="Pairs" breakdown="41 Bat | 12 Mas | 271 Var" trend="up" />
        <StatCard title="Daily Out" value="0" unit="Pairs" breakdown="0 Bat | 0 Mas | 0 Var" trend="down" />
        <StatCard title="Weekly Out" value="519" unit="Pairs" breakdown="3 Bat | 2 Mas | 4 Var" trend="down" />
        <StatCard title="Monthly Out" value="735" unit="Pairs" breakdown="4 Bat | 3 Mas | 12 Var" trend="down" />
        <StatCard title="Yearly Out" value="147,126" unit="Pairs" breakdown="27 Bat | 11 Mas | 92 Var" trend="down" />
        <StatCard title="Total Out" value="147,126" unit="Pairs" breakdown="27 Bat | 11 Mas | 92 Var" trend="down" />
      </div>
      {/* Main Inventory Trends Chart */}
      <div className="mt-4 h-[340px] w-full">
        <ChartLineMultiple />
      </div>

      {/* Inventory Breakdown Charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:h-[280px]">
        <div className="h-[280px] lg:h-full w-full">
          <ChartBarDefault />
        </div>
        <div className="h-[280px] lg:h-full w-full">
          <ChartPieDonut />
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
            <button
              type="button"
              className="rounded-md bg-indigo-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              + New
            </button>
          </div>

          <ReusableTable<StockInRow>
            data={stockInData}
            columns={stockInColumns}
            showCheckbox={false}
            showId={true}
            idLabel="ID"
            showActions={false}
            minWidth="1100px"
          />
        </div>

        {/* Requisition For Shipment */}
        <div className="rounded-xl bg-[var(--color-bg)] overflow-hidden mt-4">
          <div className="flex items-center justify-between py-4">
            <div className="bg-white h-7 w-auto px-3 flex items-center justify-center rounded-md shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Requsition For Shipment</h2>
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
          />
        </div>
      </div>
    </>
  );
}