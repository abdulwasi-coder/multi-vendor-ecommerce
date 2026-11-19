import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VendorLogisticsTable } from "@/components/ui/vendor/vendor-logistics-table";

export default function VendorLogisticsPage() {
  return (
    <main className="vendor-dashboard-surface mx-auto min-h-screen w-full max-w-400 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Logistics</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Monitor product availability and spot items that need a restock.
          </p>
        </div>
        <Button className="bg-sky-400 text-slate-950 hover:bg-sky-300" render={<Link href="/vendor/products" />} nativeButton={false}>
          Manage products <ArrowRight className="ml-2 size-4" />
        </Button>
      </header>

      <VendorLogisticsTable />
    </main>
  );
}
