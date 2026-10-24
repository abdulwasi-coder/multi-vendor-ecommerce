"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, ImagePlus, Pencil, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  id: string;
  name: string;
  parentCategory: string;
  parentCategoryId: string;
  imageName: string;
};

type CategoryRecord = Record<string, unknown>;
const NO_PARENT = "__no_parent__";

function asCategory(record: CategoryRecord): Category {
  const parent = record.parentCategory;
  const parentRecord = typeof parent === "object" && parent !== null
    ? parent as CategoryRecord
    : undefined;
  const imageValue = record.Image ?? record.image;
  const image = typeof imageValue === "object" && imageValue !== null
    ? imageValue as CategoryRecord
    : undefined;
  const rawImageName = String(image?.publicId ?? image?.cloudinaryId ?? image?.name ?? "");

  return {
    id: String(record._id ?? record.id ?? ""),
    name: String(record.name ?? ""),
    parentCategory: String(parentRecord?.name ?? (typeof parent === "string" ? parent : "")),
    parentCategoryId: String(parentRecord?._id ?? parentRecord?.id ?? (typeof parent === "string" ? parent : "")),
    imageName: rawImageName.split("/").pop() || "No image",
  };
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as { response?: { data?: { message?: string } } }).response?.data?.message;
  }
  return undefined;
}

export function CategoryTable() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [editName, setEditName] = useState("");
  const [editParentCategory, setEditParentCategory] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get("/admin/getAllCategories");
        const result = response.data;
        const list = Array.isArray(result)
          ? result
          : Array.isArray(result?.categories)
            ? result.categories
            : Array.isArray(result?.data)
              ? result.data
              : [];
        setCategories(list.map((record: CategoryRecord) => asCategory(record)));
      } catch {
        toast.error("Could not load categories.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    `${category.name} ${category.parentCategory}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  function openEditForm(category: Category) {
    setShowForm(false);
    setEditingCategory(category);
    setEditName(category.name);
    setEditParentCategory(category.parentCategoryId || NO_PARENT);
    setEditImage(null);
  }

  function closeForms() {
    setShowForm(false);
    setEditingCategory(null);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    if (!cleanName || !parentCategory || !image) {
      toast.error("Enter a category name, parent category, and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cleanName);
    formData.append("parentCategory", parentCategory);
    formData.append("image", image);

    setIsSubmitting(true);
    try {
      const response = await api.post("/admin/createCategory", formData);
      const saved = response.data?.category;
      const created = saved
        ? asCategory(saved)
        : {
            id: String(response.data?.id ?? response.data?._id ?? `${Date.now()}`),
            name: cleanName,
            parentCategory: categories.find((category) => category.id === parentCategory)?.name ?? "",
            parentCategoryId: parentCategory,
            imageName: image.name,
          };
      setCategories((current) => [...current, created]);
      setName("");
      setParentCategory("");
      setImage(null);
      setShowForm(false);
      toast.success("Category created.");
    } catch (error) {
      toast.error(getErrorMessage(error) || "Could not create the category. Check the backend connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCategory) return;

    const cleanName = editName.trim();
    if (!cleanName) {
      toast.error("Enter a category name.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cleanName);
    formData.append("parentCategory", editParentCategory === NO_PARENT ? "" : editParentCategory);
    if (editImage) formData.append("image", editImage);

    setIsUpdating(true);
    try {
      const response = await api.put(`/admin/updateCategory/${editingCategory.id}`, formData);
      const saved = response.data?.category;
      const parent = categories.find((category) => category.id === editParentCategory);
      const updated = saved
        ? asCategory(saved)
        : {
            ...editingCategory,
            name: cleanName,
            parentCategory: editParentCategory === NO_PARENT ? "" : parent?.name ?? "",
            parentCategoryId: editParentCategory === NO_PARENT ? "" : editParentCategory,
            imageName: editImage?.name ?? editingCategory.imageName,
          };
      setCategories((current) => current.map((category) => category.id === updated.id ? updated : category));
      setEditingCategory(null);
      setEditImage(null);
      toast.success("Category updated.");
    } catch (error) {
      toast.error(getErrorMessage(error) || "Could not update the category.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Card className="xl:col-span-4">
      <CardHeader className="gap-4">
        <div className="space-y-1">
          <CardTitle>Category management</CardTitle>
          <CardDescription>Add, review, and update marketplace categories.</CardDescription>
        </div>
        <div className="relative flex w-full items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories..."
              className="pl-9"
              aria-label="Search categories"
            />
          </div>
          <Button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setShowForm((visible) => !visible);
            }}
          >
            {showForm ? "Close" : "Add"} {showForm ? <X /> : <Plus />}
          </Button>
        </div>
        {showForm && (
          <form onSubmit={handleCreate} className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2" noValidate>
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">Category name</label>
              <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Clothing" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="category-parent" className="text-sm font-medium">Parent category <span className="text-destructive">*</span></label>
              <Select value={parentCategory} onValueChange={(value) => setParentCategory(value ?? "")}>
                <SelectTrigger id="category-parent" className="w-full" aria-label="Choose a parent category" aria-required="true">
                  <SelectValue placeholder="Choose a parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length ? categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  )) : <SelectItem value="__no_categories__" disabled>No categories available</SelectItem>}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose a parent category for this category.</p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="category-image" className="text-sm font-medium">Category image</label>
              <Input id="category-image" type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} required />
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><ImagePlus className="size-3.5" />Choose one image for this category.</p>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting || !name.trim() || !parentCategory || !image}>
                {isSubmitting ? "Creating..." : "Create category"}
              </Button>
            </div>
          </form>
        )}
        {editingCategory && (
          <form onSubmit={handleUpdate} className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2" noValidate>
            <div className="flex items-center justify-between sm:col-span-2">
              <div>
                <h3 className="font-medium">Update category</h3>
                <p className="text-sm text-muted-foreground">Change its name, parent category, or image.</p>
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label="Close update form" onClick={closeForms}><X /></Button>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-category-name" className="text-sm font-medium">Category name</label>
              <Input id="edit-category-name" value={editName} onChange={(event) => setEditName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-category-parent" className="text-sm font-medium">Parent category</label>
              <Select value={editParentCategory} onValueChange={(value) => setEditParentCategory(value ?? NO_PARENT)}>
                <SelectTrigger id="edit-category-parent" className="w-full" aria-label="Choose a parent category">
                  <SelectValue placeholder="Choose a parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PARENT}>No parent category</SelectItem>
                  {categories.filter((category) => category.id !== editingCategory.id).map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="edit-category-image" className="text-sm font-medium">Replace category image</label>
              <Input id="edit-category-image" type="file" accept="image/*" onChange={(event) => setEditImage(event.target.files?.[0] ?? null)} />
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <ImagePlus className="size-3.5" />Current image: {editingCategory.imageName}. Choose a file only if you want to replace it.
              </p>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={isUpdating || !editName.trim()}>{isUpdating ? "Saving..." : "Save changes"}</Button>
              <Button type="button" variant="outline" onClick={closeForms} disabled={isUpdating}>Cancel</Button>
            </div>
          </form>
        )}
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 font-medium">Name</TableHead>
              <TableHead>Parent category</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length ? filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="pl-6 font-medium">{category.name}</TableCell>
                <TableCell>{category.parentCategory || "—"}</TableCell>
                <TableCell>{category.imageName}</TableCell>
                <TableCell className="pr-6 text-right">
                  <Button type="button" size="sm" variant="outline" onClick={() => openEditForm(category)}>
                    <Pencil /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                  {isLoading ? "Loading categories..." : search ? "No matching categories." : "No categories to display yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>{filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}</span>
          <Button variant="ghost" size="sm" className="-mr-2" onClick={() => { setEditingCategory(null); setShowForm(true); }}>
            Add category <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
