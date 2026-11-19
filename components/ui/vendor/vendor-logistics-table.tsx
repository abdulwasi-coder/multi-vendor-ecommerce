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
  Download,
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
import api from "@/lib/axios";
import { downloadCsv } from "@/lib/vendor-csv";
import { toast } from "sonner";
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
  Urgent: "border-red-400/20 bg-red-400/10 text-red-300",
  Medium: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  Healthy: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
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
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExport = async () => {
    if (isExporting || !query.data || query.isFetching || query.isPlaceholderData) return;
    setIsExporting(true);
    try {
      const allProducts: VendorLogisticsProduct[] = [];
      for (let page = 1; page <= query.data.totalPages; page += 1) {
        const response = await api.get<{
          success: boolean;
          message?: string;
          products?: VendorLogisticsProduct[];
        }>("/vendor/LogisticData", {
          params: { page, limit: pageSize, skip: (page - 1) * pageSize, search: debouncedSearch },
        });
        if (!response.data.success || !Array.isArray(response.data.products)) {
          throw new Error(response.data.message ?? "Could not export inventory.");
        }
        allProducts.push(...response.data.products);
      }
      downloadCsv(
        "inventory.csv",
        ["Product", "SKU", "Category", "Stock", "Stock health", "Discount", "Rating"],
        allProducts.map((product) => [
          product.name,
          product.sku,
          product.Category,
          product.stock,
          getStockStatus(product.stock),
          product.discount,
          product.rating,
        ]),
      );
      toast.success(`Exported ${allProducts.length} inventory items.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not export inventory.");
    } finally {
      setIsExporting(false);
    }
  };

  const metrics = [
    {
      label: "Total products",
      value: query.data?.totalProducts,
      detail: "Active products in your inventory",
      icon: Boxes,
      iconColor: "#a6d2f5",
      iconBackground: "rgba(75, 127, 181, .22)",
    },
    {
      label: "Urgent stock",
      value: query.data?.statuses.urgentCount,
      detail: "5 units or fewer",
      icon: CircleAlert,
      iconColor: "#e4a9a1",
      iconBackground: "rgba(171, 90, 82, .18)",
    },
    {
      label: "Medium stock",
      value: query.data?.statuses.mediumCount,
      detail: "6–15 units remaining",
      icon: ArrowDownToLine,
      iconColor: "#e4c68b",
      iconBackground: "rgba(177, 139, 63, .18)",
    },
    {
      label: "Healthy stock",
      value: query.data?.statuses.healthyCount,
      detail: "More than 15 units",
      icon: PackageCheck,
      iconColor: "#8fd5dd",
      iconBackground: "rgba(57, 137, 154, .2)",
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
            <Card key={metric.label} className="group vendor-summary-card gap-4 py-5">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5">
                <div>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">
                    {query.isPending || query.isError
                      ? "—"
                      : metric.value ?? 0}
                  </CardTitle>
                </div>
                <span style={{ backgroundColor: metric.iconBackground }} className="vendor-summary-icon rounded-lg p-2.5">
                  <Icon style={{ color: metric.iconColor }} className="size-4" />
                </span>
              </CardHeader>
              <CardFooter className="bg-background px-5 text-xs text-muted-foreground">
                {metric.detail}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <Card className="overflow-hidden rounded-2xl border-sky-200/15 bg-[#1e3350] shadow-sm">
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
        <div className="border-b border-sky-200/15 bg-[#1b3150] px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search inventory"
                placeholder="Search inventory"
                className="border-sky-200/20 bg-[#243d5e] pl-9 placeholder:text-slate-400 focus-visible:ring-sky-300/50"
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
              className="w-full border-sky-200/20 bg-[#243d5e] sm:w-24"
            >
              <NativeSelectOption value="10">10</NativeSelectOption>
              <NativeSelectOption value="20">20</NativeSelectOption>
              <NativeSelectOption value="50">50</NativeSelectOption>
            </NativeSelect>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleExport()}
              disabled={isExporting || query.isPending || query.isFetching || query.isPlaceholderData || query.isError || products.length === 0}
              className="border-sky-200/20 bg-[#243d5e] hover:bg-[#315276]"
            >
              <Download aria-hidden="true" /> {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void handleRefresh()}
              disabled={query.isFetching}
              aria-label="Refresh inventory"
              title="Refresh inventory"
              className="border-sky-200/20 bg-[#243d5e] hover:bg-[#315276]"
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
            <Table className="min-w-[850px]">
              <TableHeader className="bg-[#1b3150]">
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
                    <TableRow key={row.id} className="transition-colors hover:bg-white/[0.035]">
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
