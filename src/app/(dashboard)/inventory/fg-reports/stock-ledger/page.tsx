import Breadcrumb from "@/components/ui/breadcrumb"

export default function StockLedgerPage() {
  return (
    <>
      <div>
        <Breadcrumb
          title="Warehouse FG"
          items={[
            { label: "Warehouse FG", href: "/inventory/fg-reports/stock-ledger" },
            { label: "FG Report", href: "/inventory/fg-reports/stock-ledger" },
            { label: "Stock Ledger", href: "/inventory/fg-reports/stock-ledger" },
          ]}
        />
      </div>
    </>
  )
}

