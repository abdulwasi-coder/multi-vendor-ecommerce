import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive";

const summary = [
  {
    label: "Total sales",
    value: "$12,840",
    change: "+12.8%",
    icon: CircleDollarSign,
  },
  {
    label: "Total Benefit",
    value: "184",
    change: "+8.2%",
    icon: ClipboardList,
  },
  {
    label: "Total Orders",
    value: "12",
    change: "Needs attention",
    icon: PackageCheck,
    pending: true,
  },
  {
    label: "Fullfilled Orders",
    value: "184",
    change: "+8.2%",
    icon: ClipboardList,
  },
  {
    label: "Processing Orders",
    value: "36",
    change: "+3",
    icon: ShoppingBag,
  },
  {
    label: "Cancelled Orders",
    value: "12",
    change: "Needs attention",
    icon: PackageCheck,
    pending: true,
  },
];

const orders = [
  {
    id: "#ORD-2084",
    customer: "Olivia Rhye",
    date: "Oct 07, 2026",
    item: "Everyday Tote Bag",
    total: "$84.00",
    status: "Processing",
  },
  {
    id: "#ORD-2083",
    customer: "Phoenix Baker",
    date: "Oct 06, 2026",
    item: "Ceramic Pour-over Set",
    total: "$126.50",
    status: "Shipped",
  },
  {
    id: "#ORD-2082",
    customer: "Lana Steiner",
    date: "Oct 06, 2026",
    item: "Linen Table Runner",
    total: "$58.00",
    status: "Delivered",
  },
  {
    id: "#ORD-2081",
    customer: "Demi Wilkinson",
    date: "Oct 05, 2026",
    item: "Handmade Candle Trio",
    total: "$42.00",
    status: "Processing",
  },
  {
    id: "#ORD-2080",
    customer: "Candice Wu",
    date: "Oct 04, 2026",
    item: "Woven Market Basket",
    total: "$96.00",
    status: "Delivered",
  },
];

export default function VendorDashboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Tuesday, October 7, 2026
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Vendor dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            A quick look at your store performance and latest activity.
          </p>
        </div>

        <Link href="/vendor/products/create" className="w-fit">
          {" "}
          Add a product <ArrowRight className="ml-2 size-4" />
        </Link>
      </header>

      <section
        aria-label="Marketplace overview"
        className="grid gap-4 xl:gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
      >
        {summary.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className=" grid grid-rows-[30_30_40]">
              <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between text-sm font-medium text-muted-foreground">
                  {metric.label}

                  <Icon className="size-4" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-2xl font-semibold tracking-tight px-5">
                {metric.value}
              </CardContent>
              <CardFooter
                className={`border-0 bg-background text-xs pr-1 overflow-visible font-medium flex gap-0.5`}
              >
                <ArrowUpRight className="size-3 text-emerald-900" /> 10% vs
                previous month
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <section className="grid lg:grid-cols-1">
        <ChartAreaInteractive />
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription className="mt-1">
              Track and fulfill your latest sales.
            </CardDescription>
          </div>

          <Link href="/vendor/orders">
            {" "}
            <Button variant="outline" size="sm">
              View all orders <ArrowRight className="ml-2 size-4" />
            </Button>{" "}
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
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="pl-6 font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {order.date}
                    </TableCell>
                    <TableCell className="hidden max-w-56 truncate text-muted-foreground lg:table-cell">
                      {order.item}
                    </TableCell>
                    <TableCell className="font-medium">{order.total}</TableCell>
                    <TableCell className="pr-6">
                      <Badge variant="outline">{order.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Dashboard figures and activity are sample data until connected to the
        vendor API.
      </p>
    </main>
  );
}
