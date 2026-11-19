"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
  Download,
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
import { downloadCsv } from "@/lib/vendor-csv";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusStyles: Record<string, string> = {
  Pending: "border-sky-100/15 bg-sky-100/[0.06] text-sky-200",
  Processing: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  Shipped: "border-sky-300/20 bg-sky-300/10 text-sky-200",
  Delivered: "border-sky-300/20 bg-sky-300/10 text-sky-200",
  Cancelled: "border-rose-300/20 bg-rose-300/10 text-rose-200",
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

function buildComparisonSeries(
  current: VendorFinanceBucket[] | undefined,
  previous: VendorFinanceBucket[] | undefined,
  days: number,
) {
  const toSalesByDate = (buckets: VendorFinanceBucket[] | undefined) => {
    const byDate = new Map<string, number>();
    for (const bucket of buckets ?? []) {
      const key = bucket._id ?? {};
      const date = new Date(
        Date.UTC(Number(key.year), Number(key.month) - 1, Number(key.day)),
      );
      if (Number.isNaN(date.getTime())) continue;
      const iso = date.toISOString().slice(0, 10);
      byDate.set(
        iso,
        (byDate.get(iso) ?? 0) + (bucket.totalGrossSales ?? 0),
      );
    }
    return byDate;
  };

  const currentByDate = toSalesByDate(current);
  const previousByDate = toSalesByDate(previous);
  const isoKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const series: { date: string; current: number; previous: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const prev = new Date(d);
    prev.setDate(prev.getDate() - days);
    series.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      current: currentByDate.get(isoKey(d)) ?? 0,
      previous: previousByDate.get(isoKey(prev)) ?? 0,
    });
  }
  return series;
}

function payoutItemCount(payout: { items?: Array<{ quantity?: number }> | null }) {
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
      iconColor: "#60a5fa",
      iconBackground: "rgba(59, 130, 246, .16)",
    },
    {
      label: "Total benefit",
      value: currency.format(current.totalNetEarnings),
      change: percentChange(
        current.totalNetEarnings,
        previous.totalNetEarnings,
      ),
      icon: ClipboardList,
      iconColor: "#2dd4bf",
      iconBackground: "rgba(20, 184, 166, .15)",
    },
    {
      label: "Total orders",
      value: String(current.totalOrders),
      change: ordersChange,
      icon: PackageCheck,
      iconColor: "#a78bfa",
      iconBackground: "rgba(139, 92, 246, .16)",
    },
    {
      label: "Fulfilled orders",
      value: String(current.deliveredOrders),
      change: percentChange(
        current.deliveredOrders,
        previous.deliveredOrders,
      ),
      icon: PackageCheck,
      iconColor: "#34d399",
      iconBackground: "rgba(16, 185, 129, .15)",
    },
    {
      label: "Processing orders",
      value: String(current.processingOrders),
      change: percentChange(
        current.processingOrders,
        previous.processingOrders,
      ),
      icon: ShoppingBag,
      iconColor: "#fbbf24",
      iconBackground: "rgba(245, 158, 11, .15)",
    },
    {
      label: "Cancelled orders",
      value: String(current.cancelledOrders),
      change: percentChange(
        current.cancelledOrders,
        previous.cancelledOrders,
      ),
      icon: PackageCheck,
      iconColor: "#fb7185",
      iconBackground: "rgba(244, 63, 94, .15)",
    },
  ];

  const chartData = buildComparisonSeries(
    financeQuery.data?.current,
    financeQuery.data?.previous,
    days,
  );
  const recentOrders = ordersQuery.data?.orders ?? [];
  const payouts = financeQuery.data?.lastPaidOrders ?? [];

  function exportDashboard() {
    const rows = [
      ...summary.map((metric) => [
        "Summary",
        `Last ${days} days`,
        "",
        metric.label,
        "",
        "",
        metric.value,
        "",
        "",
      ]),
      ...payouts.map((payout) => [
        "Payout",
        "",
        payout._id,
        payout.productNames?.filter(Boolean).join(", ") || "Product",
        formatDate(payout.payoutReleaseDate),
        payoutItemCount(payout),
        payout.subOrderTotal ?? 0,
        payout.vendorNetEarned ?? 0,
        "Released",
      ]),
      ...recentOrders.map((order) => [
        "Recent order",
        "",
        order._id,
        typeof order.customerID === "object" ? order.customerID?.name ?? "Customer" : "Customer",
        formatDate(order.createdAt),
        payoutItemCount(order),
        order.subOrderTotal ?? 0,
        order.vendorNetEarned ?? 0,
        capitalizeStatus(order.status),
      ]),
    ];
    downloadCsv(
      `vendor-dashboard-${days}-days.csv`,
      ["Type", "Period", "ID", "Name", "Date", "Items", "Order total / value", "Net earned", "Status"],
      rows,
    );
  }

  return (
    <main className="vendor-dashboard-surface mx-auto min-h-screen w-full max-w-400 space-y-6 px-4 py-6 text-slate-50 sm:px-6 lg:px-8">
      <header className="vendor-dashboard-enter flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-sm text-slate-300">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Overview
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={range}
            onValueChange={(value) => {
              if (value) setRange(value as VendorFinanceRange);
            }}
          >
            <SelectTrigger
              aria-label="Select reporting period"
              className="w-36 rounded-xl border-white/15 bg-[#23262d] text-slate-50 transition-colors hover:border-white/25 hover:bg-[#2b2f36]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border border-white/10 bg-[#23262d] text-slate-100 shadow-xl">
              {DASHBOARD_RANGES.map((item) => (
                <SelectItem key={item.value} value={item.value} className="text-slate-200 focus:bg-white/[0.08] focus:text-white">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportDashboard}
            disabled={isLoading || isError}
            className="rounded-xl border-white/10 bg-[#23262d] text-slate-200 hover:bg-[#2b2f36]"
          >
            <Download aria-hidden="true" /> Export CSV
          </Button>
          <Link href="/vendor/create" className="w-fit">
            <Button className="rounded-xl bg-blue-400 text-slate-950 shadow-sm transition-colors duration-150 hover:bg-blue-300">
              Add a product <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </header>

      {isError && (
        <div className="rounded-xl border border-rose-200/20 bg-rose-950/30 p-4 text-sm text-rose-200">
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
            <Card key={metric.label} className="group vendor-dashboard-enter vendor-dashboard-card vendor-dashboard-metric grid grid-rows-[30_30_40] border-white/10 bg-[#23262d] text-slate-50">
              <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between text-sm font-medium text-slate-300">
                  {metric.label}
                  <span style={{ color: metric.iconColor, backgroundColor: metric.iconBackground }} className="flex size-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"><Icon className="size-4 transition-transform duration-200 group-hover:rotate-12" /></span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-5 text-2xl font-semibold tracking-tight text-[#f3f6fb]">
                {isLoading ? (
                  <div className="h-8 w-20 animate-pulse rounded-lg bg-white/[0.08]" />
                ) : (
                  metric.value
                )}
              </CardContent>
              <CardFooter className="flex gap-0.5 overflow-visible border-0 bg-transparent pr-1 text-xs font-medium">
                {change === null ? (
                  <span className="text-muted-foreground">
                    No data for previous period
                  </span>
                ) : (
                  <>
                    {up ? (
                    <ArrowUpRight className="size-3 text-sky-300" />
                    ) : (
                    <ArrowDownRight className="size-3 text-rose-300" />
                    )}
                    <span className={up ? "text-sky-300" : "text-rose-300"}>
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
        <Card className="vendor-dashboard-enter vendor-dashboard-card border-white/10 bg-[#23262d] pt-0 text-slate-50">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/[0.08] py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-lg font-semibold text-slate-50">Sales — last {days} days</CardTitle>
              <CardDescription className="text-slate-300">
                Gross sales per day vs the previous period, excluding
                cancelled orders.
              </CardDescription>
            </div>
            {financeQuery.isFetching && !financeQuery.isPending && (
              <span className="text-xs text-slate-400">Updating…</span>
            )}
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <div className="h-62.5 w-full">
              {isLoading ? (
                <div className="h-full w-full animate-pulse rounded-xl bg-white/[0.08]" />
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
                          stopColor="#8ab8e8"
                          stopOpacity={0.16}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8ab8e8"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="3 3"
                      stroke="rgba(188,221,203,.10)"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={24}
                      tick={{ fill: "#bdcadd", fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `$${value}`}
                      tick={{ fill: "#bdcadd", fontSize: 11 }}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{ background: "#1a302a", border: "1px solid rgba(140,203,176,.2)", borderRadius: 10, color: "#e7f0eb" }}
                      labelStyle={{ color: "#a9c1b5" }}
                      formatter={(value, name) => [
                        currency.format(Number(value)),
                        name === "current" ? "Current period" : "Previous period",
                      ]}
                    />
                    <Legend
                      formatter={(value) =>
                        value === "current" ? "Current period" : "Previous period"
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="previous"
                      name="previous"
                      stroke="#8ab8e8"
                      strokeOpacity={0.45}
                      strokeWidth={2}
                      strokeDasharray="5 4"
                      fill="none"
                    />
                    <Area
                      type="monotone"
                      dataKey="current"
                      name="current"
                      stroke="#8ab8e8"
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

      <Card className="vendor-dashboard-enter vendor-dashboard-card overflow-hidden rounded-2xl border-white/10 bg-[#23262d] text-slate-50">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-50">Recent payouts</CardTitle>
            <CardDescription className="mt-1 text-slate-300">
              Orders whose payout release date has passed.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                  <TableHead className="pl-6">Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead className="hidden lg:table-cell">Order total</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead className="hidden md:table-cell">Release date</TableHead>
                  <TableHead className="pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financeQuery.isPending &&
                  [0, 1, 2].map((i) => (
                    <TableRow key={i} className="border-white/[0.06]">
                      <TableCell colSpan={7} className="px-6 py-3">
                        <div className="h-8 animate-pulse rounded-lg bg-white/[0.06]" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!financeQuery.isPending &&
                  payouts.map((payout: VendorPayoutOrder) => {
                    const productName =
                      payout.productNames?.filter(Boolean).join(", ") ||
                      "Product";
                    const itemCount = payoutItemCount(payout);
                    return (
                      <TableRow key={payout._id} className="border-white/[0.06] transition-colors duration-150 hover:bg-white/[0.035]">
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
                        <TableCell className="font-medium text-sky-200">
                          {currency.format(payout.vendorNetEarned ?? 0)}
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {formatDate(payout.payoutReleaseDate)}
                        </TableCell>
                        <TableCell className="pr-6">
                          <Badge
                            variant="outline"
                            className="border-sky-200/15 bg-sky-300/10 text-sky-200"
                          >
                            Released
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {!financeQuery.isPending && payouts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-slate-300"
                    >
                      No payouts yet — they&apos;ll appear here once your
                      earnings are released.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="vendor-dashboard-enter vendor-dashboard-card overflow-hidden rounded-2xl border-white/10 bg-[#23262d] text-slate-50">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-50">Recent orders</CardTitle>
            <CardDescription className="mt-1 text-slate-300">
              Track and fulfill your latest sales.
            </CardDescription>
          </div>

          <Link href="/vendor/orders">
            <Button variant="outline" size="sm" className="rounded-lg border-white/10 bg-white/[0.04] text-slate-100 transition-colors duration-150 hover:border-white/20 hover:bg-white/[0.08]">
              View all orders <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
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
                    <TableRow key={i} className="border-white/[0.06]">
                      <TableCell colSpan={6} className="px-6 py-3">
                        <div className="h-8 animate-pulse rounded-lg bg-white/[0.06]" />
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
                      <TableRow key={order._id} className="border-white/[0.06] transition-colors duration-150 hover:bg-white/[0.035]">
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
                      className="py-10 text-center text-sm text-slate-300"
                    >
                      No orders yet — they&apos;ll appear here once customers
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
