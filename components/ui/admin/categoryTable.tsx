"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { flexRender, useTable } from "@tanstack/react-table";
import type { ColumnDef, RowData, TableFeatures } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface DataTableProps {
  data: Category[];
  onDataChange?: () => void;
}

declare module "@tanstack/table-core" {
  interface TableMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
  > {
    onEdit?: (category: TData) => void;
    onDelete?: (id: string) => void;
  }
}

export function DataTable({ data, onDataChange }: DataTableProps) {
  const [isPending, startTransition] = useTransition();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Category | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const handleEdit = (item: Category) => {
    setActiveItem(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteTrigger = (id: string) => {
    setIdToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!idToDelete) return;

    startTransition(async () => {
      try {
        const response = await api.delete(`/deleteCategory/${idToDelete}`);
        if (response.status === 200 || response.status === 204) {
          onDataChange?.();
          toast.success("Category deleted successfully.");
        }
      } catch (error: any) {
        console.error("Express Deletion Error via Axios:", error);
        toast.error(error.response?.data?.message || "Deletion failed on your Express server backend.");
      } finally {
        setIdToDelete(null); 
      }
    });
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
    <div className={`rounded-md border bg-white ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      <Table>
        <TableHeader className="bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-semibold text-slate-600">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={Categorycolumns.length} className="h-24 text-center text-slate-400">
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category node from your MongoDB database and remove its active routing targets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIdToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isEditModalOpen && activeItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded border shadow-lg">
            <h2 className="font-bold">Edit Layout: {activeItem.name}</h2>
            <button className="mt-4 px-3 py-1 bg-slate-200 rounded" onClick={() => setIsEditModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}