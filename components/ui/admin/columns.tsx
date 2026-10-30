import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef, RowData, TableFeatures } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "./data_table_feature";

export interface Category {
  _id: string;
  name: string;
  parentCategory?: { _id: string; name: string } | string | null;
  ChildCount?: number;
  Image?: { cloudinaryId?: string; publicId?: string };
  createdAt?: string;
  updatedAt?: string;
}

declare module "@tanstack/table-core" {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    onEdit?: (category: TData) => void;
    onView?: (category: TData) => void;
    onDelete?: (id: string) => void;
  }
}

export const Categorycolumns: ColumnDef<DataTableFeatures, Category>[] = [
  {
    accessorKey: "Image",
    header: "Image",
    cell: ({ row }) => {
      // Older category records have used these two fields inconsistently.
      // Only pass an actual URL to the browser; a Cloudinary public ID is not
      // itself a renderable image source.
      const image = row.original.Image;
      const url = [image?.publicId, image?.cloudinaryId].find(
        (value) => typeof value === "string" && /^https?:\/\//i.test(value),
      );
      return url ? (
        <img
          src={url}
          alt={`${row.original.name} category`}
          loading="lazy"
          className="h-10 w-10 rounded object-cover border border-gray-200"
        />
      ) : (
        <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
          No Img
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Category Name",
    filterFn: "includesString",
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "parentCategory",
    header: "Parent Category",
    cell: ({ row }) => {
      const parent = row.original.parentCategory;
      const parentName =
        typeof parent === "object" && parent !== null ? parent.name : undefined;
      return parentName || <span className="text-muted-foreground">None</span>;
    },
  },
    {
    accessorKey: "ChildCount",
    header: "Child Category",
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">
          {row.original.ChildCount ?? 0}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const categoryItem = row.original;
      const meta = row.table.options.meta;

      return (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => meta?.onEdit?.(categoryItem)}
            className="text-foreground"
            aria-label={`Edit ${categoryItem.name}`}
            title={`Edit ${categoryItem.name}`}
          >
            <Pencil aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => meta?.onDelete?.(categoryItem._id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            aria-label={`Delete ${categoryItem.name}`}
            title={`Delete ${categoryItem.name}`}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      );
    },
  },
];
