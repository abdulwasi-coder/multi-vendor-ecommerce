import Image from "next/image";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { AddToCartButton } from "@/components/customer/add-to-cart-button";
import { products } from "@/lib/vendor-products";

type SearchValue = string | string[] | undefined;
type SearchParams = Record<string, SearchValue>;

function values(value: SearchValue) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function filterHref(params: SearchParams, key: string, value: string) {
  const search = new URLSearchParams();
  for (const [param, paramValue] of Object.entries(params)) {
    for (const entry of values(paramValue)) search.append(param, entry);
  }

  const existingValues = search.getAll(key);
  search.delete(key);
  const nextValues = key === "category" || key === "brand"
    ? existingValues.includes(value)
      ? existingValues.filter((entry) => entry !== value)
      : [...existingValues, value]
    : existingValues.includes(value)
      ? []
      : [value];
  for (const entry of nextValues) search.append(key, entry);

  const query = search.toString();
  return query ? `/customer/products?${query}` : "/customer/products";
}

function FilterOption({ href, label, selected }: { href: string; label: string; selected: boolean }) {
  return (
    <Link href={href} aria-current={selected ? "true" : undefined} className="flex items-center gap-2 py-1 text-sm leading-5 hover:text-[#c45500]">
      <span className={`grid size-[17px] shrink-0 place-items-center rounded-[3px] border ${selected ? "border-[#007185] bg-[#007185] text-white" : "border-[#888c8c] bg-white"}`}>
        {selected && <Check className="size-3.5" aria-hidden="true" />}
      </span>
      {label}
    </Link>
  );
}

export default async function ProductsPage({ searchParams }: PageProps<"/customer/products">) {
  const params = await searchParams;
  const query = values(params.q)[0]?.trim() ?? "";
  const selectedCategories = values(params.category);
  const selectedBrands = values(params.brand);
  const selectedPrice = values(params.price)[0] ?? "";
  const minimumRating = Number(values(params.rating)[0] ?? 0);
  const sort = values(params.sort)[0] ?? "featured";
  const categories = [...new Set(products.map((product) => product.categoryID))];
  const brands = [...new Set(products.map((product) => product.brand))];

  const filteredProducts = products.filter((product) => {
    const searchableText = `${product.name} ${product.brand} ${product.description} ${product.categoryID}`.toLowerCase();
    const price = product.price * (1 - product.discount / 100);
    const matchesPrice = !selectedPrice ||
      (selectedPrice === "under-50" && price < 50) ||
      (selectedPrice === "50-100" && price >= 50 && price <= 100) ||
      (selectedPrice === "over-100" && price > 100);

    return (!query || searchableText.includes(query.toLowerCase())) &&
      (!selectedCategories.length || selectedCategories.includes(product.categoryID)) &&
      (!selectedBrands.length || selectedBrands.includes(product.brand)) &&
      (!minimumRating || product.rating >= minimumRating) && matchesPrice;
  });

  if (sort === "price-low") filteredProducts.sort((left, right) => left.price * (1 - left.discount / 100) - right.price * (1 - right.discount / 100));
  if (sort === "price-high") filteredProducts.sort((left, right) => right.price * (1 - right.discount / 100) - left.price * (1 - left.discount / 100));
  if (sort === "rating") filteredProducts.sort((left, right) => right.rating - left.rating);

  return (
    <main className="min-h-screen bg-white px-3 pb-14 pt-40 text-[#0f1111] sm:px-5 sm:pt-32 lg:px-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="-mx-3 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#d5d9d9] px-3 py-3 sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7">
          <p className="text-sm">
            {filteredProducts.length ? `1-${filteredProducts.length} of ${filteredProducts.length} results` : "No results"}
            {query && <> for <span className="font-semibold text-[#c45500]">&quot;{query}&quot;</span></>}
          </p>
          <form action="/customer/products" className="flex h-9 items-center gap-2 rounded-lg border border-[#d5d9d9] bg-[#f0f2f2] px-3 text-sm shadow-sm">
            {Object.entries(params).filter(([key]) => key !== "sort").flatMap(([key, value]) => values(value).map((entry) => <input key={`${key}-${entry}`} type="hidden" name={key} value={entry} />))}
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" name="sort" defaultValue={sort} className="max-w-40 bg-transparent font-medium outline-none">
              <option value="featured">Featured</option>
              <option value="rating">Avg. customer review</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
            <button type="submit" className="text-xs font-semibold text-[#007185] hover:underline">Apply</button>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[215px_minmax(0,1fr)] lg:gap-6">
          <aside className="h-fit border-b border-[#ddd] pb-4 lg:border-0 lg:pb-0">
            <details className="group lg:block" open>
              <summary className="cursor-pointer list-none text-lg font-bold lg:hidden">Filters</summary>
              <div className="mt-4 grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1">
                <section>
                  <h2 className="text-base font-bold">Popular shopping ideas</h2>
                  <div className="mt-2 space-y-0.5">
                    {categories.map((category) => (
                      <Link key={category} href={filterHref(params, "category", category)} className="block py-1 text-sm leading-5 hover:text-[#c45500] hover:underline">{category}</Link>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-base font-bold">Department</h2>
                  <div className="mt-2 space-y-0.5">
                    {categories.map((category) => (
                      <FilterOption key={category} href={filterHref(params, "category", category)} label={category} selected={selectedCategories.includes(category)} />
                    ))}
                  </div>
                </section>

                <section className="border-t border-[#ddd] pt-4">
                  <h2 className="text-base font-bold">Brands</h2>
                  <div className="mt-2 space-y-0.5">
                    {brands.map((brand) => (
                      <FilterOption key={brand} href={filterHref(params, "brand", brand)} label={brand} selected={selectedBrands.includes(brand)} />
                    ))}
                  </div>
                </section>

                <section className="border-t border-[#ddd] pt-4">
                  <h2 className="text-base font-bold">Customer reviews</h2>
                  <div className="mt-2 space-y-1">
                    {[4, 3, 2].map((rating) => (
                      <Link key={rating} href={filterHref(params, "rating", String(rating))} className="flex items-center gap-2 py-1 text-sm hover:text-[#c45500]" aria-label={`${rating} stars and up`}>
                        <span className="flex text-[#de7921]" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < rating ? "fill-current" : ""}`} />)}</span>
                        <span>&amp; Up</span>
                        {minimumRating === rating && <Check className="size-4 text-[#007185]" />}
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="border-t border-[#ddd] pt-4">
                  <h2 className="text-base font-bold">Price</h2>
                  <div className="mt-2 space-y-0.5">
                    {[
                      ["under-50", "Under $50"],
                      ["50-100", "$50 to $100"],
                      ["over-100", "$100 & above"],
                    ].map(([range, label]) => (
                      <FilterOption key={range} href={filterHref(params, "price", range)} label={label} selected={selectedPrice === range} />
                    ))}
                  </div>
                </section>

                <section className="border-t border-[#ddd] pt-4">
                  <h2 className="text-base font-bold">Condition</h2>
                  <p className="mt-2 text-sm text-[#0f1111]">New</p>
                </section>
              </div>
            </details>
          </aside>

          <section className="min-w-0">
            <h1 className="mb-3 text-xl font-bold">Results</h1>

            {filteredProducts.length ? (
              <div className="mt-4 space-y-3">
                {filteredProducts.map((product) => {
                  const salePrice = product.price * (1 - product.discount / 100);

                  return (
                    <article key={product.id} className="grid gap-3 rounded-lg border border-[#e7e9ec] p-2.5 transition-shadow hover:shadow-sm sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3 sm:p-3 lg:grid-cols-[220px_minmax(0,1fr)]">
                      <div className="relative h-36 overflow-hidden rounded-md bg-[#f5f5f5] sm:h-auto sm:aspect-square">
                        {product.discount > 0 && <span className="absolute left-2 top-2 z-10 rounded-sm bg-[#cc0c39] px-2 py-1 text-xs font-bold text-white">-{product.discount}%</span>}
                        <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 94vw, (max-width: 1023px) 150px, 220px" className="object-contain p-2.5 mix-blend-multiply" />
                      </div>

                      <div className="flex min-w-0 flex-col py-1">
                        <p className="text-sm font-bold text-[#565959]">{product.brand}</p>
                        <h2 className="mt-1 text-base leading-5 sm:text-lg">{product.name}</h2>
                        <p className="mt-1 text-xs text-[#565959]">Color: {product.color}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="flex text-[#de7921]" aria-label={`${product.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < Math.round(product.rating) ? "fill-current" : ""}`} />)}
                          </span>
                          <span className="text-[#007185]">({product.reviewCount})</span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#333]">{product.description}</p>
                        <p className="mt-1.5 text-xs text-[#565959]">Sold by <span className="text-[#007185]">{product.vendorCompanyName}</span></p>
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <p className="text-xl">{formatPrice(salePrice)}</p>
                          {product.discount > 0 && <p className="text-xs text-[#565959]">List price: <span className="line-through">{formatPrice(product.price)}</span></p>}
                        </div>
                        <p className={`mt-1 text-sm ${product.stock > 0 ? "text-[#007600]" : "text-[#b12704]"}`}>{product.stock > 0 ? "In stock" : "Currently unavailable"}</p>
                        <div className="mt-auto max-w-[230px] pt-2 [&>button]:mt-0 [&>button]:h-9"><AddToCartButton productId={product.id} productName={product.name} stock={product.stock} /></div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-[#d5d9d9] px-5 py-12 text-center">
                <h2 className="text-lg font-bold">No products found</h2>
                <p className="mt-2 text-sm text-[#565959]">Try changing or clearing your filters.</p>
                <Link href="/customer/products" className="mt-4 inline-flex rounded-full bg-[#f4c967] px-5 py-2 text-sm font-semibold hover:bg-[#f7d982]">Clear filters</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
