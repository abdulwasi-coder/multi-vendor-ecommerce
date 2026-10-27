"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

export function CategoryCreateButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [debouncedParentSearch, setDebouncedParentSearch] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    if (!cleanName || !parentCategory || !image) return;

    const formData = new FormData();
    formData.append("name", cleanName);
    formData.append("parentCategory", parentCategory);
    formData.append("image", image);

    setIsSubmitting(true);
    try {
      const response = await api.post("/admin/createCategory", formData);
      if (response.data?.success === false) {
        throw new Error(response.data.message || "Could not create the category.");
      }

      toast.success("Category created.");
      setName("");
      setParentCategory("");
      setParentSearch("");
      setImage(null);
      formRef.current?.reset();
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
    } finally {
      setIsSubmitting(false);
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
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium">
              Category name
            </label>
            <Input
              id="category-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Home and living"
              autoComplete="off"
              required
              maxLength={100}
              disabled={isSubmitting}
            />
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
                value={parentSearch}
                onChange={(event) => {
                  setParentSearch(event.target.value);
                  setParentCategory("");
                }}
                placeholder="Type at least 2 characters to search"
                autoComplete="off"
                required
                disabled={isSubmitting}
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
                          setParentCategory(option._id);
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
            <Input
              id="category-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files?.[0] ?? null)}
              required
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim() || !parentCategory || !image}>
              {isSubmitting ? "Creating..." : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}