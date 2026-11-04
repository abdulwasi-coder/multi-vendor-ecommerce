import Link from "next/link";
import { Eye, Package, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { VendorProduct } from "@/Otherfiles/tanstack/vendor-products";

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

export const vendorProductColumns: ColumnDef<DataTableFeatures, VendorProduct>[] =
  [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Link
            href={`/vendor/products/${product._id}`}
            className="group flex min-w-56 items-center gap-3"
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
        );
      },
    },
    {
      accessorKey: "categoryID",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {categoryName(row.original.categoryID)}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium">
          {money(row.original.price * (1 - row.original.discount / 100))}
          {row.original.discount > 0 && (
            <span className="ml-2 text-xs text-muted-foreground line-through">
              {money(row.original.price)}
            </span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => `${row.original.stock} units`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "active" ? "outline" : "secondary"}
          className={
            row.original.status === "active"
              ? "text-emerald-700"
              : "capitalize text-amber-700"
          }
        >
          {statusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row, table }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              size="sm"
              variant="outline"
              render={
                <Link
                  href={`/vendor/products/${product._id}`}
                  aria-label={`View ${product.name}`}
                  title={`View ${product.name}`}
                />
              }
            >
              <Eye className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              render={
                <Link
                  href={`/vendor/create?productID=${product._id}`}
                  aria-label={`Edit ${product.name}`}
                  title={`Edit ${product.name}`}
                />
              }
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => table.options.meta?.onDelete?.(product._id)}
              aria-label={`Delete ${product.name}`}
              title={`Delete ${product.name}`}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </div>
        );
      },
    },
  ];
