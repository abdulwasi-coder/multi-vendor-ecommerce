"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  ClipboardList,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DASHBOARD_RANGES,
  DEFAULT_DASHBOARD_RANGE,
  rangeDays,
  sumFinanceBuckets,
  useVendorFinance,
  type VendorFinanceBucket,
  type VendorFinanceRange,
  type VendorPayoutOrder,
} from "@/Otherfiles/tanstack/vendor-finance";
import {
  useVendorOrders,
  type VendorOrder,
} from "@/Otherfiles/tanstack/vendor-orders";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusStyles: Record<string, string> = {
  Pending: "border-zinc-200 bg-zinc-50 text-zinc-600",
  Processing: "border-amber-200 bg-amber-50 text-amber-700",
  Shipped: "border-blue-200 bg-blue-50 text-blue-700",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

function capitalizeStatus(status: string) {
  return typeof status === "string" && status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Pending";
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function percentChange(current: number, previous: number) {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

function buildDailySeries(
  buckets: VendorFinanceBucket[] | undefined,
  days: number,
) {
  const byDate = new Map<string, number>();
  for (const bucket of buckets ?? []) {
    const key = bucket._id ?? {};
    const date = new Date(
      Date.UTC(Number(key.year), Number(key.month) - 1, Number(key.day)),
    );
    if (Number.isNaN(date.getTime())) continue;
    const iso = date.toISOString().slice(0, 10);
    byDate.set(iso, (byDate.get(iso) ?? 0) + (bucket.totalGrossSales ?? 0));
  }
  const series: { date: string; sales: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    series.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sales: byDate.get(key) ?? 0,
    });
  }
  return series;
}

function payoutItemCount(payout: VendorPayoutOrder) {
  return (payout.items ?? []).reduce(
    (total, item) => total + (item.quantity ?? 1),
    0,
  );
}

export function VendorDashboard() {
  const [range, setRange] = useState<VendorFinanceRange>(
    DEFAULT_DASHBOARD_RANGE,
  );
  const financeQuery = useVendorFinance(range);
  const ordersQuery = useVendorOrders(1, 5, "all", "");

  const days = rangeDays(range);
  const current = sumFinanceBuckets(financeQuery.data?.current);
  const previous = sumFinanceBuckets(financeQuery.data?.previous);
  const isLoading = financeQuery.isPending || ordersQuery.isPending;
  const isError = financeQuery.isError || ordersQuery.isError;

  const salesChange = percentChange(
    current.totalGrossSales,
    previous.totalGrossSales,
  );
  const ordersChange = percentChange(
    current.totalOrders,
    previous.totalOrders,
  );

  const summary = [
    {
      label: "Total sales",
      value: currency.format(current.totalGrossSales),
      change: salesChange,
      icon: CircleDollarSign,
    },
    {
      label: "Total benefit",
      value: currency.format(current.totalNetEarnings),
      change: percentChange(
        current.totalNetEarnings,
        previous.totalNetEarnings,
      ),
      icon: ClipboardList,
    },
    {
      label: "Total orders",
      value: String(current.totalOrders),
      change: ordersChange,
      icon: PackageCheck,
    },
    {
      label: "Fulfilled orders",
      value: String(current.deliveredOrders),
      change: percentChange(
        current.deliveredOrders,
        previous.deliveredOrders,
      ),
      icon: PackageCheck,
    },
    {
      label: "Processing orders",
      value: String(current.processingOrders),
      change: percentChange(
        current.processingOrders,
        previous.processingOrders,
      ),
      icon: ShoppingBag,
    },
    {
      label: "Cancelled orders",
      value: String(current.cancelledOrders),
      change: percentChange(
        current.cancelledOrders,
        previous.cancelledOrders,
      ),
      icon: PackageCheck,
    },
  ];

  const chartData = buildDailySeries(financeQuery.data?.current, days);
  const recentOrders = ordersQuery.data?.orders ?? [];
  const payouts = financeQuery.data?.lastPaidOrders ?? [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Vendor dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            A quick look at your store performance and latest activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={range}
            onValueChange={(value) => {
              if (value) setRange(value as VendorFinanceRange);
            }}
          >
            <SelectTrigger
              aria-label="Select reporting period"
              className="w-36"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DASHBOARD_RANGES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link href="/vendor/create" className="w-fit">
            <Button>
              Add a product <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </header>

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-background p-4 text-sm text-destructive">
          Could not load dashboard data. Please refresh to try again.
        </div>
      )}

      <section
        aria-label="Marketplace overview"
        className="grid gap-4 xl:gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
      >
        {summary.map((metric) => {
          const Icon = metric.icon;
          const change = metric.change;
          const up = change !== null && change >= 0;
          return (
            <Card key={metric.label} className="grid grid-rows-[30_30_40]">
              <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between text-sm font-medium text-muted-foreground">
                  {metric.label}
                  <Icon className="size-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-5 text-2xl font-semibold tracking-tight">
                {isLoading ? (
                  <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                ) : (
                  metric.value
                )}
              </CardContent>
              <CardFooter className="flex gap-0.5 overflow-visible border-0 bg-background pr-1 text-xs font-medium">
                {change === null ? (
                  <span className="text-muted-foreground">
                    No data for previous period
                  </span>
                ) : (
                  <>
                    {up ? (
                      <ArrowUpRight className="size-3 text-emerald-700" />
                    ) : (
                      <ArrowDownRight className="size-3 text-rose-600" />
                    )}
                    <span className={up ? "text-emerald-700" : "text-rose-600"}>
                      {Math.abs(change).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      vs previous period
                    </span>
                  </>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-1">
        <Card className="pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>Sales — last {days} days</CardTitle>
              <CardDescription>
                Gross sales per day, excluding cancelled orders.
              </CardDescription>
            </div>
            {financeQuery.isFetching && !financeQuery.isPending && (
              <span className="text-xs text-muted-foreground">Updating…</span>
            )}
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <div className="h-62.5 w-full">
              {isLoading ? (
                <div className="h-full w-full animate-pulse rounded-lg bg-muted/60" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="vendorSalesFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--primary)"
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--primary)"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={24}
                      className="text-xs"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `$${value}`}
                      className="text-xs"
                      width={60}
                    />
                    <Tooltip
                      formatter={(value) => [
                        currency.format(Number(value)),
                        "Sales",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      fill="url(#vendorSalesFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent payouts</CardTitle>
            <CardDescription className="mt-1">
              Your latest vendor payouts from delivered orders.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead className="hidden lg:table-cell">Order total</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financeQuery.isPending &&
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className="px-6 py-3">
                        <div className="h-8 animate-pulse rounded bg-muted/60" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!financeQuery.isPending &&
                  payouts.map((payout: VendorPayoutOrder) => {
                    const productName = payout.productData?.name ?? "Product";
                    const itemCount = payoutItemCount(payout);
                    return (
                      <TableRow key={payout._id}>
                        <TableCell className="pl-6 font-mono text-xs font-medium">
                          #{String(payout._id).slice(-8)}
                        </TableCell>
                        <TableCell className="max-w-48 truncate">
                          {productName}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {itemCount}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground lg:table-cell">
                          {currency.format(payout.subOrderTotal ?? 0)}
                        </TableCell>
                        <TableCell className="font-medium text-emerald-700">
                          {currency.format(payout.vendorNetEarned ?? 0)}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {formatDate(payout.updatedAt ?? payout.createdAt)}
                        </TableCell>
                        <TableCell className="pr-6">
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 text-emerald-700"
                          >
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {!financeQuery.isPending && payouts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No payouts yet — they'll appear here once your
                      earnings are released.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription className="mt-1">
              Track and fulfill your latest sales.
            </CardDescription>
          </div>

          <Link href="/vendor/orders">
            <Button variant="outline" size="sm">
              View all orders <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden lg:table-cell">Item</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6} className="px-6 py-3">
                        <div className="h-8 animate-pulse rounded bg-muted/60" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading &&
                  recentOrders.map((order: VendorOrder) => {
                    const customerName =
                      typeof order.customerID === "object"
                        ? order.customerID?.name
                        : null;
                    const firstItem = order.items?.[0];
                    const itemName = firstItem?.productID?.name ?? "Item";
                    const extraCount = Math.max(
                      0,
                      (order.items?.length ?? 0) - 1,
                    );
                    const status = capitalizeStatus(order.status);
                    return (
                      <TableRow key={order._id}>
                        <TableCell className="pl-6 font-mono text-xs font-medium">
                          #{String(order._id).slice(-8)}
                        </TableCell>
                        <TableCell>{customerName ?? "Customer"}</TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="hidden max-w-56 truncate text-muted-foreground lg:table-cell">
                          {itemName}
                          {extraCount > 0 ? ` +${extraCount} more` : ""}
                        </TableCell>
                        <TableCell className="font-medium">
                          {currency.format(order.subOrderTotal ?? 0)}
                        </TableCell>
                        <TableCell className="pr-6">
                          <Badge
                            variant="outline"
                            className={statusStyles[status] ?? ""}
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {!isLoading && recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      No orders yet — they'll appear here once customers
                      buy your products.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
