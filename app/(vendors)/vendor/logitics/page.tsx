import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CircleAlert,
  PackageCheck,
  Star,
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
import { products } from "@/lib/vendor-products";

const getStockStatus = (stock: number) => {
  if (stock <= 5) return "Urgent";
  if (stock <= 15) return "Medium";
  return "Healthy";
};

const statusStyles = {
  Urgent: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Healthy: "border-emerald-200 bg-emerald-50 text-emerald-700",
} as const;

export default function VendorLogisticsPage() {
  const metrics = [
    {
      label: "Total products",
      value: products.length,
      detail: "Products in your catalog",
      icon: Boxes,
      iconStyle: "bg-slate-100 text-slate-600",
    },
    {
      label: "Urgent stock",
      value: products.filter((product) => getStockStatus(product.stock) === "Urgent").length,
      detail: "5 units or fewer",
      icon: CircleAlert,
      iconStyle: "bg-red-50 text-red-600",
    },
    {
      label: "Medium stock",
      value: products.filter((product) => getStockStatus(product.stock) === "Medium").length,
      detail: "6–15 units remaining",
      icon: ArrowDownToLine,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      label: "Healthy stock",
      value: products.filter((product) => getStockStatus(product.stock) === "Healthy").length,
      detail: "More than 15 units",
      icon: PackageCheck,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-5 bg-muted/20 px-4 py-7 sm:px-7 lg:px-10">
      <header className="flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Store management / Inventory</p>
          <h1 className="text-3xl font-semibold tracking-tight">Logistics</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Monitor product availability and spot items that need a restock.
          </p>
        </div>
        <Link href="/vendor/products">
          Manage products <ArrowRight className="ml-2 size-4" />
        </Link>
      </header>

      <section
        aria-label="Marketplace overview"
        className="grid gap-4 xl:gap-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {metrics.map((metric) => {
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
                {metric.detail}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Product inventory</CardTitle>
            <CardDescription className="mt-1">
              Stock health, category, discounts, and customer ratings.
            </CardDescription>
          </div>
          <Badge variant="outline">{products.length} products</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead className="pr-6 text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const status = getStockStatus(product.stock);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="min-w-64 pl-6">
                        <Link href={`/vendor/products/${product.id}`} className="group flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="size-12 shrink-0 rounded-lg border bg-muted object-cover"
                          />
                          <span className="font-medium group-hover:underline">{product.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{product.id}</TableCell>
                      <TableCell className="text-muted-foreground">{product.categoryID}</TableCell>
                      <TableCell className="font-medium">{product.stock} units</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[status]}>{status}</Badge>
                      </TableCell>
                      <TableCell>{product.discount}%</TableCell>
                      <TableCell className="pr-6 text-right">
                        <span className="inline-flex items-center justify-end gap-1 font-medium">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-6 py-3 text-xs text-muted-foreground">
            Stock levels: urgent (5 or fewer), medium (6–15), and healthy (more than 15). Sample catalog data.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
