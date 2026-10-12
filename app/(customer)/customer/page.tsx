import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Backpack,
  BadgePercent,
  Gift,
  HeartHandshake,
  Home,
  Lamp,
  Store,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/lib/vendor-products";
import { AddToCartButton } from "@/components/customer/add-to-cart-button";

const categories = [
  { name: "Home & kitchen", detail: "Everyday essentials", icon: Home },
  { name: "Bags & accessories", detail: "Made to go with you", icon: Backpack },
  { name: "Home decor", detail: "Make a space your own", icon: Lamp },
  { name: "Gifts & special finds", detail: "Little things with meaning", icon: Gift },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const featuredProduct = products.find((product) => product.discount > 0) ?? products[0];

function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  action,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex min-w-0 items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-500 sm:text-base">{eyebrow}</p>
        <h2 id={id} className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && action && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#176b5b] transition hover:text-[#104d42] sm:text-base"
        >
          {action}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const salePrice = product.price * (1 - product.discount / 100);

  return (
    <Card className="h-full gap-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white py-0 shadow-none transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-900/5">
      <Link
        href={`/customer/product/${product.id}`}
        className="group relative block aspect-[4/3] overflow-hidden bg-[#f1f0eb]"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#a03a32] shadow-sm">
            Save {product.discount}%
          </span>
        )}
      </Link>
      <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="truncate text-sm font-medium text-zinc-500">{product.vendorCompanyName}</p>
        <Link
          href={`/customer/product/${product.id}`}
          className="mt-1 line-clamp-2 min-h-12 text-base font-semibold leading-6 text-zinc-900 transition hover:text-[#176b5b] sm:text-lg"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <span className="tracking-[0.08em] text-[#cb8734]" aria-label={`${product.rating} out of 5 stars`}>
            {"★".repeat(Math.round(product.rating))}
          </span>
          <span className="text-zinc-600">{product.rating}</span>
          <span className="text-zinc-400">({product.reviewCount})</span>
        </div>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-4">
          <span className="text-lg font-semibold text-zinc-900 sm:text-xl">{currency.format(salePrice)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-zinc-500 line-through">{currency.format(product.price)}</span>
          )}
        </div>
        <AddToCartButton productId={product.id} productName={product.name} stock={product.stock} />
      </CardContent>
    </Card>
  );
}

export default function CustomerHomePage() {
  const deals = products.filter((product) => product.discount > 0);

  return (
    <div className="bg-[#f7f7f4] text-zinc-900">
      <div className="mx-auto max-w-[1440px] space-y-12 px-4 py-6 sm:space-y-16 sm:px-6 sm:py-9 lg:px-10 lg:py-12">
        <section
          aria-labelledby="welcome-heading"
          className="grid min-w-0 overflow-hidden rounded-2xl bg-[#e8eee8] md:grid-cols-2 md:rounded-3xl"
        >
          <div className="flex min-w-0 flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#cdd8ce] bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#31594c] sm:text-base">
              <HeartHandshake className="size-4" aria-hidden="true" /> Thoughtful finds, from small shops
            </p>
            <h1
              id="welcome-heading"
              className="mt-5 max-w-xl text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-[#1c3028] sm:text-5xl lg:text-6xl"
            >
              Find something worth keeping.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Discover useful, beautiful things from independent sellers who care about what they make.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/customer/products"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#19392f] px-5 text-base font-semibold text-white transition hover:bg-[#285447]"
              >
                Shop all products <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/customer/top-discounts"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#c5d0c5] bg-white/70 px-5 text-base font-semibold text-[#25473c] transition hover:bg-white"
              >
                <BadgePercent className="size-4" aria-hidden="true" /> See the deals
              </Link>
            </div>
            <p className="mt-7 border-t border-[#cbd5cb] pt-4 text-sm font-medium text-zinc-600 sm:text-base">
              Independent brands <span className="mx-2 text-zinc-400">·</span> Curated with care
            </p>
          </div>

          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[#d9e2d9] p-5 sm:min-h-[390px] sm:p-8">
            <div aria-hidden="true" className="absolute -right-12 -top-16 size-56 rounded-full border-[28px] border-white/30 sm:size-72" />
            <Link
              href={`/customer/product/${featuredProduct.id}`}
              aria-label={`View ${featuredProduct.name}`}
              className="group relative block h-[270px] w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-xl sm:h-[330px]"
            >
              <Image
                src={featuredProduct.images[0]}
                alt={featuredProduct.name}
                fill
                priority
                sizes="(max-width: 767px) 90vw, 45vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {featuredProduct.discount > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#a03a32] shadow sm:left-4 sm:top-4">
                  A little something off
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-16 text-white sm:px-5 sm:pb-5">
                <span className="block text-sm text-white/85">{featuredProduct.vendorCompanyName} · ★ {featuredProduct.rating}</span>
                <span className="mt-1 block text-xl font-semibold sm:text-2xl">{featuredProduct.name}</span>
                <span className="mt-1 block text-base font-medium">
                  {currency.format(featuredProduct.price * (1 - featuredProduct.discount / 100))}
                </span>
              </span>
            </Link>
          </div>
        </section>

        <section id="shop-categories" aria-labelledby="categories-heading" className="space-y-5">
          <SectionHeading
            id="categories-heading"
            eyebrow="Start with what you love"
            title="Explore the collections"
            href="/customer/products"
            action="Browse everything"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <Link
                  key={category.name}
                  href="/customer/products"
                  className="group flex min-h-[104px] min-w-0 items-center gap-3 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#c4d2c8] hover:shadow-md sm:min-h-[116px] sm:gap-4 sm:p-5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef2ec] text-[#31594c] transition group-hover:bg-[#dfe9df] sm:size-12">
                    <CategoryIcon className="size-5 sm:size-[22px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-snug text-zinc-900 sm:text-lg">{category.name}</span>
                    <span className="mt-1 block text-sm leading-5 text-zinc-500">{category.detail}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-[#31594c]" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        {products.length > 0 && (
          <section aria-labelledby="picks-heading" className="space-y-5">
            <SectionHeading
              id="picks-heading"
              eyebrow="Picked from independent shops"
              title="A few good finds"
              href="/customer/top-rated"
              action="See top rated"
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </section>
        )}

        {deals.length > 0 && (
          <section aria-labelledby="deals-heading" className="overflow-hidden rounded-2xl bg-[#f0e7d8] sm:rounded-3xl">
            <div className="grid items-center gap-5 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:gap-8 lg:px-10">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#8c5a2c] sm:text-base">
                  <BadgePercent className="size-4" aria-hidden="true" /> A good time to treat yourself
                </p>
                <h2 id="deals-heading" className="mt-2 text-2xl font-semibold tracking-tight text-[#35291f] sm:text-3xl">
                  Find a favorite for a little less.
                </h2>
                <p className="mt-2 max-w-xl text-base leading-7 text-[#6f6255]">
                  Browse current offers from the shops behind your favorite finds.
                </p>
              </div>
              <Link
                href="/customer/top-discounts"
                className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#7b4929] px-5 text-base font-semibold text-white transition hover:bg-[#63391f]"
              >
                Shop all discounts <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}

        <section aria-labelledby="seller-heading" className="relative overflow-hidden rounded-2xl bg-[#19392f] text-white sm:rounded-3xl">
          <div aria-hidden="true" className="absolute -right-12 -top-24 size-64 rounded-full border-[36px] border-white/[0.06] sm:size-80" />
          <div className="relative grid gap-6 p-6 sm:p-9 md:grid-cols-[1fr_auto] md:items-center md:gap-8 lg:px-12 lg:py-10">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#c2d5c3] sm:text-base">For independent makers</p>
              <h2 id="seller-heading" className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Have something lovely to share?
              </h2>
              <p className="mt-2 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                Bring your shop to a marketplace built for thoughtful products and the people who make them.
              </p>
            </div>
            <Link
              href="/vendor/create"
              className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-lg bg-[#f2bd72] px-5 text-base font-semibold text-[#26342d] transition hover:bg-[#ffd28f]"
            >
              Open your shop <Store className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
