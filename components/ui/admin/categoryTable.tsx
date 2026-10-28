"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { flexRender, useTable } from "@tanstack/react-table";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
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
import api from "@/lib/axios";
import { toast } from "sonner";
import { Categorycolumns, type Category } from "@/components/ui/admin/columns";
import { CategoryEditDialog } from "@/components/ui/admin/category-edit-dialog";
import { CategoryViewDialog } from "@/components/ui/admin/category-view-dialog";
import { features } from "@/components/ui/admin/data_table_feature";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import { useCategoryNameSearch } from "@/hooks/use-category-name-search";

interface DataTableProps {
  data: Category[];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
  onDataChange?: () => void;
}

const CATEGORY_PAGE_SIZE = 10;

export function DataTable({
  data: initialData,
  currentPage: initialPage,
  totalPages: initialTotalPages,
  totalCategories: initialTotalCategories,
  onDataChange,
}: DataTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [searchPageIndex, setSearchPageIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Category | null>(null);
  const [viewItem, setViewItem] = useState<Category | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchQuery = useCategoryNameSearch(categorySearch);
  const pageQuery = useQuery({
    queryKey: ["admin-categories", "page", pageIndex + 1],
    enabled: !searchQuery.isActive,
    queryFn: async ({ signal }) => {
      const response = await api.get<{
        categories: Category[];
        currentPage: number;
        totalPages: number;
        totalCategories: number;
      }>("/admin/getAllCategories", {
        params: { page: pageIndex + 1, limit: CATEGORY_PAGE_SIZE },
        signal,
      });
      return response.data;
    },
    initialData:
      pageIndex === initialPage - 1
        ? {
            categories: initialData,
            currentPage: initialPage,
            totalPages: initialTotalPages,
            totalCategories: initialTotalCategories,
          }
        : undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const handleEdit = (item: Category) => {
    setActiveItem(item);
    setIsEditModalOpen(true);
  };

  const categoriesToDisplay = searchQuery.isActive
    ? searchQuery.categories
    : pageQuery.data?.categories ?? initialData;
  const pageCount = searchQuery.isActive
    ? Math.max(1, Math.ceil(categoriesToDisplay.length / CATEGORY_PAGE_SIZE))
    : Math.max(1, pageQuery.data?.totalPages ?? initialTotalPages);
  const totalRows = searchQuery.isActive
    ? categoriesToDisplay.length
    : pageQuery.data?.totalCategories ?? initialTotalCategories;
  const activePageIndex = searchQuery.isActive
    ? Math.min(searchPageIndex, Math.max(0, pageCount - 1))
    : Math.min(pageIndex, Math.max(0, pageCount - 1));

  const handleEditSaved = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin-categories", "name-search"],
    });
    await queryClient.invalidateQueries({
      queryKey: ["admin-categories", "page"],
    });
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
      await queryClient.invalidateQueries({
        queryKey: ["admin-categories", "name-search"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-categories", "page"],
      });
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
    state: {
      pagination: { pageIndex: activePageIndex, pageSize: CATEGORY_PAGE_SIZE },
    },
    onPaginationChange: (updater) => {
      const setActivePageIndex = searchQuery.isActive
        ? setSearchPageIndex
        : setPageIndex;
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: activePageIndex, pageSize: CATEGORY_PAGE_SIZE })
          : updater;
      setActivePageIndex(next.pageIndex);
    },
    manualPagination: !searchQuery.isActive,
    pageCount: searchQuery.isActive ? undefined : pageCount,
    meta: {
      onEdit: handleEdit,
      onView: setViewItem,
      onDelete: handleDeleteTrigger,
    },
  });
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="space-y-2 border-b p-4">
        <label htmlFor="category-name-search" className="text-sm font-medium">
          Search categories
        </label>
        <div className="relative max-w-sm">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="category-name-search"
            value={categorySearch}
            onChange={(event) => setCategorySearch(event.target.value)}
            placeholder="Enter at least 2 characters"
            autoComplete="off"
            className="pl-9"
          />
        </div>
        <p
          className="min-h-4 text-xs text-muted-foreground"
          role={searchQuery.errorMessage ? "alert" : "status"}
        >
          {searchQuery.errorMessage ||
            (searchQuery.isSearching
              ? "Searching categories..."
              : searchQuery.isActive
                ? `${categoriesToDisplay.length} categories found.`
                : categorySearch.trim()
                  ? "Enter at least 2 characters to search."
                  : "")}
        </p>
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
                    (searchQuery.isSearching
                      ? "Searching categories..."
                      : searchQuery.isActive
                        ? "No matching categories found."
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
            : `Showing ${activePageIndex * CATEGORY_PAGE_SIZE + 1}–${Math.min(
                (activePageIndex + 1) * CATEGORY_PAGE_SIZE,
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
            disabled={!table.getCanPreviousPage() || pageQuery.isFetching}
            aria-label="Previous page"
          >
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || pageQuery.isFetching}
            aria-label="Next page"
          >
            Next
            <ChevronRight aria-hidden="true" />
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
      <CategoryViewDialog
        category={viewItem}
        open={Boolean(viewItem)}
        onOpenChange={(open) => {
          if (!open) setViewItem(null);
        }}
      />
    </div>
  );
}
