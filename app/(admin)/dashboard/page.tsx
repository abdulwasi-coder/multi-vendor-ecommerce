
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
    cardHover: "hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-emerald-500/10 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/25",
    positive: true,
  },
  {
    label: "Total Benefit",
    value: "1,284",
    change: "+8.2%",
    detail: "vs. previous month",
    icon: ShoppingBag,
    iconTone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    cardHover: "hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-sky-500/10 dark:hover:border-sky-800 dark:hover:bg-sky-950/25",
    positive: true,
  },
  {
    label: "Total Customers",
    value: "86",
    change: "+4 new",
    detail: "this month",
    icon: Store,
    iconTone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    cardHover: "hover:border-violet-300 hover:bg-violet-50/70 hover:shadow-violet-500/10 dark:hover:border-violet-800 dark:hover:bg-violet-950/25",
    positive: true,
  },
  {
    label: "Total Vendors",
    value: "3,642",
    change: "+6.4%",
    detail: "vs. previous month",
    icon: Users,
    iconTone: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    cardHover: "hover:border-amber-300 hover:bg-amber-50/70 hover:shadow-amber-500/10 dark:hover:border-amber-800 dark:hover:bg-amber-950/25",
    positive: true,
  },
  {
    label: "Pending payouts",
    value: "$8,450",
    change: "12 requests",
    detail: "awaiting review",
    icon: Banknote,
    iconTone: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    cardHover: "hover:border-rose-300 hover:bg-rose-50/70 hover:shadow-rose-500/10 dark:hover:border-rose-800 dark:hover:bg-rose-950/25",
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
              Here&apos;s what&apos;s happening across your marketplace.
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
              <Card key={metric.label} className={`group h-full min-h-[184px] gap-4 rounded-2xl border-border/70 py-5 shadow-sm transition-all duration-300 ease-out hover:shadow-lg ${metric.cardHover}`}>
                <CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 space-y-0 px-5">
                  <CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">
                    {metric.label}
                  </CardTitle>
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 ease-out group-hover:scale-110 ${metric.iconTone}`}
                  >
                    <Icon className="size-6" strokeWidth={2.25} />
                  </span>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-2 px-5">
                  <div className="flex min-h-10 items-center text-3xl font-bold leading-none tracking-tight tabular-nums sm:text-[2rem]">
                    {metric.value}
                  </div>
                  <div className="flex min-h-10 flex-wrap content-center items-center gap-1.5 text-sm leading-snug">
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
