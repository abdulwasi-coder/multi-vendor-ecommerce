"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Download, MapPin, Package, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orders = [
  {
    id: "ORD-2084",
    shippingAddress: {
      name: "Olivia Rhye",
      street: "14 Market Street",
      city: "San Francisco, CA 94103",
      country: "United States",
    },
    items: [
      { name: "Everyday Tote Bag", sku: "BAG-ET-01", quantity: 2, price: 32, subtotal: 64 },
      { name: "Leather Keychain", sku: "ACC-LK-04", quantity: 1, price: 12, subtotal: 12 },
    ],
    suborderTotal: 76,
    vendorNetEarned: 68.4,
    status: "Processing",
    createdAt: "Oct 07, 2026",
    payoutReleaseDate: "Oct 14, 2026",
  },
  {
    id: "ORD-2083",
    shippingAddress: {
      name: "Phoenix Baker",
      street: "220 Pine Avenue, Apt 5",
      city: "Portland, OR 97204",
      country: "United States",
    },
    items: [
      { name: "Ceramic Pour-over Set", sku: "KIT-CP-02", quantity: 1, price: 126.5, subtotal: 126.5 },
    ],
    suborderTotal: 126.5,
    vendorNetEarned: 113.85,
    status: "Shipped",
    createdAt: "Oct 06, 2026",
    payoutReleaseDate: "Oct 13, 2026",
  },
  {
    id: "ORD-2082",
    shippingAddress: {
      name: "Lana Steiner",
      street: "8 Willow Lane",
      city: "Austin, TX 78701",
      country: "United States",
    },
    items: [
      { name: "Linen Table Runner", sku: "HOME-LR-08", quantity: 1, price: 58, subtotal: 58 },
    ],
    suborderTotal: 58,
    vendorNetEarned: 52.2,
    status: "Delivered",
    createdAt: "Oct 06, 2026",
    payoutReleaseDate: "Oct 13, 2026",
  },
  {
    id: "ORD-2081",
    shippingAddress: {
      name: "Demi Wilkinson",
      street: "51 Lakeview Drive",
      city: "Chicago, IL 60611",
      country: "United States",
    },
    items: [
      { name: "Handmade Candle Trio", sku: "HOME-CT-03", quantity: 1, price: 42, subtotal: 42 },
    ],
    suborderTotal: 42,
    vendorNetEarned: 37.8,
    status: "Processing",
    createdAt: "Oct 05, 2026",
    payoutReleaseDate: "Oct 12, 2026",
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusStyles = {
  Processing: "border-amber-200 bg-amber-50 text-amber-700",
  Shipped: "border-blue-200 bg-blue-50 text-blue-700",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function VendorOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeOption, setPageSizeOption] = useState("3");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const searchableText = [
        order.id,
        order.status,
        order.shippingAddress.name,
        order.shippingAddress.street,
        order.shippingAddress.city,
        order.shippingAddress.country,
        ...order.items.flatMap((item) => [item.name, item.sku]),
      ].join(" ").toLowerCase();
      return matchesStatus && (!query || searchableText.includes(query));
    });
  }, [search, statusFilter]);

  const pageSize = pageSizeOption === "all" ? Math.max(1, filteredOrders.length) : Number(pageSizeOption);
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const visibleOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function updateStatus(value) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function updatePageSize(value) {
    setPageSizeOption(value);
    setCurrentPage(1);
  }

  function exportOrders() {
    const headers = [
      "Order ID", "Shipping name", "Shipping street", "Shipping city", "Shipping country",
      "Item name", "SKU", "Quantity", "Price", "Item subtotal", "Suborder total",
      "Vendor net earned", "Status", "Created at", "Payout release date",
    ];
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = filteredOrders.flatMap((order) =>
      order.items.map((item) => [
        order.id,
        order.shippingAddress.name,
        order.shippingAddress.street,
        order.shippingAddress.city,
        order.shippingAddress.country,
        item.name,
        item.sku,
        item.quantity,
        item.price,
        item.subtotal,
        order.suborderTotal,
        order.vendorNetEarned,
        order.status,
        order.createdAt,
        order.payoutReleaseDate,
      ].map(escapeCsv).join(",")),
    );
    const csv = [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen w-full bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-400 space-y-6">
        <header className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Store management</p>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Review order items, delivery details, and your earnings.
          </p>
        </header>

        <section aria-label="Orders">
          <Card className="overflow-hidden rounded-xl border-border/70 shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle>All orders</CardTitle>
                <CardDescription>
                  Search by order ID, item, SKU, or shipping address.
                </CardDescription>
              </div>
              <p className="text-sm text-muted-foreground">
                {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}
              </p>
            </CardHeader>

            <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search orders..."
                aria-label="Search orders"
                className="pl-9"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={statusFilter} onValueChange={updateStatus}>
                <SelectTrigger aria-label="Filter orders by status" className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pageSizeOption} onValueChange={updatePageSize}>
                <SelectTrigger aria-label="Choose how many orders to show" className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Show 3</SelectItem>
                  <SelectItem value="5">Show 5</SelectItem>
                  <SelectItem value="10">Show 10</SelectItem>
                  <SelectItem value="all">Show all</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportOrders}>
                <Download /> Export
              </Button>
            </div>
            </div>

            <CardContent className="space-y-3 px-4 pb-0 sm:px-6">
              {visibleOrders.map((order) => (
                <article key={order.id} className="space-y-4 rounded-lg border bg-background p-4 2xl:hidden">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">#{order.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Created {order.createdAt}</p>
                    </div>
                    <Badge variant="outline" className={statusStyles[order.status]}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex gap-2.5">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-medium">{order.shippingAddress.name}</p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.sku} className="flex gap-2.5">
                          <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs leading-5 text-muted-foreground">
                              SKU {item.sku} · Qty {item.quantity} · {currency.format(item.price)} each
                            </p>
                            <p className="text-xs text-muted-foreground">Subtotal {currency.format(item.subtotal)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-t pt-3 text-sm sm:grid-cols-4">
                    <div><p className="text-xs text-muted-foreground">Suborder total</p><p className="mt-1 font-medium">{currency.format(order.suborderTotal)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Net earned</p><p className="mt-1 font-medium text-emerald-700">{currency.format(order.vendorNetEarned)}</p></div>
                    <div><p className="text-xs text-muted-foreground">Payout release</p><p className="mt-1">{order.payoutReleaseDate}</p></div>
                  </div>
                </article>
              ))}
              {visibleOrders.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground 2xl:hidden">
                  No orders match your search.
                </div>
              )}
            </CardContent>

            <div className="hidden w-full min-w-0 border-y border-border/70 2xl:block">
            <Table className="min-w-[1180px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="h-11 pl-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</TableHead>
                  <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipping address</TableHead>
                  <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Items</TableHead>
                  <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suborder total</TableHead>
                  <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Net earned</TableHead>
                  <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Created</TableHead>
                  <TableHead className="h-11 pr-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payout release</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOrders.map((order) => (
                  <TableRow key={order.id} className="align-top hover:bg-muted/30">
                    <TableCell className="pl-4 pt-5 font-medium">#{order.id}</TableCell>
                    <TableCell className="min-w-56 whitespace-normal">
                      <div className="flex gap-2.5 py-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="space-y-0.5">
                          <p className="font-medium">{order.shippingAddress.name}</p>
                          <p className="text-xs leading-5 text-muted-foreground">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-64 whitespace-normal">
                      <div className="space-y-3 py-2">
                        {order.items.map((item) => (
                          <div key={item.sku} className="flex gap-2.5">
                            <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 space-y-0.5">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                SKU {item.sku} · Qty {item.quantity} · {currency.format(item.price)} each
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Subtotal {currency.format(item.subtotal)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {currency.format(order.suborderTotal)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-700">
                      {currency.format(order.vendorNetEarned)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[order.status]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-3.5" /> {order.createdAt}
                      </span>
                    </TableCell>
                    <TableCell className="pr-4">
                      <span className="text-sm text-muted-foreground">
                        {order.payoutReleaseDate}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {visibleOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No orders match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>

          <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {filteredOrders.length === 0
                ? "No orders found"
                : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredOrders.length)} of ${filteredOrders.length} orders`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft /> Previous
              </Button>
              <span className="min-w-16 text-center text-sm text-muted-foreground">
                Page {currentPage} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                disabled={currentPage >= pageCount}
              >
                Next <ChevronRight />
              </Button>
            </div>
          </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
