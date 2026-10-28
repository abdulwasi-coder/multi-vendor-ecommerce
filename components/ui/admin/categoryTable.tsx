"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { flexRender, useTable } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
import { features } from "@/components/ui/admin/data_table_feature";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";
import { useCategoryNameSearch } from "@/hooks/use-category-name-search";

interface DataTableProps {
  data: Category[];
  onDataChange?: () => void;
}

export function DataTable({ data, onDataChange }: DataTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Category | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchQuery = useCategoryNameSearch(categorySearch);

  const handleEdit = (item: Category) => {
    setActiveItem(item);
    setIsEditModalOpen(true);
  };

  const categoriesToDisplay = searchQuery.isActive ? searchQuery.categories : data;

  const handleEditSaved = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["admin-categories", "name-search"],
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
    meta: {
      onEdit: handleEdit,
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
