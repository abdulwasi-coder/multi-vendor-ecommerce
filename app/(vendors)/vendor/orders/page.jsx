"use client";

import { useDeferredValue, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, ChevronLeft, ChevronRight, Download, MapPin, Package, Search } from "lucide-react";
import { toast } from "sonner";
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
import {
  useUpdateOrderStatus,
  useVendorOrders,
} from "@/Otherfiles/tanstack/vendor-orders";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusStyles = {
  Pending: "border-zinc-200 bg-zinc-50 text-zinc-600",
  Processing: "border-amber-200 bg-amber-50 text-amber-700",
  Shipped: "border-blue-200 bg-blue-50 text-blue-700",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];
const updatableStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function capitalizeStatus(status) {
  return typeof status === "string" && status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Pending";
}

function normalizeOrder(order) {
  const customerName =
    (typeof order.customerID === "object" ? order.customerID?.name : null) ??
    "Customer";
  const address = order.ParentorderID?.shippingAddress ?? {};
  return {
    id: order._id,
    customerName,
    shippingAddress: {
      name: customerName,
      street: address.address ?? "",
      city: [address.city, address.postalCode].filter(Boolean).join(" "),
      country: address.country ?? "",
      phone: address.phone ?? "",
    },
    items: (order.items ?? []).map((item, index) => ({
      key: `${order._id}-${index}`,
      name: item.productID?.name ?? "Product",
      sku: item.productID?.sku ?? "—",
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
      color: item.color || "",
    })),
    suborderTotal: order.subOrderTotal,
    vendorNetEarned: order.vendorNetEarned,
    status: capitalizeStatus(order.status),
    createdAt: formatDate(order.createdAt),
    payoutReleaseDate: formatDate(order.payoutReleaseDate),
  };
}

function StatusSelect({ orderId, status }) {
  const updateStatus = useUpdateOrderStatus();
  const normalized = status.toLowerCase();
  const canUpdate = updatableStatuses.includes(status) || status === "Pending";

  if (!canUpdate) {
    return (
      <Badge variant="outline" className={statusStyles[status] ?? ""}>
        {status}
      </Badge>
    );
  }

  return (
    <Select
      value={normalized}
      disabled={updateStatus.isPending}
      onValueChange={(value) => {
        if (!value || value === normalized) return;
        updateStatus.mutate(
          { id: orderId, status: value },
          {
            onSuccess: () => toast.success(`Order marked as ${capitalizeStatus(value)}.`),
            onError: (error) =>
              toast.error(
                error instanceof Error ? error.message : "Could not update status.",
              ),
          },
        );
      }}
    >
      <SelectTrigger
        aria-label={`Update status for order ${orderId}`}
        className={`h-8 w-32 text-xs font-medium ${statusStyles[status] ?? ""}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions
          .filter((option) => option !== "Pending" || status === "Pending")
          .map((option) => (
            <SelectItem key={option} value={option.toLowerCase()}>
              {option}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

export default function VendorOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeOption, setPageSizeOption] = useState("10");
  const deferredSearch = useDeferredValue(search.trim());
  const isSearching = deferredSearch.length > 0;

  const pageSize =
    pageSizeOption === "all" ? 50 : Math.max(1, Number(pageSizeOption) || 10);

  const { data, isPending, isError, error, refetch } = useVendorOrders(
    currentPage,
    pageSize,
    statusFilter,
    deferredSearch,
  );

  const orders = (data?.orders ?? []).map(normalizeOrder);
  const totalOrders = data?.totalOrders ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);
  const pageCount = isSearching ? 1 : totalPages;

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
      "Order ID", "Customer", "Shipping address", "Shipping city", "Shipping country", "Shipping phone",
      "Item name", "SKU", "Color", "Quantity", "Price", "Item subtotal", "Suborder total",
      "Vendor net earned", "Status", "Created at", "Payout release date",
    ];
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = orders.flatMap((order) =>
      order.items.map((item) => [
        order.id,
        order.shippingAddress.name,
        order.shippingAddress.street,
        order.shippingAddress.city,
        order.shippingAddress.country,
        order.shippingAddress.phone,
        item.name,
        item.sku,
        item.color,
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

  const showingFrom = orders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, (currentPage - 1) * pageSize + orders.length);

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
                  Search by order ID, or filter by status.
                </CardDescription>
              </div>
              <p className="text-sm text-muted-foreground">
                {totalOrders} {totalOrders === 1 ? "order" : "orders"}
              </p>
            </CardHeader>

            <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search by order ID..."
                aria-label="Search orders by ID"
                className="pl-9"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={statusFilter} onValueChange={updateStatus} disabled={isSearching}>
                <SelectTrigger aria-label="Filter orders by status" className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pageSizeOption} onValueChange={updatePageSize} disabled={isSearching}>
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
              <Button variant="outline" onClick={exportOrders} disabled={orders.length === 0}>
                <Download /> Export
              </Button>
            </div>
            </div>

            {isError && (
              <div className="mx-4 mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm sm:mx-6">
                <p className="text-destructive">
                  {error instanceof Error ? error.message : "Could not load orders."}
                </p>
                <button
                  type="button"
                  className="mt-2 text-sm font-medium text-[#007185] hover:underline"
                  onClick={() => void refetch()}
                >
                  Try again
                </button>
              </div>
            )}

            <CardContent className="space-y-3 px-4 pb-0 sm:px-6">
              {isPending && (
                <div className="space-y-3 py-2" aria-label="Loading orders">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-28 animate-pulse rounded-lg bg-muted/60" />
                  ))}
                </div>
              )}

              {!isPending && orders.map((order) => (
                <article key={order.id} className="space-y-4 rounded-lg border bg-background p-4 2xl:hidden">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-all font-mono text-xs font-semibold">#{order.id}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Created {order.createdAt}</p>
                    </div>
                    <StatusSelect orderId={order.id} status={order.status} />
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
                        <div key={item.key} className="flex gap-2.5">
                          <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs leading-5 text-muted-foreground">
                              SKU {item.sku} · Qty {item.quantity} · {currency.format(item.price)} each
                              {item.color ? ` · ${item.color}` : ""}
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
              {!isPending && orders.length === 0 && !isError && (
                <div className="py-10 text-center text-sm text-muted-foreground 2xl:hidden">
                  {isSearching ? "No order found with that ID." : "No orders yet."}
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
                {orders.map((order) => (
                  <TableRow key={order.id} className="align-top hover:bg-muted/30">
                    <TableCell className="pl-4 pt-5 font-medium">
                      <span className="font-mono text-xs">#{order.id}</span>
                    </TableCell>
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
                          <div key={item.key} className="flex gap-2.5">
                            <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 space-y-0.5">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                SKU {item.sku} · Qty {item.quantity} · {currency.format(item.price)} each
                                {item.color ? ` · ${item.color}` : ""}
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
                      <StatusSelect orderId={order.id} status={order.status} />
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
                {!isPending && orders.length === 0 && !isError && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      {isSearching ? "No order found with that ID." : "No orders yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </div>

          <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {isPending
                ? "Loading orders..."
                : orders.length === 0
                  ? "No orders found"
                  : isSearching
                    ? `Showing ${orders.length} result${orders.length === 1 ? "" : "s"}`
                    : `Showing ${showingFrom}–${showingTo} of ${totalOrders} orders`}
            </p>
            {!isSearching && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={isPending || currentPage <= 1}
              >
                <ChevronLeft /> Previous
              </Button>
              <span className="min-w-16 text-center text-sm text-muted-foreground">
                Page {Math.min(currentPage, pageCount)} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                disabled={isPending || currentPage >= pageCount}
              >
                Next <ChevronRight />
              </Button>
            </div>
            )}
          </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
