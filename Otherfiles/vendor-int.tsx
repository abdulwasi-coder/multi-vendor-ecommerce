"use client";

import { useDeferredValue, useState } from "react";
import { flexRender, useTable } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  Store,
  Users,
} from "lucide-react";
import {
  useAdminUsers,
  useAdminVendors,
  useApproveVendor,
  type AdminUser,
  type AdminVendor,
} from "@/Otherfiles/tanstack/admin";
import {
  features,
  type DataTableFeatures,
} from "@/components/ui/admin/data_table_feature";
import {
  adminUserColumns,
  adminVendorColumns,
} from "@/components/ui/admin/vendor-columns";

const PAGE_SIZE = 10;

const VENDOR_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

type Tab = "vendors" | "users";

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft /> Prev
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

function TableStateRow({
  colSpan,
  isPending,
  isError,
  pendingLabel,
  errorLabel,
  emptyLabel,
  hasFilter,
}: {
  colSpan: number;
  isPending: boolean;
  isError: boolean;
  pendingLabel: string;
  errorLabel: string;
  emptyLabel: string;
  hasFilter: boolean;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="py-8 text-center text-muted-foreground"
      >
        {isPending ? pendingLabel : isError ? errorLabel : hasFilter ? "No results match your filters." : emptyLabel}
      </TableCell>
    </TableRow>
  );
}

function VendorsPanel() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const vendorsQuery = useAdminVendors(page, PAGE_SIZE, status);
  const approveVendor = useApproveVendor();

  const vendors = vendorsQuery.data?.vendors ?? [];

  const table = useTable<DataTableFeatures, AdminVendor>({
    data: vendors,
    columns: adminVendorColumns,
    features,
    manualPagination: true,
    pageCount: vendorsQuery.data?.totalPages ?? 1,
    meta: {
      onApproveVendor: (vendor, userId) =>
        approveVendor.mutate(
          { vendorId: vendor._id, userId },
          {
            onSuccess: (data) =>
              toast.success(data.message ?? "Vendor approved."),
            onError: () => toast.error("Could not approve the vendor."),
          },
        ),
    },
    state: {
      pagination: { pageIndex: page - 1, pageSize: PAGE_SIZE },
    },
  });

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Store className="size-4" /> Vendors
          </CardTitle>
          <CardDescription>
            {vendorsQuery.data
              ? `${vendorsQuery.data.totalVendors} vendor${vendorsQuery.data.totalVendors === 1 ? "" : "s"} registered`
              : "Review and approve marketplace vendors."}
          </CardDescription>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <NativeSelect
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Filter vendors by status"
          >
            {VENDOR_STATUS_OPTIONS.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Button
            variant="outline"
            size="icon"
            onClick={() => vendorsQuery.refetch()}
            disabled={vendorsQuery.isRefetching}
            aria-label="Reload vendors"
          >
            <RefreshCw
              className={vendorsQuery.isRefetching ? "animate-spin" : ""}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="w-full min-w-0 overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {vendorsQuery.isPending || vendorsQuery.isError ? (
                <TableStateRow
                  colSpan={adminVendorColumns.length}
                  isPending={vendorsQuery.isPending}
                  isError={vendorsQuery.isError}
                  pendingLabel="Loading vendors..."
                  errorLabel="Could not load vendors."
                  emptyLabel="No vendors yet."
                  hasFilter={Boolean(status)}
                />
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableStateRow
                  colSpan={adminVendorColumns.length}
                  isPending={false}
                  isError={false}
                  pendingLabel=""
                  errorLabel=""
                  emptyLabel="No vendors yet."
                  hasFilter={Boolean(status)}
                />
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          page={page}
          totalPages={vendorsQuery.data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}

function UsersPanel() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const usersQuery = useAdminUsers(page, PAGE_SIZE, deferredSearch);

  const users = usersQuery.data?.users ?? [];

  const table = useTable<DataTableFeatures, AdminUser>({
    data: users,
    columns: adminUserColumns,
    features,
    manualPagination: true,
    pageCount: usersQuery.data?.totalPages ?? 1,
    state: {
      pagination: { pageIndex: page - 1, pageSize: PAGE_SIZE },
    },
  });

  const hasFilter = Boolean(search.trim());

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" /> Users
          </CardTitle>
          <CardDescription>
            {usersQuery.data
              ? `${usersQuery.data.totalUsers} customer${usersQuery.data.totalUsers === 1 ? "" : "s"} registered`
              : "Review registered marketplace users."}
          </CardDescription>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search users..."
              className="pl-9"
              aria-label="Search users"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => usersQuery.refetch()}
            disabled={usersQuery.isRefetching}
            aria-label="Reload users"
          >
            <RefreshCw
              className={usersQuery.isRefetching ? "animate-spin" : ""}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="w-full min-w-0 overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {usersQuery.isPending || usersQuery.isError ? (
                <TableStateRow
                  colSpan={adminUserColumns.length}
                  isPending={usersQuery.isPending}
                  isError={usersQuery.isError}
                  pendingLabel="Loading users..."
                  errorLabel="Could not load users."
                  emptyLabel="No users yet."
                  hasFilter={hasFilter}
                />
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableStateRow
                  colSpan={adminUserColumns.length}
                  isPending={false}
                  isError={false}
                  pendingLabel=""
                  errorLabel=""
                  emptyLabel="No users yet."
                  hasFilter={hasFilter}
                />
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          page={page}
          totalPages={usersQuery.data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}

export function ViewingAllUser() {
  const [tab, setTab] = useState<Tab>("vendors");

  return (
    <div className="space-y-4">
      <div className="flex w-fit items-center gap-1 rounded-lg border border-white/8 bg-[#202020] p-1">
        <Button
          type="button"
          variant={tab === "vendors" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTab("vendors")}
        >
          <Store className="size-4" /> Vendors
        </Button>
        <Button
          type="button"
          variant={tab === "users" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTab("users")}
        >
          <Users className="size-4" /> Users
        </Button>
      </div>
      {tab === "vendors" ? <VendorsPanel /> : <UsersPanel />}
    </div>
  );
}
