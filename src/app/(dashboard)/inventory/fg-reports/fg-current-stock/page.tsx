import Breadcrumb from "@/components/ui/breadcrumb"

export default function FgCurrentStockPage() {
  return (
    <>
      <div>
        <Breadcrumb
          title="Warehouse FG"
          items={[
            { label: "Warehouse FG", href: "/inventory/fg-reports/fg-current-stock" },
            { label: "FG Report", href: "/inventory/fg-reports/fg-current-stock" },
            { label: "FG Current Stock", href: "/inventory/fg-reports/fg-current-stock" },
          ]}
        />
      </div>
    </>
  )
}

