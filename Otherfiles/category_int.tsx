"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, ImagePlus, Plus, Search, X } from "lucide-react";
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

type Category = {
  id: string;
  name: string;
  parentCategory: string;
  imageName: string;
};

export function CategoryTable() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const filteredCategories = categories.filter((category) =>
    `${category.name} ${category.parentCategory}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanParent = parentCategory.trim();
    if (!cleanName || !cleanParent || !image) {
      toast.error("Enter a category name, parent category, and image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", cleanName);
    formData.append("parentCategory", cleanParent);
    formData.append("image", image);

    setIsSubmitting(true);
    try {
      const response = await api.post("/category", formData);
      setCategories((current) => [
        ...current,
        {
          id: String(response.data?.id ?? response.data?._id ?? `${Date.now()}`),
          name: cleanName,
          parentCategory: cleanParent,
          imageName: image.name,
        },
      ]);
      setName("");
      setParentCategory("");
      setImage(null);
      setShowForm(false);
      toast.success("Category created.");
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Could not create the category. Check the backend connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="xl:col-span-4">
      <CardHeader className="gap-4">
        <div className="space-y-1">
          <CardTitle>Category management</CardTitle>
          <CardDescription>Add and review marketplace categories.</CardDescription>
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
          <Button type="button" onClick={() => setShowForm((visible) => !visible)}>
            {showForm ? "Close" : "Add"} {showForm ? <X /> : <Plus />}
          </Button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2" noValidate>
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">Category name</label>
              <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Clothing" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="category-parent" className="text-sm font-medium">Parent category <span className="text-destructive">*</span></label>
              <Input id="category-parent" value={parentCategory} onChange={(event) => setParentCategory(event.target.value)} placeholder="Enter the parent category" required />
              <p className="text-xs text-muted-foreground">A parent category is required before this category can be created.</p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="category-image" className="text-sm font-medium">Category image</label>
              <Input id="category-image" type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} required />
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><ImagePlus className="size-3.5" />Choose one image for this category.</p>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting || !name.trim() || !parentCategory.trim() || !image}>
                {isSubmitting ? "Creating..." : "Create category"}
              </Button>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length ? filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="pl-6 font-medium">{category.name}</TableCell>
                <TableCell>{category.parentCategory}</TableCell>
                <TableCell>{category.imageName}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                  {search ? "No matching categories." : "No categories to display yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>{filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}</span>
          <Button variant="ghost" size="sm" className="-mr-2" onClick={() => setShowForm(true)}>
            Add category <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
