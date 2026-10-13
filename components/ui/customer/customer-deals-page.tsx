import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Flame, Star } from "lucide-react";
import { AddToCartButton } from "@/components/ui/customer/add-to-cart-button";
import { products } from "@/lib/vendor-products";

const categories = [
  { label: "Home & Kitchen", value: "Home & kitchen" },
  { label: "Baby", value: "Baby & Kids" },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function categoryHref(category: string, brand?: string) {
  const params = new URLSearchParams({ category });
  if (brand) params.set("brand", brand);
  return `/customer/top-discounts?${params.toString()}`;
}

export default async function CustomerDealsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[]; brand?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedCategory = typeof params.category === "string" ? params.category : "";
  const selectedCategory = categories.find((category) => category.value === requestedCategory)?.value ?? "Home & kitchen";
  const requestedBrand = typeof params.brand === "string" ? params.brand : "";
  const categoryDeals = products.filter((product) => product.categoryID === selectedCategory && product.discount > 15);
  const brands = [...new Set(categoryDeals.map((product) => product.brand))];
  const selectedBrand = brands.includes(requestedBrand) ? requestedBrand : "";
  const deals = categoryDeals.filter((product) => !selectedBrand || product.brand === selectedBrand);

  return (
    <main className="min-h-screen bg-white pb-14 pt-40 text-[#0f1111] sm:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <header className="border-b border-[#d5d9d9] px-4 pb-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-medium text-[#c45500]"><Flame className="size-4" />Limited-time savings</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Today&apos;s Deals</h1>
          <p className="mt-1 text-sm text-[#565959]">Explore offers across the departments you love.</p>
        </header>

        <nav aria-label="Deal departments" className="flex gap-2 overflow-x-auto border-b border-[#d5d9d9] px-4 py-4 sm:px-6 lg:px-8">
          {categories.map((category) => {
            const selected = selectedCategory === category.value;
            return (
              <Link key={category.value} href={categoryHref(category.value)} aria-current={selected ? "page" : undefined}
                className={`shrink-0 rounded-md border px-5 py-2.5 text-sm transition ${selected ? "border-[#007185] bg-[#eaf6f7] font-bold text-[#0f1111] ring-1 ring-[#007185]" : "border-[#d5d9d9] bg-white font-medium hover:bg-[#f7fafa]"}`}>
                {category.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[225px_minmax(0,1fr)] lg:px-8 lg:py-7">
          <aside className="h-fit border-b border-[#d5d9d9] pb-4 lg:border-0 lg:pb-0">
            <details className="group" open>
              <summary className="cursor-pointer list-none text-lg font-bold lg:hidden">Filters <span className="ml-1 text-sm font-normal text-[#565959]">({selectedCategory})</span></summary>
              <div className="mt-3 space-y-5 lg:mt-0">
                <section>
                  <h2 className="text-sm font-bold">Filtered by</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#007185] bg-[#eaf6f7] px-3 py-1 text-xs font-semibold text-[#0f1111]">{categories.find((category) => category.value === selectedCategory)?.label}</span>
                    {selectedBrand && <span className="rounded-full border border-[#007185] bg-[#eaf6f7] px-3 py-1 text-xs font-semibold">{selectedBrand}</span>}
                  </div>
                  <Link href={categoryHref(selectedCategory)} className="mt-3 inline-block text-sm text-[#007185] hover:text-[#c45500] hover:underline">Clear filters</Link>
                </section>

                <section className="border-t border-[#d5d9d9] pt-4">
                  <h2 className="text-base font-bold">Department</h2>
                  <p className="mt-1 text-xs text-[#565959]">Any Category <ChevronRight className="mx-1 inline size-3" /> {categories.find((category) => category.value === selectedCategory)?.label}</p>
                  <Link href={categoryHref(selectedCategory)} aria-current={!selectedBrand ? "true" : undefined} className="mt-3 flex items-center gap-2 text-sm hover:text-[#c45500]">
                    <span className={`grid size-4 place-items-center rounded-full border ${!selectedBrand ? "border-[#007185]" : "border-[#888c8c]"}`}>{!selectedBrand && <span className="size-2 rounded-full bg-[#007185]" />}</span>All
                  </Link>
                </section>

                <section className="border-t border-[#d5d9d9] pt-4">
                  <h2 className="text-base font-bold">Brands</h2>
                  <div className="mt-2 space-y-2">
                    {brands.map((brand) => {
                      const checked = selectedBrand === brand;
                      return (
                        <Link key={brand} href={categoryHref(selectedCategory, checked ? undefined : brand)} aria-current={checked ? "true" : undefined} className="flex items-center gap-2 text-sm hover:text-[#c45500]">
                          <span className={`grid size-[17px] shrink-0 place-items-center rounded-[3px] border ${checked ? "border-[#007185] bg-[#007185] text-white" : "border-[#888c8c] bg-white"}`}>{checked && <Check className="size-3.5" />}</span>
                          {brand}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </div>
            </details>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[#d5d9d9] pb-3">
              <div>
                <h2 className="text-xl font-bold">Deals in {categories.find((category) => category.value === selectedCategory)?.label}</h2>
                <p className="mt-1 text-sm text-[#565959]">Showing {deals.length} deals with more than 15% off</p>
              </div>
              <p className="text-xs text-[#565959]">Sort: Featured</p>
            </div>

            {deals.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {deals.map((product) => {
                  const dealPrice = product.price * (1 - product.discount / 100);
                  return (
                    <article key={product.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#d5d9d9] bg-white p-3 transition hover:shadow-md sm:p-4">
                      <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="relative block aspect-square w-full overflow-hidden rounded-md bg-[#f7f8f8]">
                        <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 90vw, 220px" className="object-contain p-4 mix-blend-multiply" />
                        <span className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-[#ffd814] text-xl font-medium shadow-sm" aria-label="Deal item">+</span>
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col items-start pt-3">
                        <p className="truncate text-xs font-semibold text-[#565959]">{product.brand}</p>
                        <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-[#0f1111] hover:text-[#c45500] hover:underline">{product.name}</Link>
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="flex text-[#de7921]" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < Math.round(product.rating) ? "fill-current" : ""}`} />)}</span>
                          <span className="text-[#007185]">{product.reviewCount}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-sm bg-[#cc0c39] px-2 py-1 text-xs font-bold text-white">{product.discount}% off</span>
                          <span className="text-xs font-semibold text-[#cc0c39]">Limited time deal</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                          <span className="text-xl font-medium">{currency.format(dealPrice)}</span>
                          <span className="text-xs text-[#565959]">List: <span className="line-through">{currency.format(product.price)}</span></span>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-[#565959]">Save {currency.format(product.price - dealPrice)} · {product.color}</p>
                        <div className="mt-auto w-full pt-4 [&>button]:h-9 [&>button]:px-2 [&>button]:text-xs"><AddToCartButton productId={product.id} productName={product.name} stock={product.stock} /></div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-[#565959]">No deals above 15% are available in this department.</div>
            )}
          </section>
        </div>
        <p className="px-4 text-xs text-[#767676] sm:px-6 lg:px-8">Deal prices are based on the current catalog discounts.</p>
      </div>
    </main>
  );
}
