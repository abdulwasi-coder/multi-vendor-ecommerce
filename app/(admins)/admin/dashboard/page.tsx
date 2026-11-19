import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Boxes,
  CircleDollarSign,
  Clock3,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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
import Link from "next/link";

const metrics = [
  {
    label: "Gross sales",
    value: "$48,294",
    change: "+12.8%",
    detail: "vs. previous month",
    icon: CircleDollarSign,
    positive: true,
    iconColor: "#f4cf70",
    iconBackground: "rgba(232,185,79,.14)",
  },
  {
    label: "Total Benefit",
    value: "1,284",
    change: "+8.2%",
    detail: "vs. previous month",
    icon: ShoppingBag,
    positive: true,
    iconColor: "#f2bd57",
    iconBackground: "rgba(217,155,56,.14)",
  },
  {
    label: "Total Customers",
    value: "86",
    change: "+4 new",
    detail: "this month",
    icon: Store,
    positive: true,
    iconColor: "#f7df9a",
    iconBackground: "rgba(247,223,154,.12)",
  },
  {
    label: "Total Vendors",
    value: "3,642",
    change: "+6.4%",
    detail: "vs. previous month",
    icon: Users,
    positive: true,
    iconColor: "#d9aa4b",
    iconBackground: "rgba(201,143,56,.16)",
  },
  {
    label: "Pending payouts",
    value: "$8,450",
    change: "12 requests",
    detail: "awaiting review",
    icon: Banknote,
    positive: false,
    iconColor: "#f3c76a",
    iconBackground: "rgba(232,185,79,.14)",
  },
];

const timelines = ["1 Year", "6 Months", "1 Month"];

export default async function AdminDashboardPage() {
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
        <DropdownMenuCustom data={timelines} />
      </header>

      <section
        aria-label="Marketplace overview"
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="gap-4 py-5">
              <CardHeader>
              <CardTitle className="flex-row flex gap-2 space-y-0 items-center justify-between text-sm font-medium text-muted-foreground">
                  {metric.label}
                  <span className="admin-metric-icon" style={{ color: metric.iconColor, backgroundColor: metric.iconBackground }}>
                    <Icon className="size-4" />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-2xl font-semibold tracking-tight px-5">
                {metric.value}
              </CardContent>
              <CardFooter
                className={`border-0 bg-background text-xs font-medium flex gap-0.5 ${metric.positive ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}
              >
                {metric.positive ? (
                  <ArrowUpRight className="size-3.5 text-emerald-500" />
                ) : (
                  <Clock3 className="size-3.5 text-muted-foreground" />
                )}
                {metric.change}{" "}
                <span className="text-muted-foreground">{metric.detail}</span>
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-1">
        <ChartAreaInteractive />
      </section>

      <section className="grid gap-4 xl:grid-cols-7">
        <PendingOrders />
        <PendingVendor />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="gap-4 py-5">
          <CardContent className="flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <Boxes className="size-4 text-amber-300" />
              </span>
              <div>
                <p className="text-sm font-medium">View Order Analytics</p>
                <p className="text-xs text-muted-foreground">
                  New listings need approval
                </p>
              </div>
            </div>
            <Link href="/orders-ledger">
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
                <Activity className="size-4 text-amber-300" />
              </span>
              <div>
                <p className="text-sm font-medium">Vendor applications</p>
                <p className="text-xs text-muted-foreground">
                  Review new marketplace sellers
                </p>
              </div>
            </div>
            <Link href="/vendors-users">
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
