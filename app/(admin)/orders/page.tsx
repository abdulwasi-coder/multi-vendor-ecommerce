
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

type MockOrder = {
  id: string;
  vendor: string;
  date: string;
  status: "Paid" | "Processing" | "Completed" | "Refunded";
  vendorEarning: number;
  platformEarning: number;
};

// MOCK DATA: temporary examples for previewing the Admin Orders page UI.
// Replace this array and its derived stats with the real admin API response when available.
const mockVendorNames = [
  "Northstar Goods",
  "Juniper & Co.",
  "Fieldwork Supply",
  "Cedar House",
  "Sunday Market",
  "Common Ground",
  "Studio Wren",
  "Morrow Home",
];
const mockStatuses: MockOrder["status"][] = [
  "Completed",
  "Paid",
  "Processing",
  "Completed",
  "Paid",
];
const mockOrders: MockOrder[] = Array.from({ length: 60 }, (_, index) => {
  const vendorEarning = 84 + ((index * 73) % 640);
  const platformEarning = Math.round(vendorEarning * 0.12 * 100) / 100;
  const day = String(28 - (index % 28)).padStart(2, "0");

  return {
    id: `ORD-2025-${String(10482 + index).padStart(5, "0")}`,
    vendor: mockVendorNames[index % mockVendorNames.length],
    date: `2025-09-${day}`,
    status: mockStatuses[index % mockStatuses.length],
    vendorEarning,
    platformEarning,
  };
});

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});
const totalVendorEarnings = mockOrders.reduce(
  (total, order) => total + order.vendorEarning,
  0,
);
const totalPlatformEarnings = mockOrders.reduce(
  (total, order) => total + order.platformEarning,
  0,
);
const paidVendors = new Set(
  mockOrders
    .filter((order) => order.status === "Paid")
    .map((order) => order.vendor),
).size;

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
