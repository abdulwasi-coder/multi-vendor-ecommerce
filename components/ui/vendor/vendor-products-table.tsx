"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  useTable,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Archive,
  ArrowDown,
  Package,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  prefetchVendorProductsPage,
  useVendorProducts,
  type VendorProduct,
  vendorProductsQueryKey,
  VENDOR_PRODUCTS_PAGE_SIZE,
} from "@/Otherfiles/tanstack/vendor-products";
import api from "@/lib/axios";
import { toast } from "sonner";
import { features, type DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import { vendorProductColumns } from "@/components/ui/vendor/vendor-products-columns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const EMPTY_PRODUCTS: VendorProduct[] = [];

export function VendorProductsTable() {
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(VENDOR_PRODUCTS_PAGE_SIZE);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [productToDelete, setProductToDelete] = useState<VendorProduct | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(search.trim().slice(0, 100)),
      300,
    );
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const query = useVendorProducts(pageIndex + 1, pageSize, debouncedSearch);
  const products = query.data?.products ?? EMPTY_PRODUCTS;
  const summary = query.data?.summary;
  const totalPages = query.data?.totalPages ?? 1;
  const pagination: PaginationState = { pageIndex, pageSize };

  useEffect(() => {
    if (query.isPlaceholderData || !query.data) return;
    if (query.data.currentPage !== pageIndex + 1) {
      setPageIndex(query.data.currentPage - 1);
    }
  }, [pageIndex, query.data, query.isPlaceholderData]);

  useEffect(() => {
    if (query.isPlaceholderData || pageIndex + 2 > totalPages) return;

    void prefetchVendorProductsPage(
      queryClient,
      pageIndex + 2,
      pageSize,
      debouncedSearch,
    );
  }, [
    debouncedSearch,
    pageIndex,
    pageSize,
    query.isPlaceholderData,
    queryClient,
    totalPages,
  ]);

  const table = useTable<DataTableFeatures, VendorProduct>({
    data: products,
    columns: vendorProductColumns,
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
    meta: {
      onDelete: (productId) => {
        setProductToDelete(
          products.find((product) => product._id === productId) ?? null,
        );
      },
    },
  });

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: vendorProductsQueryKey(pageIndex + 1, pageSize, debouncedSearch),
      exact: true,
    });
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await api.delete<{
        success?: boolean;
        message?: string;
      }>(`/vendor/deleteProduct/${productToDelete._id}`);
      if (response.data.success === false) {
        throw new Error(response.data.message ?? "Could not delete the product.");
      }

      toast.success("Product deleted successfully.");
      setProductToDelete(null);
      await queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(
        typeof message === "string" && message.trim()
          ? message
          : "Could not delete the product. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const summaryCards = [
    {
      label: "Products listed",
      value: summary?.totalProducts,
      note: "Across your catalog",
      icon: Package,
    },
    {
      label: "Total stock units",
      value: summary?.totalStock,
      note: "Sum of stock across all products",
      icon: SlidersHorizontal,
    },
    {
      label: "Archived products",
      value: summary?.archivedProducts,
      note: "Not currently listed for sale",
      icon: Archive,
    },
    {
      label: "Low stock",
      value: summary?.lowStockProducts,
      note: "Fewer than 10 units",
      icon: ArrowDown,
    },
  ];

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
        <Button render={<Link href="/vendor/create" />}>
          Add product <Plus />
        </Button>
      </header>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Product summary"
      >
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="gap-4 py-5">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5">
                <div>
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">
                    {query.isPending || query.isError
                      ? "—"
                      : (item.value ?? 0)}
                  </CardTitle>
                </div>
                <span className="rounded-lg bg-muted p-2.5">
                  <Icon className="size-4 text-muted-foreground" />
                </span>
              </CardHeader>
              <CardFooter className="bg-background px-5 text-xs text-muted-foreground">
                {item.note}
              </CardFooter>
            </Card>
          );
        })}
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>All products</CardTitle>
            <CardDescription className="mt-1">
              Search and manage your store catalog and current inventory.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search products"
                placeholder="Search by product, brand, SKU, or category"
                className="pl-9"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPageIndex(0);
                }}
              />
            </label>
            <label className="sr-only" htmlFor="vendor-products-page-size">
              Rows per page
            </label>
            <NativeSelect
              id="vendor-products-page-size"
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
              aria-label="Refresh products"
              title="Refresh products"
            >
              <RotateCcw
                aria-hidden="true"
                className={query.isFetching ? "animate-spin" : ""}
              />
            </Button>
          </div>
        </CardHeader>
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
                    <TableRow
                      key={row.id}
                      className="transition-colors hover:bg-muted/30"
                    >
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
                      colSpan={vendorProductColumns.length}
                      className="h-28 text-center text-muted-foreground"
                    >
                      {query.isPending
                        ? "Loading your products..."
                        : query.isError
                          ? query.error instanceof Error
                            ? query.error.message
                            : "Could not load your products."
                          : debouncedSearch
                            ? "No products match your search."
                            : "You have not added any products yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              {query.isPending || query.isError
                ? " "
                : query.data.totalMatches === 0
                  ? "No products to show"
                  : `Showing ${query.data.skipped + 1}-${Math.min(
                      query.data.skipped + products.length,
                      query.data.totalMatches,
                    )} of ${query.data.totalMatches} products`}
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
                aria-label="Previous products page"
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
                aria-label="Next products page"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setProductToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              {productToDelete
                ? `"${productToDelete.name}" will be permanently removed from your catalog.`
                : "This product will be permanently removed from your catalog."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Keep product
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleConfirmDelete()}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
