"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { flexRender, useTable } from "@tanstack/react-table";
import type { ColumnDef, RowData, TableFeatures } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
import { isAxiosError } from "axios";
import { Categorycolumns, type Category } from "@/components/ui/admin/columns";
import { features } from "@/components/ui/admin/data_table_feature";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";

interface DataTableProps {
  data: Category[];
  onDataChange?: () => void;
}

declare module "@tanstack/table-core" {
  interface TableMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    onEdit?: (category: TData) => void;
    onDelete?: (id: string) => void;
  }
}

export function DataTable({ data, onDataChange }: DataTableProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (item: Category) => {
    setActiveItem(item);
    setEditName(item.name);
    setEditImage(null);
    setIsEditModalOpen(true);
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

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeItem || !editName.trim() || isSaving) return;

    const formData = new FormData();
    formData.append("name", editName.trim());
    const parentCategory = activeItem.parentCategory;
    const parentCategoryId =
      typeof parentCategory === "string"
        ? parentCategory
        : parentCategory?._id;
    if (parentCategoryId) formData.append("ParentCategory", parentCategoryId);
    if (editImage) formData.append("image", editImage);

    setIsSaving(true);
    try {
      await api.put(`/admin/updateCategory/${activeItem._id}`, formData);
      toast.success("Category updated successfully.");
      setIsEditModalOpen(false);
      setActiveItem(null);
      setEditImage(null);
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
          : "Could not update the category. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const table = useTable<DataTableFeatures, Category>({
    data,
    columns: Categorycolumns as ColumnDef<DataTableFeatures, Category, any>[],
    features,
    meta: {
      onEdit: handleEdit,
      onDelete: handleDeleteTrigger,
    },
  });
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="h-11 whitespace-nowrap font-semibold text-muted-foreground">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="transition-colors hover:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={Categorycolumns.length} className="h-28 text-center text-muted-foreground">
                No categories to display.
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
              This action cannot be undone. Categories assigned to products or used as a parent cannot be deleted.
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

      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) setActiveItem(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              Update the category name or replace its image.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-category-name" className="text-sm font-medium">
                Category name
              </label>
              <Input
                id="edit-category-name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                maxLength={100}
                required
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-category-image" className="text-sm font-medium">
                Replace image <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="edit-category-image"
                type="file"
                accept="image/*"
                onChange={(event) => setEditImage(event.target.files?.[0] ?? null)}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">Leave empty to keep the current image.</p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !editName.trim()}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}