"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import api from "@/lib/axios";

type ParentCategoryOption = Pick<Category, "_id" | "name">;

const categoryImageSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    "Choose a category image.",
  )
  .refine((file) => file.type.startsWith("image/"), "Choose a valid image file.");

const categoryCreateSchema = z.object({
  name: z.string().trim().min(1, "Enter a category name.").max(100, "Category name must be 100 characters or fewer."),
  parentCategory: z.string().min(1, "Choose a parent category from the matches."),
  image: categoryImageSchema,
});

type CategoryCreateValues = z.infer<typeof categoryCreateSchema>;

export function CategoryCreateButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [parentSearch, setParentSearch] = useState("");
  const [debouncedParentSearch, setDebouncedParentSearch] = useState("");
  const form = useForm<CategoryCreateValues>({
    resolver: zodResolver(categoryCreateSchema),
    defaultValues: { name: "", parentCategory: "", image: undefined },
    mode: "onChange",
  });
  const parentCategory = useWatch({ control: form.control, name: "parentCategory" });

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
      isOpen && !parentCategory && debouncedParentSearch.length >= 2,
    staleTime: 60_000,
  });
  const parentOptions =
    parentSearch.trim() === debouncedParentSearch
      ? parentQuery.data ?? []
      : [];
  const isDebouncingParentSearch =
    parentSearch.trim().length >= 2 &&
    parentSearch.trim() !== debouncedParentSearch;
  const parentSearchError =
    !parentCategory && parentSearch.trim() === debouncedParentSearch && parentQuery.error
    ? isAxiosError(parentQuery.error)
      ? parentQuery.error.response?.data?.message ?? "Could not search categories."
      : "Could not search categories."
    : "";

  async function handleSubmit(values: CategoryCreateValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("parentCategory", values.parentCategory);
    formData.append("image", values.image);

    try {
      const response = await api.post("/admin/createCategory", formData);
      if (response.data?.success === false) {
        throw new Error(response.data.message || "Could not create the category.");
      }

      toast.success("Category created.");
      form.reset();
      setParentSearch("");
      setIsOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["admin-categories", "parent-search"],
      });
      router.refresh();
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ?? error.response?.data?.error
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(
        typeof message === "string" && message.trim()
          ? message
          : "Could not create the category. Please try again.",
      );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button type="button" onClick={() => setIsOpen(true)}>
        <Plus aria-hidden="true" />
        Add category
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription>
            Add a marketplace category and choose an image for it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium">
              Category name
            </label>
            <Input
              id="category-name"
              {...form.register("name")}
              placeholder="e.g. Home and living"
              autoComplete="off"
              maxLength={100}
              disabled={form.formState.isSubmitting}
              aria-invalid={Boolean(form.formState.errors.name)}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="category-parent" className="text-sm font-medium">
              Parent category
            </label>
            <div className="relative">
              <Input
                id="category-parent"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={!parentCategory && parentOptions.length > 0}
                aria-controls="category-parent-options"
                aria-describedby="category-parent-help"
                aria-invalid={Boolean(form.formState.errors.parentCategory)}
                value={parentSearch}
                onChange={(event) => {
                  setParentSearch(event.target.value);
                  form.setValue("parentCategory", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                placeholder="Type at least 2 characters to search"
                autoComplete="off"
                disabled={form.formState.isSubmitting}
              />
              {!parentCategory && parentOptions.length > 0 && (
                <ul
                  id="category-parent-options"
                  role="listbox"
                  className="absolute z-10 mt-1 max-h-52 w-full overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
                >
                  {parentOptions.map((option) => (
                    <li key={option._id} role="option" aria-selected="false">
                      <button
                        type="button"
                        className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                        onClick={() => {
                          form.setValue("parentCategory", option._id, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                          setParentSearch(option.name);
                        }}
                      >
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {form.formState.errors.parentCategory && (
              <p className="text-sm text-destructive">{form.formState.errors.parentCategory.message}</p>
            )}
            <p id="category-parent-help" className="text-xs text-muted-foreground" role="status">
              {parentSearchError || (isDebouncingParentSearch || parentQuery.isFetching
                ? "Searching categories..."
                : parentCategory
                  ? "Parent category selected."
                  : parentSearch.trim().length < 2
                    ? "Enter at least 2 characters to search."
                    : parentOptions.length === 0
                      ? "No matching categories found."
                      : "Choose a category from the matches.")}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="category-image" className="text-sm font-medium">
              Category image
            </label>
            <Controller
              control={form.control}
              name="image"
              render={({ field }) => (
                <Input
                  id="category-image"
                  name={field.name}
                  ref={field.ref}
                  type="file"
                  accept="image/*"
                  onChange={(event) => field.onChange(event.target.files?.[0])}
                  onBlur={field.onBlur}
                  disabled={form.formState.isSubmitting}
                  aria-invalid={Boolean(form.formState.errors.image)}
                />
              )}
            />
            {form.formState.errors.image && (
              <p className="text-sm text-destructive">{form.formState.errors.image.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}