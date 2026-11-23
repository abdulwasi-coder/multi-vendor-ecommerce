import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import type { AdminProduct } from "@/Otherfiles/tanstack/admin";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const shortId = (id?: string | null) =>
  id ? `#${String(id).slice(-8).toUpperCase()}` : "—";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function statusBadge(status?: string) {
  const normalized = (status ?? "").toLowerCase();
  const variant =
    normalized === "active"
      ? "default"
      : normalized === "banned"
        ? "destructive"
        : "secondary";
  return <Badge variant={variant}>{status ?? "unknown"}</Badge>;
}

export const adminProductColumns: ColumnDef<
  DataTableFeatures,
  AdminProduct
>[] = [
  {
    id: "image",
    header: "Image",
    cell: (info) => {
      const image = info.row.original.images?.[0];
      return image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={info.row.original.name ?? "Product"}
          className="size-10 rounded-md object-cover"
        />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
          No img
        </div>
      );
    },
  },
  {
    id: "name",
    header: "Name",
    cell: (info) => (
      <span className="font-medium">{info.row.original.name ?? "—"}</span>
    ),
  },
  {
    id: "price",
    header: "Price",
    cell: (info) => (
      <span className="font-medium">
        {currency.format(info.row.original.price ?? 0)}
      </span>
    ),
  },
  {
    id: "stock",
    header: "Stock",
    cell: (info) => (
      <span className="font-medium">{info.row.original.stock ?? 0}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (info) => statusBadge(info.row.original.status),
  },
  {
    id: "vendor",
    header: "Vendor",
    cell: (info) => {
      const product = info.row.original;
      return (
        <div>
          <span className="font-medium">
            {product.businessName || "Unnamed vendor"}
          </span>
          <span className="block text-xs font-normal text-muted-foreground">
            {shortId(product.vendorId)}
          </span>
        </div>
      );
    },
  },
  {
    id: "createdAt",
    header: "Created",
    cell: (info) => formatDate(info.row.original.createdAt),
  },
];
