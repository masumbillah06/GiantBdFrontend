import Breadcrumb from "@/components/ui/breadcrumb"

export default function LocationWiseStockPage() {
  return (
    <>
      <div>
        <Breadcrumb
          title="Warehouse FG"
          items={[
            { label: "Warehouse FG", href: "/inventory/fg-reports/location-wise-stock" },
            { label: "FG Report", href: "/inventory/fg-reports/location-wise-stock" },
            { label: "Location Wise Stock", href: "/inventory/fg-reports/location-wise-stock" },
          ]}
        />
      </div>
    </>
  )
}

