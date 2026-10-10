import { CategoryTable } from "@/Otherfiles/category_int";

export default function CategoryPage() {
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

        <CategoryTable />
      </div>
    </main>
  );
}
