import Breadcrumb from "@/components/ui/breadcrumb"

export default function FgMasterStockPage() {
  return (
    <>
      <div>
        <Breadcrumb
          title="Warehouse FG"
          items={[
            { label: "Warehouse FG", href: "/inventory/fg-reports/fg-master-stock" },
            { label: "FG Report", href: "/inventory/fg-reports/fg-master-stock" },
            { label: "FG Master Stock", href: "/inventory/fg-reports/fg-master-stock" },
          ]}
        />
      </div>
    </>
  )
}

