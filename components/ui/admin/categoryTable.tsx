"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnFiltersState,
  flexRender,
  useTable,
} from "@tanstack/react-table";
import { isAxiosError } from "axios";
import {
  useQueryClient,
} from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Categorycolumns, type Category } from "@/components/ui/admin/columns";
import { CategoryEditDialog } from "@/components/ui/admin/category-edit-dialog";
import { features } from "@/components/ui/admin/data_table_feature";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import {
  CATEGORY_PAGE_SIZE,
  invalidateAdminCategoryQueries,
  prefetchAdminCategoryPage,
  useAdminCategoryPage,
  useCategoryNameSearch,
} from "@/Otherfiles/tanstack/admin";

interface DataTableProps {
  onDataChange?: () => void;
}

const EMPTY_CATEGORIES: Category[] = [];

export function DataTable({ onDataChange }: DataTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(0);
  const [searchPageIndex, setSearchPageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Category | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const categorySearch = String(
    columnFilters.find((filter) => filter.id === "name")?.value ?? "",
  );
  const searchQuery = useCategoryNameSearch(categorySearch, true, 3);
  const pageQuery = useAdminCategoryPage(pageIndex + 1, !searchQuery.isActive);
  const categoriesToDisplay = searchQuery.isActive
    ? searchQuery.categories
    : pageQuery.data?.categories ?? EMPTY_CATEGORIES;
  const pageSize = pageQuery.data?.limit ?? CATEGORY_PAGE_SIZE;
  const pageCount = searchQuery.isActive
    ? Math.max(1, Math.ceil(categoriesToDisplay.length / pageSize))
    : Math.max(1, pageQuery.data?.totalPages ?? 1);
  const totalRows = searchQuery.isActive
    ? categoriesToDisplay.length
    : pageQuery.data?.totalCategories ?? 0;
  const activePageIndex = searchQuery.isActive
    ? Math.min(searchPageIndex, pageCount - 1)
    : Math.min(pageIndex, pageCount - 1);
  const firstRowIndex = searchQuery.isActive
    ? activePageIndex * pageSize
    : pageQuery.data?.skipped ?? activePageIndex * pageSize;

  useEffect(() => {
    if (searchQuery.isActive) return;

    const nextPage = pageIndex + 2;
    if (nextPage > (pageQuery.data?.totalPages ?? 0)) return;

    void prefetchAdminCategoryPage(queryClient, nextPage);
  }, [
    pageIndex,
    pageQuery.data?.totalPages,
    queryClient,
    searchQuery.isActive,
  ]);

  const handleEdit = (item: Category) => {
    setActiveItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSaved = async () => {
    await invalidateAdminCategoryQueries(queryClient);
    onDataChange?.();
    router.refresh();
  };

  const handleDeleteTrigger = (id: string) => {
    setIdToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!idToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await api.delete(`/admin/deleteCategory/${idToDelete}`);
      toast.success("Category deleted successfully.");
      setIsDeleteAlertOpen(false);
      await invalidateAdminCategoryQueries(queryClient);
      onDataChange?.();
      router.refresh();
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(
        typeof message === "string" && message.trim()
          ? message
          : "Could not delete the category. Please try again.",
      );
    } finally {
      setIsDeleting(false);
      setIdToDelete(null);
    }
  };

  const table = useTable<DataTableFeatures, Category>({
    data: categoriesToDisplay,
    columns: Categorycolumns,
    features,
    onColumnFiltersChange: setColumnFilters,
    manualFiltering: searchQuery.isActive,
    manualPagination: !searchQuery.isActive,
    pageCount: searchQuery.isActive ? undefined : pageCount,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: activePageIndex, pageSize })
        : updater;
      if (searchQuery.isActive) {
        setSearchPageIndex(next.pageIndex);
      } else {
        setPageIndex(next.pageIndex);
      }
    },
    meta: {
      onEdit: handleEdit,
      onDelete: handleDeleteTrigger,
    },
    state: {
      columnFilters,
      pagination: {
        pageIndex: activePageIndex,
        pageSize,
      },
    },
  });
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search all categories (3+ characters)"
          value={categorySearch}
          onChange={(event) => {
            const value = event.target.value;
            setSearchPageIndex(0);
            table
              .getColumn("name")
              ?.setFilterValue(value.trim().length >= 3 ? value.trim() : undefined);
          }}
          className="max-w-sm"
        />
      </div>
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
            {table.getRowModel().rows?.length ? (
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
                  colSpan={Categorycolumns.length}
                  className="h-28 text-center text-muted-foreground"
                >
                  {searchQuery.errorMessage ||
                    (pageQuery.error
                      ? isAxiosError(pageQuery.error)
                        ? pageQuery.error.response?.data?.message ??
                          "Could not load categories."
                        : "Could not load categories."
                      : "") ||
                    (searchQuery.isSearching
                      ? "Searching categories..."
                      : searchQuery.isActive
                        ? "No matching categories found."
                        : pageQuery.isLoading
                          ? "Loading categories..."
                          : "No categories to display.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {totalRows === 0
            ? "No categories to show"
            : `Showing ${firstRowIndex + 1}–${Math.min(
                firstRowIndex + categoriesToDisplay.length,
                totalRows,
              )} of ${totalRows} categories`}
        </p>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span>
            Page {Math.min(activePageIndex + 1, pageCount)} of {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || pageQuery.isPlaceholderData}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || pageQuery.isPlaceholderData}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Categories assigned to products or
              used as a parent cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIdToDelete(null)}>
              Keep category
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CategoryEditDialog
        category={activeItem}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setActiveItem(null);
        }}
        onSaved={handleEditSaved}
      />
    </div>
  );
}
