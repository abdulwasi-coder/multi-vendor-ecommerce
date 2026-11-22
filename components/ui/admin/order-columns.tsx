import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import type {
  AdminOrderFeedItem,
  VendorLedgerEntry,
} from "@/Otherfiles/tanstack/admin";

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

function customerLabel(order: AdminOrderFeedItem) {
  const customer = order.customerID;
  if (customer && typeof customer === "object") {
    return customer.name || customer.email || shortId(customer._id);
  }
  return shortId(typeof customer === "string" ? customer : order._id);
}

function paymentStatusBadge(status?: string) {
  const normalized = (status ?? "").toLowerCase();
  const variant =
    normalized === "paid" || normalized === "delivered"
      ? "default"
      : normalized === "failed"
        ? "destructive"
        : "secondary";
  return <Badge variant={variant}>{status ?? "unknown"}</Badge>;
}

export const vendorLedgerColumns: ColumnDef<
  DataTableFeatures,
  VendorLedgerEntry
>[] = [
  {
    id: "vendor",
    header: "Vendor",
    cell: (info) => {
      const vendor = info.row.original;
      return (
        <div>
          <span className="font-medium">
            {vendor.BusinessName || "Unnamed vendor"}
          </span>
          <span className="block text-xs font-normal text-muted-foreground">
            {shortId(vendor.vendorID)}
          </span>
        </div>
      );
    },
  },
  {
    id: "grossSales",
    header: "Gross sales",
    cell: (info) => (
      <span className="font-medium">
        {currency.format(info.row.original.grossSales ?? 0)}
      </span>
    ),
  },
  {
    id: "vendorPayoutBalance",
    header: "Vendor earning",
    cell: (info) => (
      <span className="font-medium">
        {currency.format(info.row.original.vendorPayoutBalance ?? 0)}
      </span>
    ),
  },
  {
    id: "platfromRevenue",
    header: "Platform revenue",
    cell: (info) => (
      <span className="font-medium">
        {currency.format(info.row.original.platfromRevenue ?? 0)}
      </span>
    ),
  },
  {
    id: "orderCount",
    header: "Order count",
    cell: (info) => (
      <span className="font-medium">{info.row.original.orderCount ?? 0}</span>
    ),
  },
];

export const adminOrderColumns: ColumnDef<
  DataTableFeatures,
  AdminOrderFeedItem
>[] = [
  {
    id: "order",
    header: "Order",
    cell: (info) => {
      const order = info.row.original;
      return (
        <div>
          <span className="font-medium">{shortId(order._id)}</span>
          <span className="block text-xs font-normal text-muted-foreground">
            {order.paymentIntentId
              ? `PI ${String(order.paymentIntentId).slice(0, 12)}…`
              : "—"}
          </span>
        </div>
      );
    },
  },
  {
    id: "customer",
    header: "Customer",
    cell: (info) => customerLabel(info.row.original),
  },
  {
    id: "paymentMethod",
    header: "Payment method",
    cell: (info) => info.row.original.paymentMethod ?? "—",
  },
  {
    id: "paymentStatus",
    header: "Status",
    cell: (info) => paymentStatusBadge(info.row.original.paymentStatus),
  },
  {
    id: "createdAt",
    header: "Date",
    cell: (info) => formatDate(info.row.original.createdAt),
  },
  {
    id: "totalPrice",
    header: "Amount",
    cell: (info) => (
      <span className="text-right font-medium">
        {currency.format(info.row.original.totalPrice ?? 0)}
      </span>
    ),
  },
];
