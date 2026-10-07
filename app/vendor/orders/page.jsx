import {
  BadgeDollarSign,
  CircleDollarSign,
  ClipboardList,
  Store,
  TrendingUp,
  CircleHelp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VendorAnalyzes, ViewingOrder } from "@/Otherfiles/Order_interactive";

const stats = [
  {
    title: "Paid vendors",
    value: paidVendors.toLocaleString(),
    description: "Vendors with paid orders",
    icon: Store,
  },
  {
    title: "Average net earning",
    value: currency.format(totalVendorEarnings / mockOrders.length),
    description: "Average vendor share per order",
    icon: TrendingUp,
  },
  {
    title: "Total earnings",
    value: currency.format(totalVendorEarnings + totalPlatformEarnings),
    description: "Vendor and platform earnings",
    icon: CircleDollarSign,
  },
  {
    title: "Orders processed",
    value: mockOrders.length.toLocaleString(),
    description: "Orders in this preview",
    icon: ClipboardList,
  },
  {
    title: "Total orders",
    value: mockOrders.length.toLocaleString(),
    description: "All orders in this preview",
    icon: BadgeDollarSign,
  },
];

export default function AdminOrdersPage() {

  return (
    <main className="min-h-screen w-full bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-400 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">
              Marketplace operations
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
            <p className="text-sm text-muted-foreground">
              Review order activity and vendor earnings across the marketplace.
            </p>
          </div>
          <Badge
            variant="outline"
            className="h-8 w-fit gap-1.5 border-indigo-200 bg-indigo-50 px-3 font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <CircleHelp className="size-3.5" /> Mock preview
          </Badge>
        </header>

        <section
          aria-label="Marketplace overview"
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {stats.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="gap-4 py-5">
                <CardHeader>
                  <CardTitle className="flex-row flex gap-2 space-y-0 items-center justify-between text-sm font-medium text-muted-foreground">
                    {metric.title}
                    <div className="bg-indigo-800 size-7 flex items-center justify-center rounded-full">
                      <Icon className=" text-indigo-400 size-4" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-2xl font-semibold tracking-tight ">
                  {metric.value}
                </CardContent>
                <CardFooter className="bg-background border-none">{metric.description}</CardFooter>
              </Card>
            );
          })}
        </section>
        <VendorAnalyzes/>
        <ViewingOrder/>
      </div>
    </main>
  );
}
