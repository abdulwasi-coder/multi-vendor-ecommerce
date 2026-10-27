"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { flexRender, useTable } from "@tanstack/react-table";
import type { ColumnDef, RowData, TableFeatures } from "@tanstack/react-table";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Categorycolumns, type Category } from "@/components/ui/admin/columns";
import { features } from "@/components/ui/admin/data_table_feature";
import type { DataTableFeatures } from "@/components/ui/admin/data_table_feature";

type ParentCategoryOption = Pick<Category, "_id" | "name">;

const categoryImageSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Choose a valid image file.",
  )
  .refine((file) => file.type.startsWith("image/"), "Choose a valid image file.");

const categoryUpdateSchema = z.object({
  name: z.string().trim().min(1, "Enter a category name.").max(100, "Category name must be 100 characters or fewer."),
  parentCategory: z.string().optional(),
  parentSearch: z.string().optional(),
  image: categoryImageSchema.nullable(),
}).superRefine(({ parentCategory, parentSearch }, context) => {
  if (parentSearch?.trim() && !parentCategory) {
    context.addIssue({
      code: "custom",
      path: ["parentCategory"],
      message: "Choose a parent category from the matches or clear the search.",
    });
  }
});

type CategoryUpdateValues = z.infer<typeof categoryUpdateSchema>;

interface DataTableProps {
  data: Category[];
  onDataChange?: () => void;
}

declare module "@tanstack/table-core" {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    onEdit?: (category: TData) => void;
    onDelete?: (id: string) => void;
  }
}

export function DataTable({ data, onDataChange }: DataTableProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Category | null>(null);
  const [debouncedParentSearch, setDebouncedParentSearch] = useState("");

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const editForm = useForm<CategoryUpdateValues>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: { name: "", parentCategory: "", parentSearch: "", image: null },
    mode: "onChange",
  });
  const { handleSubmit } = editForm;
  const parentCategory = useWatch({
    control: editForm.control,
    name: "parentCategory",
  });
  const parentSearch = useWatch({
    control: editForm.control,
    name: "parentSearch",
  }) ?? "";

  const handleEdit = (item: Category) => {
    setActiveItem(item);
    const currentParent = item.parentCategory;
    const currentParentId =
      typeof currentParent === "string" ? currentParent : currentParent?._id ?? "";
    const currentParentName =
      typeof currentParent === "object" && currentParent !== null
        ? currentParent.name
        : currentParent ?? "";
    editForm.reset({
      name: item.name,
      parentCategory: currentParentId,
      parentSearch: currentParentName,
      image: null,
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedParentSearch(parentSearch.trim()),
      300,
    );
    return () => window.clearTimeout(timeoutId);
  }, [parentSearch]);

  const parentQuery = useQuery({
    queryKey: ["admin-categories", "parent-search", debouncedParentSearch],
    queryFn: async ({ signal }) => {
      const response = await api.get<{ categories: ParentCategoryOption[] }>(
        "/admin/specificCategoryName",
        { params: { name: debouncedParentSearch }, signal },
      );
      return response.data.categories ?? [];
    },
    enabled:
      isEditModalOpen && !parentCategory && debouncedParentSearch.length >= 2,
    staleTime: 60_000,
  });
  const parentOptions =
    parentSearch.trim() === debouncedParentSearch
      ? (parentQuery.data ?? []).filter((option) => option._id !== activeItem?._id)
      : [];
  const isDebouncingParentSearch =
    parentSearch.trim().length >= 2 &&
    parentSearch.trim() !== debouncedParentSearch;
  const parentSearchError =
    !parentCategory &&
    parentSearch.trim() === debouncedParentSearch &&
    parentQuery.error
      ? isAxiosError(parentQuery.error)
        ? parentQuery.error.response?.data?.message ?? "Could not search categories."
        : "Could not search categories."
      : "";

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

  const onSubmit = async (values: CategoryUpdateValues) => {
    if (!activeItem) return;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("ParentCategory", values.parentCategory ?? "");
    if (values.image) formData.append("image", values.image);

    try {
      await api.put(`/admin/updateCategory/${activeItem._id}`, formData);
      toast.success("Category updated successfully.");
      setIsEditModalOpen(false);
      setActiveItem(null);
      editForm.reset();
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

      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setActiveItem(null);
            editForm.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              Update the category name, parent category, or image.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <label
                htmlFor="edit-category-name"
                className="text-sm font-medium"
              >
                Category name
              </label>
              <Input
                id="edit-category-name"
                {...editForm.register("name")}
                maxLength={100}
                disabled={editForm.formState.isSubmitting}
                aria-invalid={Boolean(editForm.formState.errors.name)}
              />
              {editForm.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-category-parent"
                className="text-sm font-medium"
              >
                Parent category
              </label>
              <Controller
                control={editForm.control}
                name="parentCategory"
                render={() => (
                  <div className="relative">
                    <Input
                      id="edit-category-parent"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={!parentCategory && parentOptions.length > 0}
                      aria-controls="edit-category-parent-options"
                      aria-describedby="edit-category-parent-help"
                      aria-invalid={Boolean(editForm.formState.errors.parentCategory)}
                      value={parentSearch}
                      onChange={(event) => {
                        editForm.setValue("parentSearch", event.target.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        editForm.setValue("parentCategory", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      placeholder="Type at least 2 characters to search"
                      autoComplete="off"
                      disabled={editForm.formState.isSubmitting}
                    />
                    {!parentCategory && parentOptions.length > 0 && (
                      <ul
                        id="edit-category-parent-options"
                        role="listbox"
                        className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
                      >
                        {parentOptions.map((option) => (
                          <li
                            key={option._id}
                            role="option"
                            aria-selected="false"
                          >
                            <button
                              type="button"
                              className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                              onClick={() => {
                                editForm.setValue(
                                  "parentCategory",
                                  option._id,
                                  {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  },
                                );
                                editForm.setValue("parentSearch", option.name, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }}
                            >
                              {option.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              />
              {editForm.formState.errors.parentCategory && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.parentCategory.message}
                </p>
              )}
              <p
                id="edit-category-parent-help"
                className="text-xs text-muted-foreground"
                role="status"
              >
                {parentSearchError ||
                  (isDebouncingParentSearch || parentQuery.isFetching
                    ? "Searching categories..."
                    : parentCategory
                      ? "Parent category selected."
                      : parentSearch.trim().length < 2
                        ? "Enter at least 2 characters to search, or leave empty for no parent."
                        : parentOptions.length === 0
                          ? "No matching categories found."
                          : "Choose a category from the matches.")}
              </p>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="edit-category-image"
                className="text-sm font-medium"
              >
                Replace image
              </label>
              <Controller
                control={editForm.control}
                name="image"
                render={({ field }) => (
                  <Input
                    id="edit-category-image"
                    name={field.name}
                    ref={field.ref}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      field.onChange(event.target.files?.[0] ?? null)
                    }
                    onBlur={field.onBlur}
                    disabled={editForm.formState.isSubmitting}
                    aria-invalid={Boolean(editForm.formState.errors.image)}
                  />
                )}
              />
              {editForm.formState.errors.image && (
                <p className="text-sm text-destructive">
                  {editForm.formState.errors.image.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Leave empty to keep the current image.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={editForm.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editForm.formState.isSubmitting}
              >
                {editForm.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
