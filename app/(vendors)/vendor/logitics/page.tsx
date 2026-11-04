import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendorLogisticsTable } from "@/components/ui/vendor/vendor-logistics-table";

export default function VendorLogisticsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-5 bg-muted/20 px-4 py-7 sm:px-7 lg:px-10">
      <header className="flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Store management / Inventory
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Logistics</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Monitor product availability and spot items that need a restock.
          </p>
        </div>
        <Button render={<Link href="/vendor/products" />}>
          Manage products <ArrowRight className="ml-2 size-4" />
        </Button>
      </header>

      <VendorLogisticsTable />
    </main>
  );
}
