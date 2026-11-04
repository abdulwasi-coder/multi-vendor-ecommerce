"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  useTable,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ArrowDownToLine,
  Boxes,
  CircleAlert,
  PackageCheck,
  RotateCw,
  Search,
  Star,
} from "lucide-react";
import {
  prefetchVendorLogisticsPage,
  useVendorLogistics,
  type VendorLogisticsProduct,
  vendorLogisticsQueryKey,
} from "@/Otherfiles/tanstack/vendor-logistics";
import { features, type DataTableFeatures } from "@/components/ui/admin/data_table_feature";
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

const DEFAULT_PAGE_SIZE = 10;

const EMPTY_PRODUCTS: VendorLogisticsProduct[] = [];

const statusStyles = {
  Urgent: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Healthy: "border-emerald-200 bg-emerald-50 text-emerald-700",
} as const;

function getStockStatus(stock: number) {
  if (stock <= 5) return "Urgent";
  if (stock <= 15) return "Medium";
  return "Healthy";
}

const columns: ColumnDef<DataTableFeatures, VendorLogisticsProduct>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Link
          href={`/vendor/products/${product._id}`}
          className="group flex min-w-64 items-center gap-3"
        >
          {product.thumbnailImage?.publicId ? (
            <img
              src={product.thumbnailImage.publicId}
              alt=""
              className="size-12 shrink-0 rounded-lg border bg-muted object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="size-12 shrink-0 rounded-lg border bg-muted"
            />
          )}
          <span className="font-medium group-hover:underline">
            {product.name}
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.sku}
      </span>
    ),
  },
  {
    accessorKey: "Category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.Category}</span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <span>{row.original.stock} units</span>,
  },
  {
    id: "stockHealth",
    header: "Stock health",
    cell: ({ row }) => {
      const status = getStockStatus(row.original.stock);
      return (
        <Badge variant="outline" className={statusStyles[status]}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => `${row.original.discount}%`,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1 font-medium">
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        {row.original.rating.toFixed(1)}
      </span>
    ),
  },
];

export function VendorLogisticsTable() {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(search.trim().slice(0, 100)),
      300,
    );
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const query = useVendorLogistics(pageIndex + 1, pageSize, debouncedSearch);
  const products = query.data?.products ?? EMPTY_PRODUCTS;
  const totalPages = query.data?.totalPages ?? 1;
  const pagination: PaginationState = { pageIndex, pageSize };

  useEffect(() => {
    if (query.isPlaceholderData || !query.data) return;
    if (query.data.currentPage !== pageIndex + 1) {
      setPageIndex(query.data.currentPage - 1);
    }
  }, [pageIndex, query.data, query.isPlaceholderData]);

  useEffect(() => {
    if (
      query.isPlaceholderData ||
      !query.data ||
      pageIndex + 2 > totalPages
    ) {
      return;
    }

    void prefetchVendorLogisticsPage(
      queryClient,
      pageIndex + 2,
      pageSize,
      debouncedSearch,
    );
  }, [
    debouncedSearch,
    pageIndex,
    pageSize,
    query.data,
    query.isPlaceholderData,
    queryClient,
    totalPages,
  ]);

  const table = useTable<DataTableFeatures, VendorLogisticsProduct>({
    data: products,
    columns,
    features,
    manualFiltering: true,
    manualPagination: true,
    pageCount: totalPages,
    state: { pagination },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: vendorLogisticsQueryKey(pageIndex + 1, pageSize, debouncedSearch),
      exact: true,
    });
  };

  const metrics = [
    {
      label: "Total products",
      value: query.data?.totalProducts,
      detail: "Active products in your inventory",
      icon: Boxes,
    },
    {
      label: "Urgent stock",
      value: query.data?.statuses.urgentCount,
      detail: "5 units or fewer",
      icon: CircleAlert,
    },
    {
      label: "Medium stock",
      value: query.data?.statuses.mediumCount,
      detail: "6–15 units remaining",
      icon: ArrowDownToLine,
    },
    {
      label: "Healthy stock",
      value: query.data?.statuses.healthyCount,
      detail: "More than 15 units",
      icon: PackageCheck,
    },
  ];

  return (
    <>
      {query.isError && (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 py-5">
            <p role="alert" className="text-sm text-destructive">
              {query.error instanceof Error
                ? query.error.message
                : "Could not load inventory data."}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void query.refetch()}
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      )}

      <section
        aria-label="Inventory overview"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="gap-4 py-5">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5">
                <div>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">
                    {query.isPending || query.isError
                      ? "—"
                      : metric.value ?? 0}
                  </CardTitle>
                </div>
                <span className="rounded-lg bg-muted p-2.5">
                  <Icon className="size-4 text-muted-foreground" />
                </span>
              </CardHeader>
              <CardFooter className="bg-background px-5 text-xs text-muted-foreground">
                {metric.detail}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Product inventory</CardTitle>
            <CardDescription className="mt-1">
              Search active inventory by product, SKU, brand, or category.
            </CardDescription>
          </div>
          <Badge variant="outline">
            {query.isPending
              ? "Loading..."
              : query.isError
                ? "Inventory unavailable"
                : `${query.data.totalMatches} matching products`}
          </Badge>
        </CardHeader>
        <div className="border-b px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search inventory"
                placeholder="Search inventory"
                className="pl-9"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPageIndex(0);
                }}
              />
            </label>
            <label className="sr-only" htmlFor="vendor-logistics-page-size">
              Rows per page
            </label>
            <NativeSelect
              id="vendor-logistics-page-size"
              value={String(pageSize)}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPageIndex(0);
              }}
              aria-label="Rows per page"
              className="w-full sm:w-24"
            >
              <NativeSelectOption value="10">10</NativeSelectOption>
              <NativeSelectOption value="20">20</NativeSelectOption>
              <NativeSelectOption value="50">50</NativeSelectOption>
            </NativeSelect>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void handleRefresh()}
              disabled={query.isFetching}
              aria-label="Refresh inventory"
              title="Refresh inventory"
            >
              <RotateCw
                aria-hidden="true"
                className={query.isFetching ? "animate-spin" : ""}
              />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-11 whitespace-nowrap font-semibold text-muted-foreground"
                      >
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
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/30">
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
                      colSpan={columns.length}
                      className="h-28 text-center text-muted-foreground"
                    >
                      {query.isPending
                        ? "Loading inventory..."
                        : query.isError
                          ? "Inventory could not be loaded."
                          : debouncedSearch
                            ? "No matching products found."
                            : "No active products in your inventory."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {query.isPending || query.isError
              ? " "
              : `Showing ${query.data.totalMatches === 0 ? 0 : query.data.skipped + 1}-${Math.min(
                  query.data.skipped + products.length,
                  query.data.totalMatches,
                )} of ${query.data.totalMatches} matching products`}
          </p>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span>
              Page {query.data?.currentPage ?? pageIndex + 1} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={
                query.isPending || query.isError || !table.getCanPreviousPage()
              }
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={
                query.isPending || query.isError || !table.getCanNextPage()
              }
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
