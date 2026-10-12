import Image from "next/image";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { AddToCartButton } from "@/components/customer/add-to-cart-button";
import { products } from "@/lib/vendor-products";

type SearchValue = string | string[] | undefined;

function firstValue(value: SearchValue) {
  return Array.isArray(value) ? value[0] : value;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default async function ProductsPage({ searchParams }: PageProps<"/customer/products">) {
  const params = await searchParams;
  const query = firstValue(params.q)?.trim() ?? "";
  const selectedCategory = firstValue(params.category) ?? "";
  const sort = firstValue(params.sort) ?? "featured";
  const categories = [...new Set(products.map((product) => product.categoryID))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.categoryID === selectedCategory;
    const searchableText = `${product.name} ${product.brand} ${product.description} ${product.categoryID}`.toLowerCase();
    return matchesCategory && (!query || searchableText.includes(query.toLowerCase()));
  });

  if (sort === "price-low") filteredProducts.sort((left, right) => left.price * (1 - left.discount / 100) - right.price * (1 - right.discount / 100));
  if (sort === "price-high") filteredProducts.sort((left, right) => right.price * (1 - right.discount / 100) - left.price * (1 - left.discount / 100));
  if (sort === "rating") filteredProducts.sort((left, right) => right.rating - left.rating);

  return (
    <main className="min-h-screen bg-white px-4 pb-16 pt-36 text-[#0f1111] sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 rounded-lg bg-[#f5f6f6] px-5 py-5 sm:px-8 sm:py-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#565959]">Marketly marketplace</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Find your next favorite</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#565959]">Shop thoughtful finds from independent sellers, all in one place.</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-lg border border-[#d5d9d9] p-4 lg:border-0 lg:p-0">
            <form action="/customer/products" className="space-y-5">
              <input type="hidden" name="q" value={query} />
              <div>
                <h2 className="text-base font-bold">Department</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  <li><Link href="/customer/products" className={`hover:text-[#c45500] hover:underline ${!selectedCategory ? "font-bold" : ""}`}>All departments</Link></li>
                  {categories.map((category) => (
                    <li key={category}><Link href={`/customer/products?category=${encodeURIComponent(category)}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={`hover:text-[#c45500] hover:underline ${selectedCategory === category ? "font-bold" : ""}`}>{category}</Link></li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-[#ddd] pt-4">
                <label htmlFor="sort" className="text-sm font-bold">Sort by</label>
                <select id="sort" name="sort" defaultValue={sort} className="mt-2 h-10 w-full rounded-md border border-[#888c8c] bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-[#f3a847]">
                  <option value="featured">Featured</option>
                  <option value="rating">Average customer review</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
                {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
                <button type="submit" className="mt-3 w-full rounded-full border border-[#d5d9d9] bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-[#f7fafa]">Apply sort</button>
              </div>
            </form>
            <div className="mt-5 hidden rounded-lg bg-[#f7f7f7] p-4 text-sm leading-6 text-[#565959] lg:block">
              <p className="font-bold text-[#0f1111]">Shop small, find something special.</p>
              <p className="mt-1">Every order supports an independent seller.</p>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#ddd] pb-4">
              <div>
                <h2 className="text-xl font-bold">{query ? `Results for “${query}”` : selectedCategory || "All products"}</h2>
                <p className="mt-1 text-sm text-[#565959]">{filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}</p>
              </div>
              <form action="/customer/products" className="flex h-10 w-full max-w-sm overflow-hidden rounded-md border border-[#888c8c] focus-within:ring-2 focus-within:ring-[#f3a847]">
                {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
                {sort !== "featured" && <input type="hidden" name="sort" value={sort} />}
                <label htmlFor="product-search" className="sr-only">Search products</label>
                <input id="product-search" type="search" name="q" defaultValue={query} placeholder="Search all products" className="min-w-0 flex-1 px-3 text-sm outline-none" />
                <button type="submit" aria-label="Search products" className="grid w-11 place-items-center bg-[#f3a847] text-[#131921] hover:bg-[#f7bd68]"><Search className="size-5" /></button>
              </form>
            </div>

            {filteredProducts.length ? (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const salePrice = product.price * (1 - product.discount / 100);

                  return (
                    <article key={product.id} className="flex min-w-0 flex-col rounded-lg border border-[#d5d9d9] p-3 transition-shadow hover:shadow-md sm:p-4">
                      <div className="group">
                        <div className="relative aspect-[1.1/1] overflow-hidden rounded-md bg-[#f7f7f7]">
                          {product.discount > 0 && <span className="absolute left-2 top-2 z-10 rounded-sm bg-[#cc0c39] px-2 py-1 text-xs font-bold text-white">-{product.discount}%</span>}
                          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 90vw, (max-width: 1279px) 44vw, 28vw" className="object-contain p-3 mix-blend-multiply transition-transform duration-200 group-hover:scale-[1.03]" />
                        </div>
                        <p className="mt-4 line-clamp-1 text-xs text-[#565959]">{product.brand}</p>
                        <h3 className="mt-1 line-clamp-2 min-h-12 font-semibold leading-6 group-hover:text-[#c45500]">{product.name}</h3>
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-sm">
                        <span className="font-medium">{product.rating.toFixed(1)}</span>
                        <span className="flex text-[#de7921]" aria-label={`${product.rating} out of 5 stars`}>
                          {Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < Math.round(product.rating) ? "fill-current" : ""}`} />)}
                        </span>
                        <span className="text-[#007185]">({product.reviewCount})</span>
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-xl font-bold">{formatPrice(salePrice)}</p>
                        {product.discount > 0 && <p className="text-xs text-[#565959]">List: <span className="line-through">{formatPrice(product.price)}</span></p>}
                      </div>
                      <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-[#565959]">{product.description}</p>
                      <p className="mt-2 text-xs text-[#565959]">Sold by {product.vendorCompanyName}</p>
                      <div className="mt-auto pt-1"><AddToCartButton productId={product.id} productName={product.name} stock={product.stock} /></div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-[#d5d9d9] px-5 py-12 text-center">
                <h3 className="text-lg font-bold">No products found</h3>
                <p className="mt-2 text-sm text-[#565959]">Try another search or browse all products.</p>
                <Link href="/customer/products" className="mt-4 inline-flex rounded-full bg-[#f4c967] px-5 py-2 text-sm font-semibold hover:bg-[#f7d982]">Browse all products</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
