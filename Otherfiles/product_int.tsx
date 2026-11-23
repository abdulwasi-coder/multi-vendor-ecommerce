"use client";

import { useDeferredValue, useState } from "react";
import { flexRender, useTable } from "@tanstack/react-table";
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
} from "lucide-react";
import { useAdminProducts, type AdminProduct } from "@/Otherfiles/tanstack/admin";
import {
  features,
  type DataTableFeatures,
} from "@/components/ui/admin/data_table_feature";
import { adminProductColumns } from "@/components/ui/admin/product-columns";

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archieved", label: "Archived" },
  { value: "banned", label: "Banned" },
];

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

export function ProductTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const deferredSearch = useDeferredValue(search);

  const productsQuery = useAdminProducts(
    page,
    PAGE_SIZE,
    deferredSearch,
    status,
  );

  const products = productsQuery.data?.products ?? [];

  const table = useTable<DataTableFeatures, AdminProduct>({
    data: products,
    columns: adminProductColumns,
    features,
    manualPagination: true,
    pageCount: productsQuery.data?.totalPages ?? 1,
    state: {
      pagination: { pageIndex: page - 1, pageSize: PAGE_SIZE },
    },
  });

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {productsQuery.data
              ? `${productsQuery.data.totalProducts} product${productsQuery.data.totalProducts === 1 ? "" : "s"} in catalog`
              : "Browse and search marketplace products."}
          </CardDescription>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="pl-9"
              aria-label="Search products"
            />
          </div>
          <NativeSelect
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <Button
            variant="outline"
            size="icon"
            onClick={() => productsQuery.refetch()}
            disabled={productsQuery.isRefetching}
            aria-label="Reload products"
          >
            <RefreshCw
              className={productsQuery.isRefetching ? "animate-spin" : ""}
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
              {productsQuery.isPending || productsQuery.isError ? (
                <TableRow>
                  <TableCell
                    colSpan={adminProductColumns.length}
                    className="py-8 text-center text-muted-foreground"
                  >
                    {productsQuery.isPending
                      ? "Loading products..."
                      : "Could not load products."}
                  </TableCell>
                </TableRow>
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
                <TableRow>
                  <TableCell
                    colSpan={adminProductColumns.length}
                    className="py-8 text-center text-muted-foreground"
                  >
                    {search || status
                      ? "No products match your filters."
                      : "No products yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          page={page}
          totalPages={productsQuery.data?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </CardContent>
    </Card>
  );
}
