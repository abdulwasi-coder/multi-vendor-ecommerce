"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowDown,
  ArrowUpRight,
  Eye,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useVendorProducts, type VendorProduct } from "@/Otherfiles/tanstack/vendor-products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );

function categoryName(category: VendorProduct["categoryID"]) {
  return typeof category === "string" ? category : category.name;
}

function statusLabel(status: VendorProduct["status"]) {
  return status === "archieved"
    ? "Archived"
    : status.charAt(0).toUpperCase() + status.slice(1);
}

export function VendorProductsTable() {
  const query = useVendorProducts();
  const products = query.data?.products ?? [];
  const summary = query.data?.summary;
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return products;

    return products.filter((product) =>
      [
        product.name,
        product.brand,
        product.sku,
        categoryName(product.categoryID),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [products, search]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-7 bg-muted/20 px-4 py-7 sm:px-7 lg:px-10">
      <header className="flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Store management / Catalog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Manage your catalog, keep an eye on stock, and make updates to your
            listings.
          </p>
        </div>
        <Link href="/vendor/create">
          <Button>
            Add product <Plus />
          </Button>
        </Link>
      </header>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Product summary"
      >
        {[
          {
            label: "Products listed",
            value: (summary?.totalProducts ?? 0).toString(),
            note: "Across your catalog",
            icon: Package,
          },
          {
            label: "Units in stock",
            value: (summary?.totalStock ?? 0).toString(),
            note: "Available to sell",
            icon: SlidersHorizontal,
          },
          {
            label: "Archived products",
            value: (summary?.archivedProducts ?? 0).toString(),
            note: "Not currently listed for sale",
            icon: Archive,
          },
          {
            label: "Low stock",
            value: (summary?.lowStockProducts ?? 0).toString(),
            note: "Fewer than 10 units",
            icon: ArrowDown,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="gap-4 py-5">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5">
                <div>
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">{item.value}</CardTitle>
                </div>
                <span className="rounded-lg bg-muted p-2.5">
                  <Icon className="size-4 text-muted-foreground" />
                </span>
              </CardHeader>
              <CardContent className="px-5 text-xs text-muted-foreground">
                {item.note}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All products</CardTitle>
            <CardDescription className="mt-1">
              Your store catalog and current inventory.
            </CardDescription>
          </div>
          <label className="relative min-w-0 flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search products"
              placeholder="Search products"
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.isPending ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      Loading your products...
                    </TableCell>
                  </TableRow>
                ) : query.isError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      <p role="alert" className="text-sm text-destructive">
                        {query.error instanceof Error
                          ? query.error.message
                          : "Could not load your products."}
                      </p>
                      <Button
                        className="mt-3"
                        size="sm"
                        variant="outline"
                        onClick={() => void query.refetch()}
                      >
                        Try again
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      {products.length === 0
                        ? "You have not added any products yet."
                        : "No products match your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="min-w-56 pl-6">
                        <Link
                          href={`/vendor/products/${product._id}`}
                          className="group flex items-center gap-3"
                        >
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted/70 text-muted-foreground">
                            <Package className="size-5" />
                          </div>
                          <span>
                            <span className="block font-medium group-hover:underline">
                              {product.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.sku} · {product.brand}
                            </span>
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {categoryName(product.categoryID)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {money(product.price * (1 - product.discount / 100))}
                        {product.discount > 0 && (
                          <span className="ml-2 text-xs text-muted-foreground line-through">
                            {money(product.price)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{product.stock} units</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === "active" ? "outline" : "secondary"
                          }
                          className={
                            product.status === "active"
                              ? "text-emerald-700"
                              : "capitalize text-amber-700"
                          }
                        >
                          {statusLabel(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="gap-0.5 pr-6 text-right">
                        <Link href={`/vendor/products/${product._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="size-4" />
                            <span className="sr-only">View {product.name}</span>
                          </Button>
                        </Link>
                        <Link
                          href={`/vendor/create?productID=${product._id}`}
                        >
                          <Button size="sm" variant="outline">
                            <ArrowUpRight className="size-4" />
                            <span className="sr-only">Edit {product.name}</span>
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t px-6 py-3 text-xs text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
