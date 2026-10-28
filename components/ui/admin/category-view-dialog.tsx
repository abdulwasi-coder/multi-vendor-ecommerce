"use client";

import type { Category } from "@/components/ui/admin/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryViewDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function categoryImageUrl(category: Category) {
  return [category.Image?.publicId, category.Image?.cloudinaryId].find(
    (value) => typeof value === "string" && /^https?:\/\//i.test(value),
  );
}

function formatDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

export function CategoryViewDialog({
  category,
  open,
  onOpenChange,
}: CategoryViewDialogProps) {
  if (!category) return null;

  const parent = category.parentCategory;
  const parentName =
    typeof parent === "object" && parent !== null
      ? parent.name
      : typeof parent === "string"
        ? parent
        : "None";
  const imageUrl = categoryImageUrl(category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Category details</DialogTitle>
          <DialogDescription>Information for {category.name}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Name</span>
            <span className="text-right font-medium">{category.name}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Category ID</span>
            <span className="max-w-[70%] break-all text-right font-mono text-xs">
              {category._id}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Parent category</span>
            <span className="text-right">{parentName}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Created</span>
            <span className="text-right">{formatDate(category.createdAt)}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground">Last updated</span>
            <span className="text-right">{formatDate(category.updatedAt)}</span>
          </div>
          <div className="space-y-2">
            <span className="text-muted-foreground">Image</span>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${category.name} category`}
                className="h-36 w-36 rounded-md border object-cover"
              />
            ) : (
              <p className="text-muted-foreground">No image available.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
