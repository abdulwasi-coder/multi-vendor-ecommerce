import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import type { AdminUser, AdminVendor } from "@/Otherfiles/tanstack/admin";

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

function vendorEmail(vendor: AdminVendor) {
  return typeof vendor.userid === "object" && vendor.userid
    ? vendor.userid.email
    : undefined;
}

function vendorUserId(vendor: AdminVendor) {
  return typeof vendor.userid === "object" && vendor.userid
    ? vendor.userid._id
    : typeof vendor.userid === "string"
      ? vendor.userid
      : undefined;
}

function statusBadge(status?: string) {
  const normalized = (status ?? "").toLowerCase();
  const variant =
    normalized === "active"
      ? "default"
      : normalized === "suspended"
        ? "destructive"
        : "secondary";
  return <Badge variant={variant}>{status ?? "unknown"}</Badge>;
}

export const adminVendorColumns: ColumnDef<
  DataTableFeatures,
  AdminVendor
>[] = [
  {
    id: "vendor",
    header: "Vendor",
    cell: (info) => {
      const vendor = info.row.original;
      return (
        <div>
          <span className="font-medium">
            {vendor.companyName || vendor.name || "Unnamed vendor"}
          </span>
          <span className="block text-xs font-normal text-muted-foreground">
            {vendor.storeSlug ? `@${vendor.storeSlug}` : shortId(vendor._id)}
          </span>
        </div>
      );
    },
  },
  {
    id: "contact",
    header: "Contact",
    cell: (info) => {
      const vendor = info.row.original;
      return (
        <div>
          <span className="block text-sm">{vendorEmail(vendor) ?? "—"}</span>
          <span className="block text-xs text-muted-foreground">
            {vendor.mobilenumber ?? ""}
          </span>
        </div>
      );
    },
  },
  {
    id: "country",
    header: "Country",
    cell: (info) => info.row.original.country ?? "—",
  },
  {
    id: "status",
    header: "Status",
    cell: (info) => statusBadge(info.row.original.status),
  },
  {
    id: "createdAt",
    header: "Joined",
    cell: (info) => formatDate(info.row.original.createdAt),
  },
  {
    id: "actions",
    header: "",
    cell: (info) => {
      const vendor = info.row.original;
      if (vendor.status !== "pending") return null;
      const meta = info.table.options.meta;
      const userId = vendorUserId(vendor);
      return (
        <Button
          size="sm"
          variant="outline"
          disabled={!userId}
          onClick={() => meta?.onApproveVendor?.(vendor, userId!)}
        >
          Approve
        </Button>
      );
    },
  },
];

export const adminUserColumns: ColumnDef<DataTableFeatures, AdminUser>[] = [
  {
    id: "user",
    header: "User",
    cell: (info) => (
      <div>
        <span className="font-medium">{info.row.original.name ?? "—"}</span>
        <span className="block text-xs font-normal text-muted-foreground">
          {shortId(info.row.original._id)}
        </span>
      </div>
    ),
  },
  {
    id: "email",
    header: "Email",
    cell: (info) => info.row.original.email ?? "—",
  },
  {
    id: "verified",
    header: "Verified",
    cell: (info) =>
      info.row.original.isEmailVerified ? (
        <Badge variant="default">Verified</Badge>
      ) : (
        <Badge variant="secondary">Unverified</Badge>
      ),
  },
  {
    id: "created_at",
    header: "Joined",
    cell: (info) => formatDate(info.row.original.created_at),
  },
];
