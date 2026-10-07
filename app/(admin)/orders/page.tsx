"use client";

import { useState } from "react";
import {
  BadgeDollarSign,
  CircleDollarSign,
  ClipboardList,
  Store,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  CircleHelp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MockOrder = {
  id: string;
  vendor: string;
  date: string;
  status: "Paid" | "Processing" | "Completed" | "Refunded";
  vendorEarning: number;
  platformEarning: number;
};

// MOCK DATA: temporary examples for previewing the Admin Orders page UI.
// Replace this array and its derived stats with the real admin API response when available.
const mockVendorNames = [
  "Northstar Goods",
  "Juniper & Co.",
  "Fieldwork Supply",
  "Cedar House",
  "Sunday Market",
  "Common Ground",
  "Studio Wren",
  "Morrow Home",
];
const mockStatuses: MockOrder["status"][] = [
  "Completed",
  "Paid",
  "Processing",
  "Completed",
  "Paid",
];
const mockOrders: MockOrder[] = Array.from({ length: 60 }, (_, index) => {
  const vendorEarning = 84 + ((index * 73) % 640);
  const platformEarning = Math.round(vendorEarning * 0.12 * 100) / 100;
  const day = String(28 - (index % 28)).padStart(2, "0");

  return {
    id: `ORD-2025-${String(10482 + index).padStart(5, "0")}`,
    vendor: mockVendorNames[index % mockVendorNames.length],
    date: `2025-09-${day}`,
    status: mockStatuses[index % mockStatuses.length],
    vendorEarning,
    platformEarning,
  };
});

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const totalVendorEarnings = mockOrders.reduce(
  (total, order) => total + order.vendorEarning,
  0,
);
const totalPlatformEarnings = mockOrders.reduce(
  (total, order) => total + order.platformEarning,
  0,
);
const paidVendors = new Set(
  mockOrders.filter((order) => order.status === "Paid").map((order) => order.vendor),
).size;

const stats = [
  {
    title: "Paid vendors",
    value: paidVendors.toLocaleString(),
    description: "Vendors with paid orders",
    icon: Store,
    hoverTone: "hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-emerald-500/10 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/25",
    iconTone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    title: "Average net earning",
    value: currency.format(totalVendorEarnings / mockOrders.length),
    description: "Average vendor share per order",
    icon: TrendingUp,
    hoverTone: "hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-sky-500/10 dark:hover:border-sky-800 dark:hover:bg-sky-950/25",
    iconTone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  {
    title: "Total earnings",
    value: currency.format(totalVendorEarnings + totalPlatformEarnings),
    description: "Vendor and platform earnings",
    icon: CircleDollarSign,
    hoverTone: "hover:border-violet-300 hover:bg-violet-50/70 hover:shadow-violet-500/10 dark:hover:border-violet-800 dark:hover:bg-violet-950/25",
    iconTone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  {
    title: "Orders processed",
    value: mockOrders.length.toLocaleString(),
    description: "Orders in this preview",
    icon: ClipboardList,
    hoverTone: "hover:border-amber-300 hover:bg-amber-50/70 hover:shadow-amber-500/10 dark:hover:border-amber-800 dark:hover:bg-amber-950/25",
    iconTone: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  {
    title: "Total orders",
    value: mockOrders.length.toLocaleString(),
    description: "All orders in this preview",
    icon: BadgeDollarSign,
    hoverTone: "hover:border-rose-300 hover:bg-rose-50/70 hover:shadow-rose-500/10 dark:hover:border-rose-800 dark:hover:bg-rose-950/25",
    iconTone: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
];

function statusStyle(status: MockOrder["status"]) {
  switch (status) {
    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Paid":
      return "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300";
    case "Processing":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
    case "Refunded":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300";
  }
}

export default function AdminOrdersPage() {
  const pageSize = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mockOrders.length / pageSize);
  const firstItem = (currentPage - 1) * pageSize;
  const visibleOrders = mockOrders.slice(firstItem, firstItem + pageSize);
  const lastItem = Math.min(firstItem + pageSize, mockOrders.length);

  return (
    <main className="min-h-screen w-full bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">Marketplace operations</p>
            <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
            <p className="text-sm text-muted-foreground">
              Review order activity and vendor earnings across the marketplace.
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-8 w-fit gap-1.5 border-indigo-200 bg-indigo-50 px-3 font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <CircleHelp className="size-3.5" /> Mock preview
          </Badge>
        </header>

        <section
          aria-label="Orders overview"
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
        >
          {stats.map(({ title, value, description, icon: Icon, hoverTone, iconTone }) => (
            <Card
              key={title}
              className={`group relative h-full min-h-[184px] gap-4 rounded-2xl border-border/70 bg-card py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${hoverTone}`}
            >
              <CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 pb-1">
                <CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">
                  {title}
                </CardTitle>
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 ease-out group-hover:scale-110 ${iconTone}`}>
                  <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.25} />
                </span>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-2">
                <div className="flex min-h-10 items-center text-3xl font-bold leading-tight tracking-tight text-foreground tabular-nums sm:text-[2rem]">
                  {value}
                </div>
                <p className="flex min-h-10 items-center text-sm font-medium leading-snug text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="gap-0 overflow-hidden border-border/70 bg-card shadow-sm shadow-slate-900/[0.035]">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Order earnings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Vendor and platform earnings by order.
              </p>
            </div>
            <Badge variant="secondary" className="w-fit">
              {mockOrders.length} sample orders
            </Badge>
          </div>
          <Separator />
          <div className="space-y-3 px-4 pb-4 xl:hidden">
            {visibleOrders.map((order) => <article key={order.id} className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-indigo-300/70 hover:bg-indigo-50/30 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/15">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-semibold">{order.vendor}</h3><p className="mt-0.5 font-mono text-xs text-muted-foreground">{order.id}</p></div><Badge variant="outline" className={statusStyle(order.status)}>{order.status}</Badge></div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3 text-sm"><div><p className="text-xs text-muted-foreground">Date</p><p>{new Date(`${order.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></div><div><p className="text-xs text-muted-foreground">Vendor earning</p><p className="font-semibold tabular-nums">{currency.format(order.vendorEarning)}</p></div><div><p className="text-xs text-muted-foreground">Platform earning</p><p className="text-muted-foreground tabular-nums">{currency.format(order.platformEarning)}</p></div></div>
            </article>)}
          </div>
          <div className="hidden w-full overflow-x-auto xl:block">
            <Table className="min-w-[760px]">
              <TableHeader className="bg-muted/35">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Vendor</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Vendor earning</TableHead>
                  <TableHead className="pr-5 text-right">Platform earning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOrders.map((order) => (
                  <TableRow key={order.id} className="group transition-colors duration-150 hover:bg-muted/60">
                    <TableCell className="py-4 pl-5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-semibold text-indigo-700 transition-all duration-200 group-hover:scale-105 group-hover:ring-4 group-hover:ring-indigo-500/10 dark:text-indigo-300">
                          {order.vendor
                            .split(/\s|&/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </span>
                        <span className="font-medium">{order.vendor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(`${order.date}T12:00:00`).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyle(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {currency.format(order.vendorEarning)}
                    </TableCell>
                    <TableCell className="pr-5 text-right font-medium tabular-nums text-muted-foreground">
                      {currency.format(order.platformEarning)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Separator />
          <footer className="flex flex-col gap-3 px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span className="font-medium">Showing {firstItem + 1}–{lastItem} of {mockOrders.length} sample orders</span>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                aria-label="Previous page"
              >
                <ArrowLeft /> Previous
              </Button>
              <span aria-live="polite" className="min-w-20 px-1 text-center text-xs font-medium text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                aria-label="Next page"
              >
                Next <ArrowRight />
              </Button>
            </div>
          </footer>
        </Card>
      </div>
    </main>
  );
}
