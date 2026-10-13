import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Star } from "lucide-react";
import { AddToCartButton } from "@/components/ui/customer/add-to-cart-button";
import { products } from "@/lib/vendor-products";

const categoryLabels: Record<string, string> = {
  "Home & kitchen": "Home & Kitchen",
  "Baby & Kids": "Baby & Kids",
  "Bags & accessories": "Bags & Accessories",
};

const categories = [...new Set(products.map((product) => product.categoryID))]
  .map((value) => ({ value, label: categoryLabels[value] ?? value }));

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function filterHref(category?: string, brand?: string, rating?: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (rating) params.set("rating", String(rating));
  const query = params.toString();
  return query ? `/customer/top-rated?${query}` : "/customer/top-rated";
}

export default async function CustomerTopRatedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[]; brand?: string | string[]; rating?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedCategory = typeof params.category === "string" ? params.category : "";
  const selectedCategory = categories.some((category) => category.value === requestedCategory) ? requestedCategory : "";
  const requestedBrand = typeof params.brand === "string" ? params.brand : "";
  const requestedRating = typeof params.rating === "string" ? Number(params.rating) : 0;
  const selectedRating = [4.5, 4.8].includes(requestedRating) ? requestedRating : 0;
  const ratedProducts = products.filter((product) => product.rating >= 4.5 && (!selectedCategory || product.categoryID === selectedCategory));
  const brands = [...new Set(ratedProducts.map((product) => product.brand))];
  const selectedBrand = brands.includes(requestedBrand) ? requestedBrand : "";
  const filteredProducts = ratedProducts
    .filter((product) => (!selectedBrand || product.brand === selectedBrand) && (!selectedRating || product.rating >= selectedRating))
    .sort((left, right) => right.rating - left.rating || right.reviewCount - left.reviewCount);
  const selectedCategoryLabel = categories.find((category) => category.value === selectedCategory)?.label;

  return (
    <main className="min-h-screen bg-white pb-14 pt-40 text-[#0f1111] sm:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="sr-only">Top Rated Products</h1>
        <nav aria-label="Top rated departments" className="flex gap-2 overflow-x-auto border-b border-[#d5d9d9] px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/customer/top-rated" aria-current={!selectedCategory ? "page" : undefined}
            className={`shrink-0 rounded-md border px-5 py-2.5 text-sm ${!selectedCategory ? "border-[#007185] bg-[#eaf6f7] font-bold ring-1 ring-[#007185]" : "border-[#d5d9d9] font-medium hover:bg-[#f7fafa]"}`}>
            All Departments
          </Link>
          {categories.map((category) => {
            const selected = selectedCategory === category.value;
            return (
              <Link key={category.value} href={filterHref(category.value)} aria-current={selected ? "page" : undefined}
                className={`shrink-0 rounded-md border px-5 py-2.5 text-sm ${selected ? "border-[#007185] bg-[#eaf6f7] font-bold ring-1 ring-[#007185]" : "border-[#d5d9d9] font-medium hover:bg-[#f7fafa]"}`}>
                {category.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[225px_minmax(0,1fr)] lg:px-8 lg:py-7">
          <aside className="h-fit border-b border-[#d5d9d9] pb-4 lg:border-0 lg:pb-0">
            <details className="group" open>
              <summary className="cursor-pointer list-none text-lg font-bold lg:hidden">Filters</summary>
              <div className="mt-3 space-y-5 lg:mt-0">
                <section>
                  <h2 className="text-sm font-bold">Filtered by</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCategoryLabel && <span className="rounded-full border border-[#007185] bg-[#eaf6f7] px-3 py-1 text-xs font-semibold">{selectedCategoryLabel}</span>}
                    {selectedBrand && <span className="rounded-full border border-[#007185] bg-[#eaf6f7] px-3 py-1 text-xs font-semibold">{selectedBrand}</span>}
                    {selectedRating > 0 && <span className="rounded-full border border-[#007185] bg-[#eaf6f7] px-3 py-1 text-xs font-semibold">{selectedRating}+ stars</span>}
                  </div>
                  <Link href={filterHref(selectedCategory || undefined)} className="mt-3 inline-block text-sm text-[#007185] hover:text-[#c45500] hover:underline">Clear filters</Link>
                </section>

                <section className="border-t border-[#d5d9d9] pt-4">
                  <h2 className="text-base font-bold">Department</h2>
                  {categories.map((category) => (
                    <Link key={category.value} href={filterHref(category.value)} className="mt-2 flex items-center gap-2 text-sm hover:text-[#c45500]" aria-current={selectedCategory === category.value ? "true" : undefined}>
                      <span className={`grid size-4 place-items-center rounded-full border ${selectedCategory === category.value ? "border-[#007185]" : "border-[#888c8c]"}`}>{selectedCategory === category.value && <span className="size-2 rounded-full bg-[#007185]" />}</span>{category.label}
                    </Link>
                  ))}
                </section>

                <section className="border-t border-[#d5d9d9] pt-4">
                  <h2 className="text-base font-bold">Customer reviews</h2>
                  {[4.8, 4.5].map((rating) => (
                    <Link key={rating} href={filterHref(selectedCategory || undefined, selectedBrand || undefined, selectedRating === rating ? undefined : rating)} className="mt-2 flex items-center gap-2 text-sm hover:text-[#c45500]" aria-current={selectedRating === rating ? "true" : undefined}>
                      <span className={`grid size-[17px] place-items-center rounded-[3px] border ${selectedRating === rating ? "border-[#007185] bg-[#007185] text-white" : "border-[#888c8c]"}`}>{selectedRating === rating && <Check className="size-3.5" />}</span>
                      <span className="flex text-[#de7921]" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < Math.floor(rating) ? "fill-current" : ""}`} />)}</span>
                      &amp; Up
                    </Link>
                  ))}
                </section>

                <section className="border-t border-[#d5d9d9] pt-4">
                  <h2 className="text-base font-bold">Brands</h2>
                  <div className="mt-2 space-y-2">
                    {brands.map((brand) => {
                      const checked = selectedBrand === brand;
                      return (
                        <Link key={brand} href={filterHref(selectedCategory || undefined, checked ? undefined : brand, selectedRating || undefined)} className="flex items-center gap-2 text-sm hover:text-[#c45500]" aria-current={checked ? "true" : undefined}>
                          <span className={`grid size-[17px] shrink-0 place-items-center rounded-[3px] border ${checked ? "border-[#007185] bg-[#007185] text-white" : "border-[#888c8c] bg-white"}`}>{checked && <Check className="size-3.5" />}</span>{brand}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </div>
            </details>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-2 pb-3">
              <div>
                <h2 className="text-xl font-bold">Top Rated{selectedCategoryLabel ? ` in ${selectedCategoryLabel}` : " Products"}</h2>
                <p className="mt-1 text-sm text-[#565959]">Showing {filteredProducts.length} products rated 4.5 stars and up</p>
              </div>
              <p className="text-xs text-[#565959]">Sort: Top rated</p>
            </div>

            {filteredProducts.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4 xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#f4f4f4] bg-white p-3 transition hover:shadow-md sm:p-2">
                    <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="relative block aspect-square w-full overflow-hidden rounded-md bg-[#f7f8f8]">
                      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 90vw, 220px" className="object-cover p-1 mix-blend-multiply" />
                      <span className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-[#ffd814] text-xl font-medium shadow-sm" aria-label="View product">+</span>
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col items-start">
                      <p className="truncate text-xs font-semibold text-[#565959]">{product.brand}</p>
                      <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="mt-1 line-clamp-2 min-h-10 py-1 text-sm leading-5 hover:text-[#c45500] hover:underline">{product.name}</Link>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="flex text-[#de7921]" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < Math.round(product.rating) ? "fill-current" : ""}`} />)}</span>
                        <span className="text-[#007185]">{product.reviewCount}</span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-[#007600]">Top rated</p>
                      <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                        <span className="text-xl font-medium">{currency.format(product.price * (1 - product.discount / 100))}</span>
                        {product.discount > 0 && <span className="text-xs text-[#565959]">List: <span className="line-through">{currency.format(product.price)}</span></span>}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-[#565959]">{product.color}</p>
                      <div className="mt-auto w-full [&>button]:h-9 [&>button]:px-2 [&>button]:text-xs"><AddToCartButton productId={product.id} productName={product.name} stock={product.stock} /></div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-[#565959]">No products match these filters.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
