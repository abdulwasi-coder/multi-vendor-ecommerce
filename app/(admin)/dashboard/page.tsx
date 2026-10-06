
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Boxes,
  CircleDollarSign,
  Clock3,
  CreditCard,
  PackageCheck,
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
  CardDescription,
} from "@/components/ui/card";

import { DropdownMenuCustom, PendingOrders, PendingVendor } from "@/Otherfiles/dash_interactive";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";
import Link from "next/link";

const metrics = [
  {
    label: "Gross sales",
    value: "$48,294",
    change: "+12.8%",
    detail: "vs. previous month",
    icon: CircleDollarSign,
    iconTone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    positive: true,
  },
  {
    label: "Total Benefit",
    value: "1,284",
    change: "+8.2%",
    detail: "vs. previous month",
    icon: ShoppingBag,
    iconTone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    positive: true,
  },
  {
    label: "Total Customers",
    value: "86",
    change: "+4 new",
    detail: "this month",
    icon: Store,
    iconTone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    positive: true,
  },
  {
    label: "Total Vendors",
    value: "3,642",
    change: "+6.4%",
    detail: "vs. previous month",
    icon: Users,
    iconTone: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    positive: true,
  },
  {
    label: "Pending payouts",
    value: "$8,450",
    change: "12 requests",
    detail: "awaiting review",
    icon: Banknote,
    iconTone: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    positive: false,
  },
];

const timelines = ["1 Year", "6 Months", "1 Month"];

export default function AdminDashboardPage() {


  return (
    <main className="min-h-screen mx-auto max-w-400 space-y-5 w-full bg-muted/30 px-4 py-6 lg:py-3 sm:px-6  lg:px-8">
     
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Here's what's happening across your marketplace.
            </p>
          </div>
          <DropdownMenuCustom data={timelines} />
        </header>

        <section
          aria-label="Marketplace overview"
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
        >
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="gap-4 py-5">
                <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 px-5">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <span
                    className={`flex size-9 items-center justify-center rounded-lg ${metric.iconTone}`}
                  >
                    <Icon className="size-4" />
                  </span>
                </CardHeader>
                <CardContent className="space-y-2 px-5">
                  <div className="text-2xl font-semibold tracking-tight">
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {metric.positive ? (
                      <ArrowUpRight className="size-3.5 text-foreground" />
                    ) : (
                      <Clock3 className="size-3.5 text-muted-foreground" />
                    )}
                    <span
                      className={`font-medium ${metric.positive ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-muted-foreground">
                      {metric.detail}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid lg:grid-cols-1">
          <ChartAreaInteractive/>
        </section>

        <section className="grid gap-4 xl:grid-cols-7">
          <PendingOrders/>
          <PendingVendor/>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="gap-4 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Boxes className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm font-medium">View Order Analytics</p>
                  <p className="text-xs text-muted-foreground">
                    New listings need approval
                  </p>
                </div>
              </div>
              <Link href="/dashboard/products">
               
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
                  <Activity className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm font-medium">Vendor applications</p>
                  <p className="text-xs text-muted-foreground">
                    Review new marketplace sellers
                  </p>
                </div>
              </div>
              <Link href="/dashboard/ledger">
                
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
