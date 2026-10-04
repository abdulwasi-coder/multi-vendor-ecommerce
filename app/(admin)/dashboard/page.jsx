"use client"

import { useMemo, useState } from "react"
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
  Download,
  Ellipsis,
  Eye,
  PackageCheck,
  Search,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
    label: "Total orders",
    value: "1,284",
    change: "+8.2%",
    detail: "vs. previous month",
    icon: ShoppingBag,
    iconTone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    positive: true,
  },
  {
    label: "Active vendors",
    value: "86",
    change: "+4 new",
    detail: "this month",
    icon: Store,
    iconTone: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    positive: true,
  },
  {
    label: "Customers",
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
]

const monthlySales = [
  { month: "May 1", sales: 8200 },
  { month: "May 5", sales: 11200 },
  { month: "May 9", sales: 9400 },
  { month: "May 13", sales: 15800 },
  { month: "May 17", sales: 13200 },
  { month: "May 21", sales: 18400 },
  { month: "May 25", sales: 16100 },
  { month: "May 29", sales: 22400 },
  { month: "May 31", sales: 19800 },
]

const orderDistribution = [
  { name: "Delivered", value: 68, fill: "oklch(0.62 0.15 158)" },
  { name: "Processing", value: 21, fill: "oklch(0.76 0.15 78)" },
  { name: "Cancelled", value: 11, fill: "oklch(0.65 0.19 25)" },
]

const salesChartConfig = { sales: { label: "Sales", color: "oklch(0.56 0.13 160)" } }
const orderChartConfig = {
  Delivered: { label: "Delivered", color: "oklch(0.62 0.15 158)" },
  Processing: { label: "Processing", color: "oklch(0.76 0.15 78)" },
  Cancelled: { label: "Cancelled", color: "oklch(0.65 0.19 25)" },
}

const orders = [
  { id: "#ORD-8294", customer: "Olivia Martin", vendor: "Northstar Goods", date: "May 31, 2025", amount: "$248.00", status: "Delivered" },
  { id: "#ORD-8293", customer: "Jackson Lee", vendor: "Field & Form", date: "May 31, 2025", amount: "$129.50", status: "Processing" },
  { id: "#ORD-8292", customer: "Isabella Nguyen", vendor: "Mono Studio", date: "May 30, 2025", amount: "$384.00", status: "Delivered" },
  { id: "#ORD-8291", customer: "William Kim", vendor: "Northstar Goods", date: "May 30, 2025", amount: "$76.25", status: "Processing" },
  { id: "#ORD-8290", customer: "Sofia Davis", vendor: "Sunday Supply", date: "May 29, 2025", amount: "$212.00", status: "Cancelled" },
]

const activity = [
  { icon: Store, title: "New vendor application", detail: "Morrow Home submitted an application", time: "12 min ago" },
  { icon: CreditCard, title: "Payout request received", detail: "Northstar Goods · $1,240.00", time: "38 min ago" },
  { icon: PackageCheck, title: "Order marked as delivered", detail: "Order #ORD-8288 · Field & Form", time: "1 hour ago" },
  { icon: BadgeCheck, title: "Vendor approved", detail: "Sunday Supply is now active", time: "3 hours ago" },
]

const currency = (value) => `$${Number(value).toLocaleString("en-US")}`

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState("This month")
  const [search, setSearch] = useState("")
  const filteredOrders = useMemo(
    () => orders.filter((order) =>
      `${order.id} ${order.customer} ${order.vendor} ${order.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
    [search],
  )

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sunday, May 31, 2025</p>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening across your marketplace.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This week">This week</SelectItem>
                <SelectItem value="This month">This month</SelectItem>
                <SelectItem value="This year">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-background">
              <Download />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </header>

        <section aria-label="Marketplace overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.label} className="gap-4 py-5">
                <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 px-5">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                  <span className={`flex size-9 items-center justify-center rounded-lg ${metric.iconTone}`}>
                    <Icon className="size-4" />
                  </span>
                </CardHeader>
                <CardContent className="space-y-2 px-5">
                  <div className="text-2xl font-semibold tracking-tight">{metric.value}</div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {metric.positive ? <ArrowUpRight className="size-3.5 text-foreground" /> : <Clock3 className="size-3.5 text-muted-foreground" />}
                    <span className={`font-medium ${metric.positive ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>{metric.change}</span>
                    <span className="text-muted-foreground">{metric.detail}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle>Sales overview</CardTitle>
                <CardDescription>Marketplace sales performance during May</CardDescription>
              </div>
              <Button variant="ghost" size="icon" aria-label="More sales options"><Ellipsis /></Button>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight">$48,294</span>
                <span className="inline-flex items-center text-xs font-medium text-muted-foreground"><ArrowUpRight className="mr-0.5 size-3.5" />12.8%</span>
              </div>
              <ChartContainer config={salesChartConfig} className="h-[260px] w-full">
                  <AreaChart data={monthlySales} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-sales)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickMargin={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip content={<ChartTooltipContent formatter={(value) => currency(value)} />} />
                    <Area type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} fill="url(#salesFill)" activeDot={{ r: 4, fill: "var(--color-sales)" }} />
                  </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order status</CardTitle>
              <CardDescription>Breakdown of all marketplace orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ChartContainer config={orderChartConfig} className="h-[210px] w-full">
                  <PieChart>
                    <Pie data={orderDistribution} dataKey="value" nameKey="name" innerRadius={63} outerRadius={88} paddingAngle={3} strokeWidth={0} />
                    <Tooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                  </PieChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-semibold">1,284</span>
                  <span className="text-xs text-muted-foreground">Total orders</span>
                </div>
              </div>
              <div className="mt-3 space-y-3">
                {orderDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full" style={{ backgroundColor: item.fill }} />{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Track the latest purchases across all vendors</CardDescription>
              </div>
              <div className="relative w-full sm:w-60">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders..." className="pl-9" aria-label="Search orders" />
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Vendor</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length ? filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">{order.vendor}</TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">{order.date}</TableCell>
                      <TableCell className="font-medium">{order.amount}</TableCell>
                      <TableCell className="pr-6"><Badge variant="secondary" className={order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : order.status === "Processing" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300" : "bg-rose-500/10 text-rose-700 dark:text-rose-300"}>{order.status}</Badge></TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No orders match your search.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
                <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                <Button variant="ghost" size="sm" className="-mr-2">View all <ArrowRight /></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Latest marketplace updates</CardDescription>
              </div>
              <Button variant="ghost" size="icon" aria-label="More activity options"><Ellipsis /></Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {activity.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="flex gap-3">
                    <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                      {index < activity.length - 1 && <span className="absolute top-9 left-1/2 h-5 w-px -translate-x-1/2 bg-border" />}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-sm font-medium leading-5">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <span className="shrink-0 pt-0.5 text-[11px] text-muted-foreground">{item.time}</span>
                  </div>
                )
              })}
              <Button variant="outline" className="w-full">View activity <Eye /></Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="gap-4 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted"><Boxes className="size-4 text-muted-foreground" /></span>
                <div><p className="text-sm font-medium">Products to review</p><p className="text-xs text-muted-foreground">New listings need approval</p></div>
              </div>
              <div className="flex items-center gap-2"><Badge variant="secondary">8 pending</Badge><Button variant="ghost" size="icon" aria-label="View products to review"><ArrowRight /></Button></div>
            </CardContent>
          </Card>
          <Card className="gap-4 py-5">
            <CardContent className="flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted"><Activity className="size-4 text-muted-foreground" /></span>
                <div><p className="text-sm font-medium">Vendor applications</p><p className="text-xs text-muted-foreground">Review new marketplace sellers</p></div>
              </div>
              <div className="flex items-center gap-2"><Badge variant="secondary">3 pending</Badge><Button variant="ghost" size="icon" aria-label="View vendor applications"><ArrowRight /></Button></div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
