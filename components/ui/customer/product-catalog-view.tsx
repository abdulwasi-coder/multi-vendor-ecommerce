import Image from "next/image";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { AddToCartButton } from "@/components/ui/customer/add-to-cart-button";
import { Button } from "@/components/ui/button";

type SearchValue = string | string[] | undefined;

export type ProductSearchParams = Record<string, SearchValue>;

export interface CategoryOption {
  id: string;
  name: string;
}

export interface AttributeFilterDefinition {
  key: string;
  label: string;
  type: string;
  unit?: string;
  options?: string[];
}

interface ProductFeedItem {
  id: string;
  name: string;
  description: string;
  brand: string;
  categoryID: string;
  categoryId: string;
  stock: number;
  price: number;
  discount: number;
  color: string;
  rating: number;
  reviewCount: number;
  images: string[];
}

interface NumericRange {
  min: number;
  max: number;
}

export interface ProductFeedResponse {
  success: boolean;
  message?: string;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  skipped: number;
  limit: number;
  products: ProductFeedItem[];
  department: { id: string; name: string } | null;
  categories: CategoryOption[];
  selectedCategory: (CategoryOption & {
    attributes?: AttributeFilterDefinition[];
    brands?: string[];
  }) | null;
  brands: string[];
  selectedBrands: string[];
  colors: string[];
  selectedColors: string[];
  priceRange: NumericRange | null;
  ratingRange: NumericRange | null;
}

interface ProductCatalogViewProps {
  params: ProductSearchParams;
  feed: ProductFeedResponse | undefined;
  loadError: string | undefined;
  products: ProductFeedItem[];
  categories: CategoryOption[];
  brands: string[];
  colors: string[];
  activeCategoryNames: string;
  firstResult: number;
  lastResult: number;
}

function values(value: SearchValue) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function filterHref(params: ProductSearchParams, key: string, value: string) {
  const search = new URLSearchParams();
  for (const [param, paramValue] of Object.entries(params)) {
    if (param === "page") continue;
    for (const entry of values(paramValue)) search.append(param, entry);
  }

  const existingValues = search.getAll(key);
  search.delete(key);
  const nextValues =
    key === "category"
      ? existingValues.includes(value)
        ? []
        : [value]
      : key === "brand" || key === "color" || key.startsWith("attr_")
        ? existingValues.includes(value)
          ? existingValues.filter((entry) => entry !== value)
          : [...existingValues, value]
        : existingValues.includes(value)
          ? []
          : [value];
  for (const entry of nextValues) search.append(key, entry);

  const query = search.toString();
  return query ? `/products?${query}` : "/products";
}

function pageHref(params: ProductSearchParams, page: number) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page") continue;
    for (const entry of values(value)) search.append(key, entry);
  }
  search.set("page", String(page));
  return `/products?${search.toString()}`;
}

function filterHrefWithout(
  params: ProductSearchParams,
  excludedKeys: string[],
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || excludedKeys.includes(key)) continue;
    for (const entry of values(value)) search.append(key, entry);
  }
  const query = search.toString();
  return query ? `/products?${query}` : "/products";
}

function HiddenFilters({
  params,
  excludedKeys,
}: {
  params: ProductSearchParams;
  excludedKeys: string[];
}) {
  return Object.entries(params)
    .filter(([key]) => key !== "page" && !excludedKeys.includes(key))
    .flatMap(([key, value]) =>
      values(value).map((entry) => (
        <input key={`${key}-${entry}`} type="hidden" name={key} value={entry} />
      )),
    );
}

function FilterOption({
  href,
  label,
  selected,
  checkbox = true,
}: {
  href: string;
  label: string;
  selected: boolean;
  checkbox?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      className={`flex items-center gap-2 py-1 text-sm leading-5 hover:text-[#c45500] ${
        selected && !checkbox ? "font-semibold text-[#c45500]" : ""
      }`}
    >
      {checkbox && (
        <span
          className={`grid size-4.25 shrink-0 place-items-center rounded-[3px] border ${
            selected
              ? "border-[#007185] bg-[#007185] text-white"
              : "border-[#888c8c] bg-white"
          }`}
        >
          {selected && <Check className="size-3.5" aria-hidden="true" />}
        </span>
      )}
      {label}
    </Link>
  );
}

export default function ProductCatalogView({
  params,
  feed,
  loadError,
  products,
  categories,
  brands,
  colors,
  activeCategoryNames,
  firstResult,
  lastResult,
}: ProductCatalogViewProps) {
  const attributeFilters = feed?.selectedCategory?.attributes ?? [];
  const query = values(params.q ?? params.search)[0]?.trim() ?? "";
  const selectedCategories = values(params.category).slice(0, 1);
  const selectedBrands = values(params.brand);
  const selectedColors = values(params.color);
  const sort = values(params.sort)[0] ?? "featured";

  return (
    <main className="min-h-screen bg-white px-3 pb-14 pt-40 text-[#0f1111] sm:px-5 sm:pt-32 lg:px-7">
      <div className="mx-auto max-w-400">
        <div className="-mx-3 mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#d5d9d9] px-3 py-3 sm:-mx-5 sm:px-5 lg:-mx-7 lg:px-7">
          <p className="text-sm">
            {feed
              ? feed.totalProducts
                ? `${firstResult}-${lastResult} of ${feed.totalProducts} results`
                : "No results"
              : "Products unavailable"}
            {activeCategoryNames && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-[#c45500]">
                  {activeCategoryNames}
                </span>
              </>
            )}
            {query && (
              <>
                {" "}
                for{" "}
                <span className="font-semibold text-[#c45500]">
                  &quot;{query}&quot;
                </span>
              </>
            )}
          </p>
          <form
            action="/products"
            className="flex h-9 items-center gap-2 rounded-lg border border-[#d5d9d9] bg-[#f0f2f2] px-3 text-sm shadow-sm"
          >
            {Object.entries(params)
              .filter(([key]) => key !== "sort" && key !== "page")
              .flatMap(([key, value]) =>
                values(value).map((entry) => (
                  <input
                    key={`${key}-${entry}`}
                    type="hidden"
                    name={key}
                    value={entry}
                  />
                )),
              )}
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="max-w-40 bg-transparent font-medium outline-none"
            >
              <option value="featured">Featured</option>
              <option value="rating">Avg. customer review</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
            <button
              type="submit"
              className="text-xs font-semibold text-[#007185] hover:underline"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="grid gap-5 lg:grid-cols-[215px_minmax(0,1fr)] lg:gap-6">
          <aside className="h-fit border-b border-[#ddd] pb-4 lg:border-0 lg:pb-0">
            <details className="group lg:block" open>
              <summary className="cursor-pointer list-none text-lg font-bold lg:hidden">
                Filters
              </summary>
              <div className="mt-4 grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1">
                {categories.length > 0 && (
                <section>
                  <h2 className="text-base font-bold">Categories</h2>
                  {categories.length ? (
                    <div className="mt-2 space-y-0.5">
                      {categories.map((category) => (
                        <FilterOption
                          key={category.id}
                          href={filterHref(params, "category", category.id)}
                          label={category.name}
                          selected={selectedCategories.includes(category.id)}
                          checkbox={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[#565959]">
                      No categories available.
                    </p>
                  )}
                </section>
                )}

                {brands.length > 0 && (
                  <section className="border-t border-[#ddd] pt-4">
                    <h2 className="text-base font-bold">Brands</h2>
                    <div className="mt-2 space-y-0.5">
                      {brands.map((brand) => (
                        <FilterOption
                          key={brand}
                          href={filterHref(params, "brand", brand)}
                          label={brand}
                          selected={selectedBrands.includes(brand)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {colors.length > 0 && (
                  <section className="border-t border-[#ddd] pt-4">
                    <h2 className="text-base font-bold">Color</h2>
                    <div className="mt-2 space-y-0.5">
                      {colors.map((color) => (
                        <FilterOption
                          key={color}
                          href={filterHref(params, "color", color)}
                          label={color}
                          selected={selectedColors.includes(color)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {attributeFilters.length > 0 && (
                  <section className="border-t border-[#ddd] pt-4">
                    <h2 className="text-base font-bold">Specifications</h2>
                    <div className="mt-2 space-y-3">
                      {attributeFilters.map((attribute) => {
                        const paramKey = `attr_${attribute.key}`;
                        const selectedValues = values(params[paramKey]);
                        if (attribute.type === "number") {
                          const minKey = `${paramKey}_min`;
                          const maxKey = `${paramKey}_max`;
                          return (
                            <form
                              key={attribute.key}
                              action="/products"
                              className="grid gap-1"
                            >
                              <HiddenFilters
                                params={params}
                                excludedKeys={[minKey, maxKey]}
                              />
                              <p className="text-sm font-medium">
                                {attribute.label}
                                {attribute.unit ? ` (${attribute.unit})` : ""}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  name={minKey}
                                  min={0}
                                  step="any"
                                  placeholder="Min"
                                  defaultValue={values(params[minKey])[0] ?? ""}
                                  className="h-8 w-full rounded-md border border-[#888c8c] px-2 text-sm"
                                />
                                <span className="text-xs text-[#565959]">–</span>
                                <input
                                  type="number"
                                  name={maxKey}
                                  min={0}
                                  step="any"
                                  placeholder="Max"
                                  defaultValue={values(params[maxKey])[0] ?? ""}
                                  className="h-8 w-full rounded-md border border-[#888c8c] px-2 text-sm"
                                />
                              </div>
                              <button
                                type="submit"
                                className="justify-self-start text-xs font-semibold text-[#007185] hover:underline"
                              >
                                Apply
                              </button>
                            </form>
                          );
                        }
                        if (attribute.type === "text") {
                          return (
                            <form
                              key={attribute.key}
                              action="/products"
                              className="grid gap-1"
                            >
                              <HiddenFilters
                                params={params}
                                excludedKeys={[paramKey]}
                              />
                              <label className="grid gap-1 text-sm font-medium">
                                {attribute.label}
                                <input
                                  type="text"
                                  name={paramKey}
                                  defaultValue={values(params[paramKey])[0] ?? ""}
                                  className="h-8 rounded-md border border-[#888c8c] px-2 text-sm"
                                />
                              </label>
                              <button
                                type="submit"
                                className="justify-self-start text-xs font-semibold text-[#007185] hover:underline"
                              >
                                Apply
                              </button>
                            </form>
                          );
                        }
                        if (attribute.type === "boolean") {
                          return (
                            <div key={attribute.key}>
                              <p className="text-sm font-medium">
                                {attribute.label}
                              </p>
                              <FilterOption
                                href={filterHref(params, paramKey, "true")}
                                label="Yes"
                                selected={selectedValues.includes("true")}
                              />
                            </div>
                          );
                        }
                        if (
                          attribute.type === "select" &&
                          attribute.options?.length
                        ) {
                          return (
                            <div key={attribute.key}>
                              <p className="text-sm font-medium">
                                {attribute.label}
                              </p>
                              <div className="mt-1 space-y-0.5">
                                {attribute.options.map((option) => (
                                  <FilterOption
                                    key={option}
                                    href={filterHref(
                                      params,
                                      paramKey,
                                      option,
                                    )}
                                    label={option}
                                    selected={selectedValues.includes(option)}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </section>
                )}
              </div>
            </details>
          </aside>

          <section className="min-w-0">
            <h1 className="mb-3 text-xl font-bold">
              {activeCategoryNames
                ? `Products in ${activeCategoryNames}`
                : "Products"}
            </h1>

            {loadError ? (
              <div className="mt-6 rounded-lg border border-red-200 px-5 py-12 text-center">
                <h2 className="text-lg font-bold">
                  Products could not be loaded
                </h2>
                <p role="alert" className="mt-2 text-sm text-[#565959]">
                  {loadError}
                </p>
              </div>
            ) : products.length ? (
              <div className="mt-4 space-y-2">
                {products.map((product) => {
                  const salePrice =
                    product.price * (1 - product.discount / 100);
                  const image = product.images[0];

                  return (
                    <article
                      key={product.id}
                      className="grid gap-3 rounded-lg border border-[#e7e9ec]/60 p-2.5 hover:shadow-xs sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-3 sm:p-3 lg:grid-cols-[220px_minmax(0,1fr)]"
                    >
                      <Link
                        href={`/products/${product.id}`}
                        className="relative block h-36 overflow-hidden rounded-md bg-[#f5f5f5] sm:h-auto sm:aspect-square"
                      >
                        {product.discount > 0 && (
                          <span className="absolute left-2 top-2 z-10 rounded-sm bg-[#cc0c39] px-2 py-1 text-xs font-bold text-white">
                            -{product.discount}%
                          </span>
                        )}
                        {image ? (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 639px) 94vw, (max-width: 1023px) 150px, 220px"
                            className="object-cover p-2.5 mix-blend-multiply"
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-sm text-[#565959]">
                            No image
                          </span>
                        )}
                      </Link>

                      <div className="flex min-w-0 flex-col">
                        <p className="text-sm font-bold text-[#565959]">
                          {product.brand}
                        </p>
                        <h2 className="mt-1 text-base leading-5 sm:text-lg">
                          <Link
                            href={`/products/${product.id}`}
                            className="hover:underline"
                          >
                            {product.name}
                          </Link>
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm text-[#565959]">
                          {product.description}
                        </p>
                        {product.color && (
                          <p className="mt-1 text-xs text-[#565959]">
                            Color: {product.color}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                          <span>{product.rating.toFixed(1)}</span>
                          <span
                            className="flex text-[#de7921]"
                            aria-label={`${product.rating} out of 5 stars`}
                          >
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star
                                key={index}
                                className={`size-3.5 ${
                                  index < Math.round(product.rating)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            ))}
                          </span>
                          <span className="text-[#007185]">
                            ({product.reviewCount})
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <p className="text-xl">{formatPrice(salePrice)}</p>
                          {product.discount > 0 && (
                            <p className="text-xs text-[#565959]">
                              List price:{" "}
                              <span className="line-through">
                                {formatPrice(product.price)}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="max-w-57.5 pt-2 [&>button]:mt-0 [&>button]:h-9">
                          <AddToCartButton
                            productId={product.id}
                            productName={product.name}
                            stock={product.stock}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-[#d5d9d9] px-5 py-12 text-center">
                <h2 className="text-lg font-bold">No products found</h2>
                <p className="mt-2 text-sm text-[#565959]">
                  Try changing or clearing your filters.
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex rounded-full bg-[#f4c967] px-5 py-2 text-sm font-semibold hover:bg-[#f7d982]"
                >
                  Clear filters
                </Link>
              </div>
            )}

            {feed && feed.totalPages > 1 && (
              <nav
                aria-label="Product pages"
                className="mt-6 flex items-center justify-center gap-4"
              >
                {feed.currentPage > 1 ? (
                  <Button
                    variant="outline"
                    render={
                      <Link href={pageHref(params, feed.currentPage - 1)} />
                    }
                  >
                    Previous
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                )}
                <span className="text-sm text-[#565959]">
                  Page {feed.currentPage} of {feed.totalPages}
                </span>
                {feed.currentPage < feed.totalPages ? (
                  <Button
                    variant="outline"
                    render={
                      <Link href={pageHref(params, feed.currentPage + 1)} />
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Next
                  </Button>
                )}
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
