import { DataTable } from "@/components/ui/admin/categoryTable";
import { Categorycolumns, type Category } from "@/components/ui/admin/columns";
import api from "@/lib/axios";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  const cookieHeader = (await cookies()).toString();
  const response = await api.get<Category[]>("/admin/getAllCategories", {
    headers: { Cookie: cookieHeader },
  });
  const data = response.data;
  return (
    <main className="min-h-screen w-full bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-400 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        </header>
        <DataTable columns={Categorycolumns} data={data} />
      </div>
    </main>
  );
}
