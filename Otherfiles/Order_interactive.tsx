"use client"

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Search,
  Store,
  TrendingUp,
} from "lucide-react";
import {
  useAdminOrderFeed,
  useVendorBalanceLedger,
  type AdminOrderFeedItem,
  type VendorLedgerEntry,
} from "@/Otherfiles/tanstack/admin";
import {
  AnimatedNumber,
} from "@/components/ui/animated-number";

const PAGE_SIZE = 10;

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const shortId = (id?: string | null) =>
  id ? `#${String(id).slice(-8).toUpperCase()}` : "—";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function customerLabel(order: AdminOrderFeedItem) {
  const customer = order.customerID;
  if (customer && typeof customer === "object") {
    return customer.name || customer.email || shortId(customer._id);
  }
  return shortId(typeof customer === "string" ? customer : order._id);
}

function paymentStatusBadge(status?: string) {
  const normalized = (status ?? "").toLowerCase();
  const variant =
    normalized === "paid" || normalized === "delivered"
      ? "default"
      : normalized === "failed"
        ? "destructive"
        : "secondary";
  return <Badge variant={variant}>{status ?? "unknown"}</Badge>;
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft /> Prev
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function AdminOrdersLedger() {
  const [vendorPage, setVendorPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [vendorSearch, setVendorSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const ledgerQuery = useVendorBalanceLedger(PAGE_SIZE, true, vendorPage);
  const feedQuery = useAdminOrderFeed(orderPage, PAGE_SIZE);

  const summary = ledgerQuery.data?.summaryStats?.[0];
  const vendors = ledgerQuery.data?.vendorsData ?? [];
  const orders = feedQuery.data?.orders ?? [];

  const filteredVendors = vendors.filter((vendor: VendorLedgerEntry) =>
    [vendor.BusinessName, vendor.vendorID]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(vendorSearch.trim().toLowerCase()),
  );

  const filteredOrders = orders.filter((order) =>
    [order._id, customerLabel(order), order.paymentMethod, order.paymentStatus]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(orderSearch.trim().toLowerCase()),
  );

  const stats = [
    {
      title: "Active vendors",
      value: summary?.totalVendors ?? 0,
      currency: undefined,
      description: "Vendors with recorded sales",
      icon: Store,
    },
    {
      title: "Average net earning",
      value: summary?.avgNetEarning ?? 0,
      currency: "USD",
      description: "Average vendor share per order",
      icon: TrendingUp,
    },
    {
      title: "Platform revenue",
      value: summary?.TotalGrossEarnedFromVendors ?? 0,
      currency: "USD",
      description: "Commission earned from vendors",
      icon: CircleDollarSign,
    },
    {
      title: "Orders processed",
      value: summary?.TotalOrdersProcessed ?? 0,
      currency: undefined,
      description: "Vendor suborders tracked",
      icon: ClipboardList,
    },
    {
      title: "Total orders",
      value: feedQuery.data?.totalOrders ?? 0,
      currency: undefined,
      description: "Customer orders placed",
      icon: BadgeDollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <section
        aria-label="Marketplace overview"
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {stats.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.title}
              className="grid min-w-0 grid-rows-[auto_1fr_auto] gap-0 overflow-hidden"
            >
              <CardHeader>
                <CardTitle className="flex-row flex gap-2 space-y-0 items-center justify-between text-sm font-medium text-muted-foreground">
                  {metric.title}
                  <div className="admin-stat-icon flex size-8 items-center justify-center rounded-lg bg-amber-300/10">
                    <Icon className="size-4 text-amber-100" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-14 break-words px-5 py-2 text-2xl font-semibold leading-tight tracking-tight">
                <AnimatedNumber
                  value={metric.value}
                  currency={metric.currency}
                  maximumFractionDigits={metric.currency ? 2 : 0}
                />
              </CardContent>
              <CardFooter className="min-h-10 border-0 bg-transparent px-5 pt-0 pb-4 text-xs leading-5 text-muted-foreground">
                {metric.description}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Vendor Ledger</CardTitle>
            <CardDescription>
              Sales, earnings and order counts per vendor
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={vendorSearch}
              onChange={(event) => setVendorSearch(event.target.value)}
              placeholder="Search vendors..."
              className="pl-9"
              aria-label="Search vendors"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="w-full min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Vendor</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Gross sales
                  </TableHead>
                  <TableHead>Vendor earning</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Platform revenue
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Order count
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerQuery.isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Loading vendor ledger...
                    </TableCell>
                  </TableRow>
                ) : ledgerQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-destructive"
                    >
                      Could not load vendor ledger.
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length ? (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.vendorID}>
                      <TableCell className="pl-6 font-medium">
                        {vendor.BusinessName || "Unnamed vendor"}
                        <span className="block text-xs font-normal text-muted-foreground">
                          {shortId(vendor.vendorID)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-medium">
                        {currency.format(vendor.grossSales ?? 0)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {currency.format(vendor.vendorPayoutBalance ?? 0)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
                        {currency.format(vendor.platfromRevenue ?? 0)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell font-medium">
                        {vendor.orderCount ?? 0}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {vendorSearch
                        ? "No vendors match your search."
                        : "No vendor sales yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={vendorPage}
            totalPages={ledgerQuery.data?.totalPages ?? 1}
            onPageChange={setVendorPage}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Order Feed</CardTitle>
            <CardDescription>
              Recent customer orders across the marketplace
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
              placeholder="Search orders..."
              className="pl-9"
              aria-label="Search orders"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="w-full min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Payment method
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedQuery.isPending ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : feedQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-destructive"
                    >
                      Could not load orders.
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="pl-6 font-medium">
                        {shortId(order._id)}
                        <span className="block text-xs font-normal text-muted-foreground">
                          {order.paymentIntentId
                            ? `PI ${String(order.paymentIntentId).slice(0, 12)}…`
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell>{customerLabel(order)}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {order.paymentMethod ?? "—"}
                      </TableCell>
                      <TableCell>{paymentStatusBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {currency.format(order.totalPrice ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {orderSearch
                        ? "No orders match your search."
                        : "No orders yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={orderPage}
            totalPages={feedQuery.data?.totalPages ?? 1}
            onPageChange={setOrderPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
