import Breadcrumb from "@/components/ui/breadcrumb";
import BasicInfo from "@/features/inventory/components/stock-in/basic-info";
import Documents from "@/features/inventory/components/stock-in/documents";
import Remarks from "@/features/inventory/components/stock-in/remarks";
import StockInActions from "@/features/inventory/components/stock-in/stock-in-actions";
import StockInProvider from "@/features/inventory/components/stock-in/stock-in-context";

export default function StockInPage() {
  return (
    <>
      <div>
        <Breadcrumb
          title="Warehouse FG"
          items={[
            { label: "Warehouse FG", href: "/inventory/stock-in" },
            { label: "Stock In", href: "/inventory/stock-in" },
          ]}
        />
      </div>
      <StockInProvider>
        <div className="mt-5 space-y-5 pb-8">
          <BasicInfo />
          <Documents />
          <Remarks />
          <StockInActions />
        </div>
      </StockInProvider>
    </>
  );
}