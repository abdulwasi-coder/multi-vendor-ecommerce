"use client";

import { Fragment, useDeferredValue, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  ClipboardList,
  MapPin,
  Package,
  Search,
} from "lucide-react";
import { toast } from "sonner";
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
import api from "@/lib/axios";
import { downloadCsv } from "@/lib/vendor-csv";
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
  Pending: "border-zinc-400/20 bg-zinc-400/10 text-zinc-300",
  Processing: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Shipped: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  Delivered: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

const statusOptions = ["Processing", "Shipped", "Delivered"];

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
  const items = order.items ?? [];
  return {
    id: order._id,
    customerName,
    itemCount: items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    shippingAddress: {
      name: customerName,
      street: address.address ?? "",
      city: [address.city, address.postalCode].filter(Boolean).join(" "),
      country: address.country ?? "",
      phone: address.phone ?? "",
    },
    items: items.map((item, index) => ({
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

  return (
    <Select
      value={normalized}
      disabled={updateStatus.isPending}
      onValueChange={(value) => {
        if (!value || value === normalized) return;
        updateStatus.mutate(
          { id: orderId, status: value },
          {
            onSuccess: () =>
              toast.success(`Order marked as ${capitalizeStatus(value)}.`),
            onError: (error) =>
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Could not update status.",
              ),
          },
        );
      }}
    >
      <SelectTrigger
        aria-label={`Update status for order ${orderId}`}
        className={`h-8 w-32 text-xs font-medium ${statusStyles[status] ?? ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(status === "Pending" ? ["Pending", ...statusOptions] : statusOptions).map(
          (option) => (
            <SelectItem key={option} value={option.toLowerCase()}>
              {option}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
}

function OrderDetails({ order }) {
  return (
    <div className="grid gap-5 border-t border-white/[0.07] bg-[#1d2026] px-4 py-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] lg:gap-x-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Shipping address
        </p>
        <div className="mt-2 flex gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-blue-300" />
          <div className="space-y-0.5 text-sm">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p className="text-xs leading-5 text-muted-foreground">
              {order.shippingAddress.street}
              {order.shippingAddress.street ? <br /> : null}
              {order.shippingAddress.city}
              {order.shippingAddress.city ? <br /> : null}
              {order.shippingAddress.country}
              {order.shippingAddress.phone ? <><br />{order.shippingAddress.phone}</> : null}
            </p>
          </div>
        </div>
      </div>

      <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-border/60 lg:pl-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Items ({order.items.length})
        </p>
        <div className="mt-2 space-y-2.5">
          {order.items.map((item) => (
            <div key={item.key} className="flex gap-2.5">
              <Package className="mt-0.5 size-4 shrink-0 text-violet-300" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  SKU {item.sku} · Qty {item.quantity} ·{" "}
                  {currency.format(item.price)} each
                  {item.color ? ` · ${item.color}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Subtotal {currency.format(item.subtotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-border/60 lg:pl-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Payout
        </p>
        <dl className="mt-2 space-y-1.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Suborder total</dt>
            <dd className="font-medium">{currency.format(order.suborderTotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Net earned</dt>
            <dd className="font-medium text-emerald-300">
              {currency.format(order.vendorNetEarned)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Payout release</dt>
            <dd>{order.payoutReleaseDate}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function VendorOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeOption, setPageSizeOption] = useState("10");
  const [expandedId, setExpandedId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const deferredSearch = useDeferredValue(search.trim());
  const isSearching = deferredSearch.length > 0;

  const pageSize =
    pageSizeOption === "all" ? 50 : Math.max(1, Number(pageSizeOption) || 10);

  const { data, isPending, isFetching, isError, error, refetch } = useVendorOrders(
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
    setExpandedId(null);
  }

  function updateStatus(value) {
    setStatusFilter(value);
    setCurrentPage(1);
    setExpandedId(null);
  }

  function updatePageSize(value) {
    setPageSizeOption(value);
    setCurrentPage(1);
    setExpandedId(null);
  }

  async function exportOrders() {
    if (isExporting || !data || isPending || isFetching || search.trim() !== deferredSearch) return;
    setIsExporting(true);
    const headers = [
      "Order ID", "Customer", "Shipping address", "Shipping city", "Shipping country", "Shipping phone",
      "Item name", "SKU", "Color", "Quantity", "Price", "Item subtotal", "Suborder total",
      "Vendor net earned", "Status", "Created at", "Payout release date",
    ];
    try {
      const exportedOrders = [];
      for (let page = 1; page <= totalPages; page += 1) {
        const response = await api.get("/vendor/vendorOrder", {
          params: { page, limit: pageSize, status: statusFilter, search: deferredSearch || undefined },
        });
        if (!response.data.success || !Array.isArray(response.data.orders)) {
          throw new Error(response.data.message ?? "Could not export orders.");
        }
        exportedOrders.push(...response.data.orders.map(normalizeOrder));
      }
      const rows = exportedOrders.flatMap((order) =>
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
        ]),
      );
      downloadCsv("orders.csv", headers, rows);
      toast.success(`Exported ${exportedOrders.length} orders.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not export orders.");
    } finally {
      setIsExporting(false);
    }
  }

  const showingFrom = orders.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, (currentPage - 1) * pageSize + orders.length);

  return (
    <main className="vendor-dashboard-surface min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-400 space-y-6">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
          <div className="flex items-start gap-3">
            <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-xl bg-blue-400/10 text-blue-300">
              <ClipboardList className="size-5" />
            </span>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
              <p className="text-sm text-muted-foreground">
                Review order items, delivery details, and your earnings.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:pb-1">
            {totalOrders} {totalOrders === 1 ? "order" : "orders"} in total
          </p>
        </header>

        <section aria-label="Orders">
          <Card className="vendor-dashboard-card overflow-hidden rounded-2xl border-white/10 bg-[#23262d] shadow-sm">
            <CardHeader className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle>All orders</CardTitle>
                <CardDescription>
                  Search by order ID, or filter by status. Select a row for details.
                </CardDescription>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                <span className="size-1.5 rounded-full bg-emerald-400" /> Manage orders and payouts
              </span>
            </CardHeader>

            <div className="mx-4 mb-4 flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#1d2026] p-3 sm:mx-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search by order ID..."
                aria-label="Search orders by ID"
                className="border-white/10 bg-[#252830] pl-9 placeholder:text-slate-500 focus-visible:ring-blue-400/40"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={statusFilter} onValueChange={updateStatus} disabled={isSearching}>
                <SelectTrigger aria-label="Filter orders by status" className="w-full border-white/10 bg-[#252830] sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pageSizeOption} onValueChange={updatePageSize} disabled={isSearching}>
                <SelectTrigger aria-label="Choose how many orders to show" className="w-full border-white/10 bg-[#252830] sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Show 3</SelectItem>
                  <SelectItem value="5">Show 5</SelectItem>
                  <SelectItem value="10">Show 10</SelectItem>
                  <SelectItem value="all">Show all</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => void exportOrders()} disabled={isExporting || isPending || isFetching || search.trim() !== deferredSearch || orders.length === 0} className="border-white/10 bg-[#252830] hover:bg-white/[0.08]">
                <Download /> {isExporting ? "Exporting..." : "Export CSV"}
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

            <CardContent className="px-0 sm:px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.025]">
                      <TableHead className="h-11 w-10 pl-4" />
                      <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</TableHead>
                      <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</TableHead>
                      <TableHead className="hidden h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Items</TableHead>
                      <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</TableHead>
                      <TableHead className="hidden h-11 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">Net earned</TableHead>
                      <TableHead className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                      <TableHead className="hidden h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Release Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPending &&
                      [0, 1, 2].map((i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={8} className="px-4 py-3">
                            <div className="h-9 animate-pulse rounded-md bg-muted/60" />
                          </TableCell>
                        </TableRow>
                      ))}

                    {!isPending &&
                      orders.map((order) => {
                        const expanded = expandedId === order.id;
                        return (
                          <Fragment key={order.id}>
                            <TableRow
                              className="cursor-pointer align-middle transition-colors hover:bg-white/[0.035]"
                              onClick={() => setExpandedId(expanded ? null : order.id)}
                              aria-expanded={expanded}
                            >
                              <TableCell className="pl-4">
                                {expanded ? (
                                  <ChevronUp className="size-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="size-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell
                                className="font-mono text-xs font-medium"
                                title={order.id}
                              >
                                #{order.id.slice(-8)}...
                              </TableCell>
                              <TableCell className="font-medium">
                                {order.customerName}
                              </TableCell>
                              <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                                {order.itemCount}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {currency.format(order.suborderTotal)}
                              </TableCell>
                              <TableCell className="hidden text-right font-medium text-emerald-300 lg:table-cell">
                                {currency.format(order.vendorNetEarned)}
                              </TableCell>
                              <TableCell onClick={(event) => event.stopPropagation()}>
                                <StatusSelect orderId={order.id} status={order.status} />
                              </TableCell>
                              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDays className="size-3.5" /> {order.payoutReleaseDate}
                                </span>
                              </TableCell>
                            </TableRow>
                            {expanded && (
                              <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={8} className="p-0">
                                  <OrderDetails order={order} />
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        );
                      })}

                    {!isPending && !isError && orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          {isSearching ? "No order found with that ID." : "No orders yet."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

          <div className="flex flex-col gap-3 border-t border-white/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
