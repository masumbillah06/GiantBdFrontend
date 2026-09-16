import Breadcrumb from "@/components/ui/breadcrumb"
import StockOut from "@/features/inventory/components/stock-out/stock-out";

export default function StockOutPage() {
  return (
    <>
      <div>
        <Breadcrumb
          title="Warehouse FG"
          items={[
            { label: "Warehouse FG", href: "/inventory/stock-out" },
            { label: "Stock Out", href: "/inventory/stock-out" },
          ]}
        />
      </div>
      <div className="mt-5 pb-8">
        <StockOut />
      </div>
    </>
  )
}