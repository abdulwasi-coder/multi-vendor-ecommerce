import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Flame } from "lucide-react";
import { AddToCartButton } from "@/components/ui/customer/add-to-cart-button";
import { products } from "@/lib/vendor-products";

const categories = [
  { label: "Home & Kitchen", value: "Home & kitchen" },
  { label: "Baby", value: "Baby & Kids" },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default async function TopDiscountsPage({ searchParams }: PageProps<"/customer/top-discounts">) {
  const params = await searchParams;
  const requestedCategory = typeof params.category === "string" ? params.category : "";
  const selectedCategory = categories.find((category) => category.value === requestedCategory)?.value ?? "Home & kitchen";
  const deals = products.filter((product) => product.categoryID === selectedCategory && product.discount > 0);

  return (
    <main className="min-h-screen bg-[#eaeded] pb-14 pt-40 text-[#0f1111] sm:pt-32">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-5 lg:px-8">
        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#232f3e] to-[#37475a] px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#ffd814]"><Flame className="size-4" /> Deals for you</div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Today&apos;s Deals</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Discover a few good finds for your home and little ones.</p>
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-[#d5d9d9] px-4 py-3 sm:px-6">
            {categories.map((category) => {
              const selected = selectedCategory === category.value;
              return (
                <Link key={category.value} href={`/customer/top-discounts?category=${encodeURIComponent(category.value)}`} aria-current={selected ? "page" : undefined}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${selected ? "border-[#232f3e] bg-[#232f3e] text-white" : "border-[#d5d9d9] bg-white text-[#0f1111] hover:border-[#879596] hover:bg-[#f7fafa]"}`}>
                  {category.label}
                </Link>
              );
            })}
          </div>

          <div className="px-4 py-5 sm:px-6 sm:py-7">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">Deals in {selectedCategory}</h2>
                <p className="mt-1 text-sm text-[#565959]">{deals.length} deals to explore</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#565959]"><Clock3 className="size-3.5" />Prices shown are current catalog offers</span>
            </div>

            {deals.length ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {deals.map((product) => {
                  const dealPrice = product.price * (1 - product.discount / 100);
                  return (
                    <article key={product.id} className="overflow-hidden rounded-xl border border-[#d5d9d9] bg-white transition hover:shadow-md">
                      <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="relative block aspect-[4/3] bg-[#f7f7f7]">
                        <span className="absolute left-3 top-3 z-10 rounded-sm bg-[#cc0c39] px-2.5 py-1 text-xs font-bold text-white">-{product.discount}%</span>
                        <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 94vw, (max-width: 1279px) 45vw, 30vw" className="object-contain p-5 mix-blend-multiply" />
                      </Link>
                      <div className="p-4">
                        <p className="text-xs font-medium text-[#565959]">{product.brand}</p>
                        <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="mt-1 line-clamp-2 min-h-10 font-semibold leading-5 hover:text-[#c45500] hover:underline">{product.name}</Link>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-2xl">{currency.format(dealPrice)}</span>
                          <span className="text-sm text-[#565959]">List: <span className="line-through">{currency.format(product.price)}</span></span>
                        </div>
                        <p className="mt-1 text-sm text-[#cc0c39]">Save {currency.format(product.price - dealPrice)} ({product.discount}%)</p>
                        <div className="mt-4"><AddToCartButton productId={product.id} productName={product.name} stock={product.stock} /></div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-[#d5d9d9] bg-[#f7fafa] px-5 py-12 text-center">
                <h3 className="text-lg font-bold">No deals in this department yet</h3>
                <p className="mt-2 text-sm text-[#565959]">Try another department or browse all products.</p>
                <Link href="/customer/products" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#007185] hover:text-[#c45500] hover:underline">Browse all products <ArrowRight className="size-4" /></Link>
              </div>
            )}
          </div>
        </section>
        <p className="mt-4 text-center text-xs text-[#565959]">Deal prices come from the product catalog and may change when product offers are updated.</p>
      </div>
    </main>
  );
}
