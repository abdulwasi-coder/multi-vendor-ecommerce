"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { EmptyState, Notice, inputClass } from "@/components/app-ui";
import { ProductCard } from "@/components/product-card";

type CatalogFilters = { search?: string; minPrice?: string; maxPrice?: string; category?: string; rating?: string; discount?: string };

export function ProductCatalog({ initial }: { initial: CatalogFilters & { page?: number } }) {
  const router = useRouter();
  const [page, setPage] = useState(initial.page ?? 1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogFilters>(initial);
  const [filters, setFilters] = useState<CatalogFilters>(initial);
  const query = useProducts({
    page,
    limit: 20,
    search: filters.search || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    category: filters.category || undefined,
    rating: filters.rating ? Number(filters.rating) : undefined,
    discount: filters.discount ? Number(filters.discount) : undefined,
  });

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = Object.fromEntries(Object.entries(draft).filter(([, value]) => value?.trim())) as CatalogFilters;
    setPage(1);
    setFilters(next);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) if (value) params.set(key, value);
    router.push(`/products${params.size ? `?${params.toString()}` : ""}`);
  }

  function updateFilter(key: keyof CatalogFilters, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return <div>
    <form onSubmit={applyFilters} className="mb-7 rounded-md border border-border/80 bg-card p-3 sm:p-4">
      <div className="flex flex-wrap gap-2">
        <label className="relative min-w-[180px] flex-1"><span className="sr-only">Search products</span><Search aria-hidden="true" size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input className={`${inputClass} pl-9`} placeholder="Search products" value={draft.search ?? ""} onChange={(event) => updateFilter("search", event.target.value)} /></label>
        <button type="button" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen((open) => !open)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"><SlidersHorizontal aria-hidden="true" size={16} />Filters</button>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Apply</button>
      </div>
      <div id="catalog-filters" className={`${filtersOpen ? "grid" : "hidden"} mt-3 grid-cols-2 gap-2 border-t border-border/70 pt-3 sm:grid-cols-3 lg:grid`}>
        <label><span className="sr-only">Minimum price</span><input className={inputClass} type="number" min="0" placeholder="Min price" value={draft.minPrice ?? ""} onChange={(event) => updateFilter("minPrice", event.target.value)} /></label>
        <label><span className="sr-only">Maximum price</span><input className={inputClass} type="number" min="0" placeholder="Max price" value={draft.maxPrice ?? ""} onChange={(event) => updateFilter("maxPrice", event.target.value)} /></label>
        <label><span className="sr-only">Category ID</span><input className={inputClass} placeholder="Category ID" value={draft.category ?? ""} onChange={(event) => updateFilter("category", event.target.value)} /></label>
        <label><span className="sr-only">Minimum rating</span><select className={inputClass} value={draft.rating ?? ""} onChange={(event) => updateFilter("rating", event.target.value)}><option value="">Any rating</option><option value="3">3+ stars</option><option value="4">4+ stars</option><option value="5">5 stars</option></select></label>
        <label><span className="sr-only">Minimum discount percentage</span><input className={inputClass} type="number" min="0" max="100" placeholder="Discount %" value={draft.discount ?? ""} onChange={(event) => updateFilter("discount", event.target.value)} /></label>
      </div>
    </form>

    {query.isLoading && <div aria-live="polite" className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="aspect-[4/5] animate-pulse rounded-md bg-muted motion-reduce:animate-none" />)}</div>}
    {query.isError && <Notice kind="error" title="Products could not be loaded">{query.error instanceof Error ? query.error.message : "Check your connection and sign in, then try again."}</Notice>}
    {query.isSuccess && query.data.product.length === 0 && <EmptyState title="No products found" detail="Try another search or clear some filters." />}
    {query.isSuccess && query.data.product.length > 0 && <>
      <p className="mb-4 text-sm text-muted-foreground">{query.data.totalProducts} items</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-y-9">{query.data.product.map((product) => <li key={product.id}><ProductCard product={product} /></li>)}</ul>
      <nav aria-label="Product pages" className="mt-9 flex items-center justify-between border-t border-border pt-5"><button type="button" disabled={page <= 1 || query.isFetching} onClick={() => setPage((current) => current - 1)} className="min-h-11 rounded-md border border-border px-4 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">Previous</button><p aria-live="polite" className="text-sm text-muted-foreground">Page {query.data.currentPage} of {Math.max(query.data.totalPages, 1)}</p><button type="button" disabled={page >= query.data.totalPages || query.isFetching} onClick={() => setPage((current) => current + 1)} className="min-h-11 rounded-md border border-border px-4 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50">Next</button></nav>
    </>}
  </div>;
}
