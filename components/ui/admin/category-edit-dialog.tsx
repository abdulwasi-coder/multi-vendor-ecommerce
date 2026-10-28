"use client";

import { useEffect, useMemo } from "react";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
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
import type { Category } from "@/components/ui/admin/columns";
import { useCategoryNameSearch } from "@/hooks/use-category-name-search";
import api from "@/lib/axios";
import { withUniqueUploadName } from "@/lib/unique-upload-file";
import { toast } from "sonner";

const categoryImageSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Choose a valid image file.",
  )
  .refine((file) => file.type.startsWith("image/"), "Choose a valid image file.");

const categoryUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a category name.")
    .max(100, "Category name must be 100 characters or fewer."),
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

interface CategoryEditDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function CategoryEditDialog({
  category,
  open,
  onOpenChange,
  onSaved,
}: CategoryEditDialogProps) {
  const editForm = useForm<CategoryUpdateValues>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: { name: "", parentCategory: "", parentSearch: "", image: null },
    mode: "onChange",
  });
  const { handleSubmit, reset } = editForm;
  const parentCategory = useWatch({
    control: editForm.control,
    name: "parentCategory",
  });
  const parentSearch = useWatch({
    control: editForm.control,
    name: "parentSearch",
  }) ?? "";
  const parentQuery = useCategoryNameSearch(parentSearch, open && !parentCategory);
  const parentOptions = useMemo(
    () => parentQuery.categories.filter((option) => option._id !== category?._id),
    [category?._id, parentQuery.categories],
  );

  useEffect(() => {
    if (!open || !category) return;

    const currentParent = category.parentCategory;
    const currentParentId =
      typeof currentParent === "string" ? currentParent : currentParent?._id ?? "";
    const currentParentName =
      typeof currentParent === "object" && currentParent !== null
        ? currentParent.name
        : currentParent ?? "";

    reset({
      name: category.name,
      parentCategory: currentParentId,
      parentSearch: currentParentName,
      image: null,
    });
  }, [category, open, reset]);

  const onSubmit = async (values: CategoryUpdateValues) => {
    if (!category) return;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("ParentCategory", values.parentCategory ?? "");
    if (values.image) formData.append("image", withUniqueUploadName(values.image));

    try {
      await api.put(`/admin/updateCategory/${category._id}`, formData);
      toast.success("Category updated successfully.");
      onOpenChange(false);
      reset();
      onSaved();
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

  const parentSearchMessage =
    (!parentCategory && parentQuery.errorMessage) ||
    (parentQuery.isSearching
      ? "Searching categories..."
      : parentCategory
        ? "Parent category selected."
        : parentSearch.trim().length < 2
          ? "Enter at least 2 characters to search, or leave empty for no parent."
          : parentOptions.length === 0
            ? "No matching categories found."
            : "Choose a category from the matches.");

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit category</DialogTitle>
          <DialogDescription>
            Update the category name, parent category, or image.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="edit-category-name" className="text-sm font-medium">
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
            <label htmlFor="edit-category-parent" className="text-sm font-medium">
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
                        <li key={option._id} role="option" aria-selected="false">
                          <button
                            type="button"
                            className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                            onClick={() => {
                              editForm.setValue("parentCategory", option._id, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
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
            <p id="edit-category-parent-help" className="text-xs text-muted-foreground" role="status">
              {parentSearchMessage}
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-category-image" className="text-sm font-medium">
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
                  onChange={(event) => field.onChange(event.target.files?.[0] ?? null)}
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
            <p className="text-xs text-muted-foreground">Leave empty to keep the current image.</p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={editForm.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={editForm.formState.isSubmitting}>
              {editForm.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}