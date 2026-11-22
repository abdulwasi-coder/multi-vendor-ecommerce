"use client"

import { useState } from "react";
import { flexRender, useTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  RefreshCw,
  Search,
  Store,
  TrendingUp,
} from "lucide-react";
import {
  useAdminOrderFeed,
  useApproveVendorPayout,
  useVendorBalanceLedger,
  type AdminOrderFeedItem,
  type VendorLedgerEntry,
} from "@/Otherfiles/tanstack/admin";
import { toast } from "sonner";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  features,
  type DataTableFeatures,
} from "@/components/ui/admin/data_table_feature";
import {
  adminOrderColumns,
  vendorLedgerColumns,
} from "@/components/ui/admin/order-columns";

const PAGE_SIZE = 10;

function ReloadButton({
  onReload,
  isReloading,
}: {
  onReload: () => void;
  isReloading: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onReload}
      disabled={isReloading}
      aria-label="Reload data"
    >
      <RefreshCw className={isReloading ? "animate-spin" : ""} />
    </Button>
  );
}

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

function SearchBox({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={ariaLabel}
      />
    </div>
  );
}

export function AdminOrdersLedger() {
  const [vendorPage, setVendorPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [vendorSearch, setVendorSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  const ledgerQuery = useVendorBalanceLedger(PAGE_SIZE, true, vendorPage);
  const feedQuery = useAdminOrderFeed(orderPage, PAGE_SIZE);
  const approvePayout = useApproveVendorPayout();

  const summary = ledgerQuery.data?.summaryStats?.[0];
  const vendors = ledgerQuery.data?.vendorsData ?? [];
  const orders = feedQuery.data?.orders ?? [];

  const filteredVendors = vendors.filter((vendor: VendorLedgerEntry) =>
    [vendor.BusinessName, vendor.vendorID]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(vendorSearch.trim().toLowerCase()),
  );

  const filteredOrders = orders.filter((order) =>
    [
      order._id,
      typeof order.customerID === "object" && order.customerID
        ? order.customerID.name || order.customerID.email
        : order.customerID,
      order.paymentMethod,
      order.paymentStatus,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(orderSearch.trim().toLowerCase()),
  );

  const vendorTable = useTable<DataTableFeatures, VendorLedgerEntry>({
    data: filteredVendors,
    columns: vendorLedgerColumns,
    features,
    manualPagination: true,
    pageCount: ledgerQuery.data?.totalPages ?? 1,
    meta: {
      onApprove: (vendorId: string) =>
        approvePayout.mutate(vendorId, {
          onSuccess: (data) =>
            toast.success(
              `Payout approved — ${data.updated} order${data.updated === 1 ? "" : "s"} marked as paid.`,
            ),
          onError: () => toast.error("Could not approve the payout."),
        }),
    },
    state: {
      pagination: { pageIndex: vendorPage - 1, pageSize: PAGE_SIZE },
    },
  });

  const orderTable = useTable<DataTableFeatures, AdminOrderFeedItem>({
    data: filteredOrders,
    columns: adminOrderColumns,
    features,
    manualPagination: true,
    pageCount: feedQuery.data?.totalPages ?? 1,
    state: {
      pagination: { pageIndex: orderPage - 1, pageSize: PAGE_SIZE },
    },
  });

  const stats = [
    {
      title: "Active vendors",
      value: summary?.totalVendors ?? ledgerQuery.data?.totalVendors ?? 0,
      currency: undefined,
      description: "Vendors with pending payouts",
      icon: Store,
    },
    {
      title: "Average net earning",
      value: summary?.avgNetEarning ?? 0,
      currency: "USD",
      description: "Average vendor share per order",
      icon: TrendingUp,
    },
    {
      title: "Platform revenue",
      value: summary?.TotalGrossEarnedFromVendors ?? 0,
      currency: "USD",
      description: "Commission earned from vendors",
      icon: CircleDollarSign,
    },
    {
      title: "Orders processed",
      value: summary?.TotalOrdersProcessed ?? 0,
      currency: undefined,
      description: "Vendor suborders tracked",
      icon: ClipboardList,
    },
    {
      title: "Total orders",
      value: feedQuery.data?.totalOrders ?? 0,
      currency: undefined,
      description: "Customer orders placed",
      icon: BadgeDollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <section
        aria-label="Marketplace overview"
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {stats.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.title}
              className="grid min-w-0 grid-rows-[auto_1fr_auto] gap-0 overflow-hidden"
            >
              <CardHeader>
                <CardTitle className="flex-row flex gap-2 space-y-0 items-center justify-between text-sm font-medium text-muted-foreground">
                  {metric.title}
                  <div className="admin-stat-icon flex size-8 items-center justify-center rounded-lg bg-amber-300/10">
                    <Icon className="size-4 text-amber-100" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-14 break-words px-5 py-2 text-2xl font-semibold leading-tight tracking-tight">
                <AnimatedNumber
                  value={metric.value}
                  currency={metric.currency}
                  maximumFractionDigits={metric.currency ? 2 : 0}
                />
              </CardContent>
              <CardFooter className="min-h-10 border-0 bg-transparent px-5 pt-0 pb-4 text-xs leading-5 text-muted-foreground">
                {metric.description}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Pending Vendor Payouts</CardTitle>
            <CardDescription>
              Delivered, unpaid orders whose payout date has passed
            </CardDescription>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <SearchBox
              value={vendorSearch}
              onChange={setVendorSearch}
              placeholder="Search vendors..."
              ariaLabel="Search vendors"
            />
            <ReloadButton
              onReload={() => ledgerQuery.refetch()}
              isReloading={ledgerQuery.isRefetching}
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="w-full min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                {vendorTable.getHeaderGroups().map((headerGroup) => (
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
                {ledgerQuery.isPending || ledgerQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={vendorLedgerColumns.length}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {ledgerQuery.isPending
                        ? "Loading vendor balances..."
                        : "Could not load vendor balances."}
                    </TableCell>
                  </TableRow>
                ) : vendorTable.getRowModel().rows.length ? (
                  vendorTable.getRowModel().rows.map((row) => (
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
                  <TableRow>
                    <TableCell
                      colSpan={vendorLedgerColumns.length}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {vendorSearch
                        ? "No vendors match your search."
                        : "No pending vendor payouts."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={vendorPage}
            totalPages={ledgerQuery.data?.totalPages ?? 1}
            onPageChange={setVendorPage}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Order Feed</CardTitle>
            <CardDescription>
              Recent customer orders across the marketplace
            </CardDescription>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <SearchBox
              value={orderSearch}
              onChange={setOrderSearch}
              placeholder="Search orders..."
              ariaLabel="Search orders"
            />
            <ReloadButton
              onReload={() => feedQuery.refetch()}
              isReloading={feedQuery.isRefetching}
            />
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <div className="w-full min-w-0 overflow-x-auto">
            <Table>
              <TableHeader>
                {orderTable.getHeaderGroups().map((headerGroup) => (
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
                {feedQuery.isPending || feedQuery.isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={adminOrderColumns.length}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {feedQuery.isPending
                        ? "Loading orders..."
                        : "Could not load orders."}
                    </TableCell>
                  </TableRow>
                ) : orderTable.getRowModel().rows.length ? (
                  orderTable.getRowModel().rows.map((row) => (
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
                  <TableRow>
                    <TableCell
                      colSpan={adminOrderColumns.length}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {orderSearch
                        ? "No orders match your search."
                        : "No orders yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={orderPage}
            totalPages={feedQuery.data?.totalPages ?? 1}
            onPageChange={setOrderPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
