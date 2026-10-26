import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTableFeatures } from "./data_table_feature";

export interface Category {
  _id: string;
  name: string;
  parentCategory?: { _id: string; name: string } | null;
  imageUrl?: string;
}

const columnHelper = createColumnHelper<DataTableFeatures, Category>();
export const Categorycolumns = [
  columnHelper.accessor("imageUrl", {
    header: "Image",
    cell: ({ row }) => {
      const url = row.original.imageUrl;
      return url ? (
        <Image
          src={url}
          alt="Category visual asset"
          width={200}
          height={200}
          className="h-10 w-10 rounded object-cover border border-gray-200"
        />
      ) : (
        <div className="h-10 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">
          No Img
        </div>
      );
    },
  }),
  columnHelper.accessor("name", {
    header: "Category Name",
    cell: ({ row }) => {
      <span className="font-semibold text-gray-900">
        {row.getValue("name")}
      </span>;
    },
  }),
  columnHelper.accessor("parentCategory", {
    header: "Parent Category",
    cell: ({ row }) =>
      row.original.name || (
        <span className="text-gray-400 italic">None (Root)</span>
      ),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const categoryItem = row.original;
      const meta = row.table.options.meta as
        | {
            onEdit?: (category: Category) => void;
            onDelete?: (id: string) => void;
          }
        | undefined;

      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => meta?.onEdit?.(categoryItem)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-all duration-150"
            aria-label={`Edit ${categoryItem.name}`}
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => meta?.onDelete?.(categoryItem._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all duration-150"
            aria-label={`Delete ${categoryItem.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      );
    },
  }),
];
