"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  Banknote,
  Boxes,
  CircleDollarSign,
  Clock3,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  DropdownMenuCustom,
  PendingOrders,
  PendingVendor,
} from "@/Otherfiles/dash_interactive";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  ADMIN_DASHBOARD_RANGES,
  DEFAULT_ADMIN_DASHBOARD_RANGE,
  adminDashboardMonths,
  buildAdminRevenueSeries,
  useAdminDashboard,
  type AdminDashboardRange,
} from "@/Otherfiles/tanstack/admin";
import Link from "next/link";


export default function AdminDashboard() {
  const [range, setRange] = useState<AdminDashboardRange>(
    DEFAULT_ADMIN_DASHBOARD_RANGE,
  );
  const dashboardQuery = useAdminDashboard(range);
  const summary = dashboardQuery.data?.summary;
  const pendingPayout =
    dashboardQuery.data?.pendingPayout?.[0]?.PendingPayoutMoney ?? 0;
  const chartData = buildAdminRevenueSeries(
    dashboardQuery.data?.chartData,
    dashboardQuery.data?.previousChartData,
    adminDashboardMonths(range),
  );
  const isLoading = dashboardQuery.isPending;
  const periodLabel =
    ADMIN_DASHBOARD_RANGES.find((item) => item.value === range)?.label ??
    "1 Year";

  const metrics = [
    {
      label: "Gross sales",
      value: summary?.grossMerchandizeValue ?? 0,
      currency: "USD",
      detail: `last ${periodLabel.toLowerCase()}`,
      icon: CircleDollarSign,
      iconColor: "#fff0b7",
      iconBackground: "rgba(255,240,183,.12)",
      pending: false,
    },
    {
      label: "Total Benefit",
      value: summary?.PlatformRevenue ?? 0,
      currency: "USD",
      detail: `last ${periodLabel.toLowerCase()}`,
      icon: ShoppingBag,
      iconColor: "#ffe29a",
      iconBackground: "rgba(255,226,154,.12)",
      pending: false,
    },
    {
      label: "Total Customers",
      value: summary?.registeredCustomerCount ?? 0,
      currency: undefined,
      detail: "registered users",
      icon: Store,
      iconColor: "#fff7dc",
      iconBackground: "rgba(255,247,220,.1)",
      pending: false,
    },
    {
      label: "Total Vendors",
      value: summary?.activeVendorCount ?? 0,
      currency: undefined,
      detail: "active sellers",
      icon: Users,
      iconColor: "#f7d77f",
      iconBackground: "rgba(247,215,127,.12)",
      pending: false,
    },
    {
      label: "Pending payouts",
      value: pendingPayout,
      currency: "USD",
      detail: "awaiting release",
      icon: Banknote,
      iconColor: "#ffedb0",
      iconBackground: "rgba(255,237,176,.12)",
      pending: true,
    },
  ];

  return (
    <main className="admin-dashboard-surface mx-auto min-h-screen max-w-400 w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 border-b border-amber-100/10 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
              day: "numeric",
            })}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        </div>
        <DropdownMenuCustom
          options={ADMIN_DASHBOARD_RANGES}
          value={range}
          onValueChange={(value) =>
            setRange(value as AdminDashboardRange)
          }
        />
      </header>

      {dashboardQuery.isError && (
        <div className="rounded-xl border border-rose-200/20 bg-rose-950/30 p-4 text-sm text-rose-200">
          Could not load dashboard data. Please refresh to try again.
        </div>
      )}

      <section
        aria-label="Marketplace overview"
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="grid min-w-0 grid-rows-[auto_1fr_auto] gap-0 overflow-hidden">
              <CardHeader>
              <CardTitle className="flex-row flex gap-2 space-y-0 items-center justify-between text-sm font-medium text-muted-foreground">
                  {metric.label}
                  <span className="admin-metric-icon" style={{ color: metric.iconColor, backgroundColor: metric.iconBackground }}>
                    <Icon className="size-4" />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-14 wrap-break px-5 py-2 text-2xl font-semibold leading-tight tracking-tight">
                {isLoading ? (
                  <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
                ) : (
                  <AnimatedNumber
                    value={metric.value}
                    currency={metric.currency}
                    maximumFractionDigits={0}
                  />
                )}
              </CardContent>
              <CardFooter
                className={`min-h-10 border-0 bg-transparent px-5 pt-0 pb-4 text-xs leading-5 font-medium flex flex-wrap gap-x-0.5 gap-y-0 ${metric.pending ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}
              >
                {metric.pending && (
                  <Clock3 className="size-3.5 text-muted-foreground" />
                )}
                {metric.detail}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-1">
        <ChartAreaInteractive data={chartData} />
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-5">
        <PendingOrders />
        <PendingVendor />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="gap-4 py-5">
          <CardContent className="flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Boxes className="admin-info-icon size-4 text-amber-100" />
              </span>
              <div>
                <p className="text-sm font-medium">View Order Analytics</p>
                <p className="text-xs text-muted-foreground">
                  New listings need approval
                </p>
              </div>
            </div>
            <Link href="/admin/orders-ledger">
              <Button
                variant="ghost"
                size="icon"
                aria-label="View products to review"
              >
                <ArrowRight />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="gap-4 py-5">
          <CardContent className="flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Activity className="admin-info-icon size-4 text-amber-100" />
              </span>
              <div>
                <p className="text-sm font-medium">Vendor applications</p>
                <p className="text-xs text-muted-foreground">
                  Review new marketplace sellers
                </p>
              </div>
            </div>
            <Link href="/admin/vendors-users">
              <Button
                variant="ghost"
                size="icon"
                aria-label="View vendor applications"
              >
                <ArrowRight />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
