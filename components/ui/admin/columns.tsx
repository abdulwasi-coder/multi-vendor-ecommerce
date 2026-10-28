import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import type { ColumnDef, RowData, TableFeatures } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "./data_table_feature";

export interface Category {
  _id: string;
  name: string;
  parentCategory?: { _id: string; name: string } | string | null;
  Image?: { cloudinaryId?: string; publicId?: string };
}

declare module "@tanstack/table-core" {
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    onEdit?: (category: TData) => void;
    onDelete?: (id: string) => void;
  }
}

export const Categorycolumns: ColumnDef<DataTableFeatures, Category>[] = [
  {
    accessorKey: "Image",
    header: "Image",
    cell: ({ row }) => {
      const url = row.original.Image?.publicId;
      return url ? (
        <Image
          src={url}
          alt="Category visual asset"
          width={200}
          height={200}
          unoptimized
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
