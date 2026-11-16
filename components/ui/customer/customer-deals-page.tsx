import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";
import { AddToCartButton } from "@/components/ui/customer/add-to-cart-button";
import {
  PendingCheckbox,
  PendingLabel,
  PendingRadio,
} from "@/components/ui/customer/pending-filter";
import { CategoryStrip } from "@/components/ui/customer/category-strip";

interface DealProduct {
  id: string;
  name: string;
  brand?: string;
  price: number;
  discount?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  color?: string;
  category?: string;
  savings?: number;
  images: string[];
}

interface TopDiscountsResponse {
  success: boolean;
  minDiscount: number;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  products: DealProduct[];
  departments: { id: string; name: string }[];
  siblings: { id: string; name: string }[];
  brands: { name: string; count: number }[];
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const PAGE_SIZE = 30;

function filterHref({
  category,
  brand,
  page,
}: {
  category?: string;
  brand?: string;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (brand) params.set("brand", brand);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/top-discounts?${query}` : "/top-discounts";
}

export default async function CustomerDealsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    brand?: string | string[];
    page?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const first = (value?: string | string[]) =>
    typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined;

  const category = first(params.category) ?? "";
  const brand = first(params.brand) ?? "";
  const page = Math.max(1, Math.floor(Number(first(params.page))) || 1);

  const backendUrl = process.env.Base_Url;
  if (!backendUrl) notFound();

  const query = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) });
  if (category) query.set("category", category);
  if (brand) query.set("brand", brand);

  let data: TopDiscountsResponse | null = null;
  try {
    const response = await fetch(new URL(`/user/top-discounts?${query}`, backendUrl), {
      next: { revalidate: 60, tags: ["top-discounts"] },
    });
    const json = (await response.json()) as TopDiscountsResponse;
    if (response.ok && json?.success) data = json;
  } catch {
    data = null;
  }

  const deals = data?.products ?? [];
  const departments = data?.departments ?? [];
  const siblings = data?.siblings ?? [];
  const brands = data?.brands ?? [];
  const minDiscount = data?.minDiscount ?? 15;
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? page;
  const totalProducts = data?.totalProducts ?? 0;

  const selectedDepartment = departments.find((d) => d.id === category);
  const selectedBrand = brands.find((b) => b.name === brand)?.name;

  return (
    <main className="min-h-screen bg-white pb-14 pt-40 text-[#0f1111] sm:pt-32">
      <div className="mx-auto max-w-[1600px]">
        <h1 className="sr-only">Today&apos;s Deals</h1>
        <CategoryStrip
          basePath="/top-discounts"
          params={brand ? { brand } : {}}
          items={departments}
          selectedId={category}
          allLabel="All Categories"
        />

        <div className={`grid gap-5 px-4 py-5 sm:px-6 lg:gap-5 lg:px-8 lg:py-7 ${category ? "lg:grid-cols-[180px_minmax(0,1fr)]" : ""}`}>
          {category && (
          <aside className="h-fit border-b border-[#d5d9d9] pb-4 lg:border-0 lg:pb-0">
            <details className="group" open>
              <summary className="cursor-pointer list-none text-lg font-bold lg:hidden">Filters</summary>
              <div className="mt-3 space-y-5 lg:mt-0">
                <section>
                  <h2 className="text-sm font-bold">Filtered by</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDepartment && <span className="rounded-full border border-[#007185] bg-[#eaf6f7] px-3 py-1 text-xs font-semibold">{selectedDepartment.name}</span>}
                    {selectedBrand && <span className="rounded-full border border-[#007185] bg-[#eaf6f7] px-3 py-1 text-xs font-semibold">{selectedBrand}</span>}
                  </div>
                  <Link href={filterHref({ category })} scroll={false} className="mt-3 inline-block text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                    <PendingLabel>Clear filters</PendingLabel>
                  </Link>
                </section>

                <section className="border-t border-[#d5d9d9] pt-4">
                  <h2 className="text-base font-bold">Categories</h2>
                  {siblings.map((sibling) => (
                    <Link key={sibling.id} href={filterHref({ category: sibling.id, brand, page: 1 })} scroll={false} className="mt-2 flex items-center gap-2 text-sm hover:text-[#c45500]" aria-current={category === sibling.id ? "true" : undefined}>
                      <PendingRadio selected={category === sibling.id} />
                      <PendingLabel>{sibling.name}</PendingLabel>
                    </Link>
                  ))}
                </section>

                {brands.length > 0 && (
                  <section className="border-t border-[#d5d9d9] pt-4">
                    <h2 className="text-base font-bold">Brands</h2>
                    <div className="mt-2 space-y-2">
                      {brands.map((item) => {
                        const checked = selectedBrand === item.name;
                        return (
                          <Link key={item.name} href={filterHref({ category, brand: checked ? undefined : item.name, page: 1 })} scroll={false} className="flex items-center gap-2 text-sm hover:text-[#c45500]" aria-current={checked ? "true" : undefined}>
                            <PendingCheckbox selected={checked} className="size-[17px]" />
                            <PendingLabel>{item.name}</PendingLabel>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            </details>
          </aside>
          )}

          <section className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-2 pb-3">
              <div>
                <h2 className="text-xl font-bold">Today&apos;s Deals{selectedDepartment ? ` in ${selectedDepartment.name}` : ""}</h2>
                <p className="mt-1 text-sm text-[#565959]">Showing {totalProducts} deals with {minDiscount}%+ off</p>
              </div>
              <p className="text-xs text-[#565959]">Sort: Biggest discount</p>
            </div>

            {deals.length ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-2 lg:grid-cols-4 xl:grid-cols-5">
                  {deals.map((product) => {
                    const discount = product.discount ?? 0;
                    const dealPrice = product.price * (1 - discount / 100);
                    const savings = product.savings ?? product.price - dealPrice;
                    return (
                      <article key={product.id} className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#f4f4f4] bg-white p-3 transition hover:shadow-md sm:p-2">
                        <Link href={`/products/${product.id}`} className="relative block aspect-square w-full overflow-hidden rounded-md bg-[#f7f8f8]">
                          {product.images[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 90vw, 220px" className="object-cover p-1 mix-blend-multiply" />
                          ) : (
                            <span className="grid size-full place-items-center text-xs text-[#879596]">No image</span>
                          )}
                          <span className="absolute left-2 top-2 rounded-sm bg-[#cc0c39] px-1.5 py-0.5 text-xs font-bold text-white">-{Math.round(discount)}%</span>
                          <span className="absolute bottom-2 right-2 grid size-9 place-items-center rounded-full bg-[#ffd814] text-xl font-medium shadow-sm" aria-label="View deal">+</span>
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col items-start">
                          <p className="truncate text-xs font-semibold text-[#565959]">{product.brand ?? product.category ?? ""}</p>
                          <Link href={`/products/${product.id}`} className="mt-1 line-clamp-2 min-h-10 py-1 text-sm leading-5 hover:text-[#c45500] hover:underline">{product.name}</Link>
                          <div className="flex items-center gap-1.5 text-xs">
                            <span>{product.rating.toFixed(1)}</span>
                            <span className="flex text-[#de7921]" aria-label={`${product.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < Math.round(product.rating) ? "fill-current" : ""}`} />)}</span>
                            <span className="text-[#007185]">{product.reviewCount}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
                            <span className="text-xl font-medium">{currency.format(dealPrice)}</span>
                            <span className="text-xs text-[#565959]">List: <span className="line-through">{currency.format(product.price)}</span></span>
                          </div>
                          <p className="mt-1 text-xs font-semibold text-[#cc0c39]">Save {currency.format(savings)}</p>
                          {product.color && <p className="mt-0.5 line-clamp-1 text-xs text-[#565959]">{product.color}</p>}
                          <div className="mt-auto w-full [&>button]:h-9 [&>button]:px-2 [&>button]:text-xs">
                            <AddToCartButton product={{ id: product.id, name: product.name, price: product.price, discount, stock: product.stock, color: product.color, image: product.images?.[0], brand: product.brand }} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <Link href={filterHref({ category, brand, page: currentPage - 1 })} scroll={false} aria-disabled={currentPage <= 1}
                      className={`inline-flex h-9 items-center rounded-full border border-[#d5d9d9] bg-white px-4 text-sm shadow-sm ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-[#f7fafa]"}`}>
                      <ChevronRight className="size-4 rotate-180" /> Previous
                    </Link>
                    <span className="text-sm text-[#565959]">Page {currentPage} of {totalPages}</span>
                    <Link href={filterHref({ category, brand, page: currentPage + 1 })} scroll={false} aria-disabled={currentPage >= totalPages}
                      className={`inline-flex h-9 items-center rounded-full border border-[#d5d9d9] bg-white px-4 text-sm shadow-sm ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-[#f7fafa]"}`}>
                      Next <ChevronRight className="size-4" />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-sm text-[#565959]">
                {data ? `No deals with ${minDiscount}%+ off right now.` : "Today's deals could not be loaded. Please try again later."}
              </div>
            )}
          </section>
        </div>
        <p className="px-4 text-xs text-[#767676] sm:px-6 lg:px-8">Deal prices are based on the current catalog discounts.</p>
      </div>
    </main>
  );
}
