import { cookies } from "next/headers";
import { DataTable } from "@/components/ui/admin/categoryTable";
import { CategoryCreateButton } from "../../../../components/ui/admin/category-create-button";
import type { Category } from "@/components/ui/admin/columns";
import api from "@/lib/axios";

export default async function CategoryPage() {
  let data: Category[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let totalCategories = 0;
  let hasError = false;

  try {
    const cookieHeader = (await cookies()).toString();
    const response = await api.get<{
      categories: Category[];
      currentPage: number;
      totalPages: number;
      totalCategories: number;
    }>("/admin/getAllCategories", {
      headers: { Cookie: cookieHeader },
      params: { page: currentPage, limit: 10 },
    });
    data = response.data.categories;
    currentPage = response.data.currentPage;
    totalPages = response.data.totalPages;
    totalCategories = response.data.totalCategories;
  } catch (error) {
    hasError = true;
  }

  return (
    <main className="min-h-screen w-full bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-400 space-y-6">
        <header className="flex flex-col lg:flex-row gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-primary">
              Marketplace operations
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Categories
            </h1>
            <p className="text-sm text-muted-foreground">
              Make and Review Categories across the marketplace.
            </p>
          </div>
          <CategoryCreateButton />
        </header>
        {hasError ? (
          <p role="alert" className="text-sm text-destructive">
            Could not load categories. Please reload the page to try again.
          </p>
        ) : (
          <DataTable
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCategories={totalCategories}
          />
        )}
      </div>
    </main>
  );
}
