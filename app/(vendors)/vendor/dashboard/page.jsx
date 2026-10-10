import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CircleDollarSign,
  ClipboardList,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VendorSalesChart } from "@/components/vendor/vendor-sales-chart";

const summary = [
  { label: "Total sales", value: "$12,840", change: "+12.8%", note: "vs. last month", icon: CircleDollarSign, tone: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-300" },
  { label: "Orders", value: "184", change: "+8.2%", note: "vs. last month", icon: ClipboardList, tone: "text-sky-700 bg-sky-500/10 dark:text-sky-300" },
  { label: "Products", value: "36", change: "+3", note: "this month", icon: ShoppingBag, tone: "text-violet-700 bg-violet-500/10 dark:text-violet-300" },
  { label: "Ready to fulfill", value: "12", change: "Needs attention", note: "open orders", icon: PackageCheck, tone: "text-amber-700 bg-amber-500/10 dark:text-amber-300", pending: true },
];

const orders = [
  { id: "#ORD-2084", customer: "Olivia Rhye", date: "Oct 07, 2026", item: "Everyday Tote Bag", total: "$84.00", status: "Processing" },
  { id: "#ORD-2083", customer: "Phoenix Baker", date: "Oct 06, 2026", item: "Ceramic Pour-over Set", total: "$126.50", status: "Shipped" },
  { id: "#ORD-2082", customer: "Lana Steiner", date: "Oct 06, 2026", item: "Linen Table Runner", total: "$58.00", status: "Delivered" },
  { id: "#ORD-2081", customer: "Demi Wilkinson", date: "Oct 05, 2026", item: "Handmade Candle Trio", total: "$42.00", status: "Processing" },
  { id: "#ORD-2080", customer: "Candice Wu", date: "Oct 04, 2026", item: "Woven Market Basket", total: "$96.00", status: "Delivered" },
];

const messages = [
  { initials: "OR", name: "Olivia Rhye", text: "Can you confirm the color of my order?", time: "10 min ago", tone: "bg-rose-100 text-rose-700" },
  { initials: "PB", name: "Phoenix Baker", text: "Thanks! Looking forward to delivery.", time: "1 hr ago", tone: "bg-sky-100 text-sky-700" },
  { initials: "LS", name: "Lana Steiner", text: "I just placed another order.", time: "Yesterday", tone: "bg-violet-100 text-violet-700" },
];

function statusTone(status) {
  if (status === "Delivered") return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (status === "Shipped") return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300";
  return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
}

export default function VendorDashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1600px] space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Tuesday, October 7, 2026</p>
          <h1 className="text-2xl font-semibold tracking-tight">Vendor dashboard</h1>
          <p className="text-sm text-muted-foreground">A quick look at your store performance and latest activity.</p>
        </div>
        <Button className="w-fit" render={<Link href="/vendor/products/create" />}>Add a product <ArrowRight className="ml-2 size-4" /></Button>
      </header>

      <section aria-label="Store overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map(({ label, value, change, note, icon: Icon, tone, pending }) => (
          <Card key={label} className="rounded-2xl border-border/70 shadow-sm">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight tabular-nums">{value}</div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                {pending ? <ArrowDownRight className="size-3.5 text-amber-600" /> : <ArrowUpRight className="size-3.5 text-emerald-600" />}
                <span className={pending ? "font-medium text-amber-700 dark:text-amber-300" : "font-medium text-emerald-700 dark:text-emerald-300"}>{change}</span>
                <span>{note}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <Card className="min-w-0 rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Sales overview</CardTitle>
              <CardDescription className="mt-1">Your store sales over the last seven days</CardDescription>
            </div>
            <Badge variant="secondary" className="shrink-0">This week</Badge>
          </CardHeader>
          <CardContent><VendorSalesChart /></CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div><CardTitle>Recent messages</CardTitle><CardDescription className="mt-1">Latest customer conversations</CardDescription></div>
            <Badge variant="secondary">3 new</Badge>
          </CardHeader>
          <CardContent className="space-y-1">
            {messages.map((message) => (
              <div key={message.name} className="flex items-start gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted/70">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${message.tone}`}>{message.initials}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-medium">{message.name}</p><span className="shrink-0 text-xs text-muted-foreground">{message.time}</span></div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{message.text}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="mt-2 w-full" render={<Link href="/vendor/orders" />}>View customer activity</Button>
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><CardTitle>Recent orders</CardTitle><CardDescription className="mt-1">Track and fulfill your latest sales.</CardDescription></div>
          <Button variant="outline" size="sm" render={<Link href="/vendor/orders" />}>View all orders <ArrowRight className="ml-2 size-4" /></Button>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead className="pl-6">Order</TableHead><TableHead>Customer</TableHead><TableHead className="hidden md:table-cell">Date</TableHead><TableHead className="hidden lg:table-cell">Item</TableHead><TableHead>Total</TableHead><TableHead className="pr-6">Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {orders.map((order) => <TableRow key={order.id}>
                  <TableCell className="pl-6 font-medium">{order.id}</TableCell><TableCell>{order.customer}</TableCell><TableCell className="hidden text-muted-foreground md:table-cell">{order.date}</TableCell><TableCell className="hidden max-w-56 truncate text-muted-foreground lg:table-cell">{order.item}</TableCell><TableCell className="font-medium">{order.total}</TableCell><TableCell className="pr-6"><Badge variant="outline" className={statusTone(order.status)}>{order.status}</Badge></TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Dashboard figures and activity are sample data until connected to the vendor API.</p>
    </main>
  );
}
