import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Box, HeartHandshake, Leaf, Sparkles } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { categories, featuredProducts, newProducts } from "@/lib/homepage-content";

const benefits = [
  { icon: Sparkles, title: "A considered edit", text: "Everyday essentials alongside the unexpected." },
  { icon: Box, title: "Little details matter", text: "Useful things, chosen with an eye for the details." },
  { icon: HeartHandshake, title: "Make it your own", text: "Find a mix that feels right at home with you." },
  { icon: Leaf, title: "Room to live well", text: "Pieces to make ordinary moments feel special." },
];

function SectionHeading({
  eyebrow,
  title,
  id,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  id: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</p>
        <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {href && linkLabel ? (
        <Link href={href} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {linkLabel}<ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : null}
    </div>
  );
}

export default function Home() {
  return (
    <main className="w-full min-w-0">
      <section className="mx-auto grid w-full min-w-0 max-w-7xl gap-8 px-4 pb-14 pt-7 sm:px-6 sm:pb-20 sm:pt-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-24 lg:pt-12">
        <div className="home-enter order-1 min-w-0 max-w-xl lg:order-1">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:mb-5">The Town Market edit</p>
          <h1 className="max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            Good things for the way you live.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg">
            A thoughtful mix of everyday essentials, little luxuries, and pieces that feel like you.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
            <Link href="#featured" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Explore the edit <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link href="#categories" className="inline-flex min-h-12 items-center justify-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Find your thing
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground sm:mt-10">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="size-8 rounded-full border-2 border-background bg-secondary" />
              <span className="size-8 rounded-full border-2 border-background bg-muted" />
              <span className="size-8 rounded-full border-2 border-background bg-secondary" />
            </span>
            <span>A little inspiration for every day</span>
          </div>
        </div>
        <div className="home-enter home-enter-delay relative order-2 min-h-[300px] min-w-0 overflow-hidden rounded-md bg-muted sm:min-h-[440px] lg:order-2 lg:min-h-[540px]">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=90"
            alt="Sunlit modern boutique with a curated collection of clothing"
            fill
            priority
            unoptimized
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-background sm:bottom-7 sm:left-7 sm:right-7">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-background/80">A fresh point of view</p>
              <p className="mt-1 text-xl font-medium tracking-tight sm:text-2xl">Find something good.</p>
            </div>
            <ArrowDownRight aria-hidden="true" className="mb-1 shrink-0" size={24} />
          </div>
        </div>
      </section>

      <section id="categories" aria-labelledby="categories-heading" className="border-y border-border bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading id="categories-heading" eyebrow="Browse the collection" title="A good place to start" />
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map((category, index) => (
              <article key={category.name} className={`group min-w-0 ${index % 2 === 1 ? "sm:mt-8" : ""}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    fill
                    priority={index === 0}
                    unoptimized
                    sizes="(max-width: 639px) 46vw, (max-width: 1023px) 45vw, 23vw"
                    className="object-cover transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-[1.035]"
                  />
                </div>
                <h3 className="mt-3 text-sm font-medium sm:mt-4 sm:text-base">{category.name}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{category.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" aria-labelledby="featured-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading id="featured-heading" eyebrow="The favorites" title="A few good finds" />
        <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Preview collection · Product details and availability are not connected yet.</p>
      </section>

      <section aria-label="Seasonal selection" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative isolate min-h-[340px] overflow-hidden rounded-md bg-muted sm:min-h-[400px]">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=85"
            alt="A warm, welcoming shop interior with carefully arranged pieces"
            fill
            unoptimized
            sizes="(max-width: 1279px) 100vw, 1280px"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-foreground/45" aria-hidden="true" />
          <div className="flex min-h-[340px] max-w-xl flex-col items-start justify-center px-6 py-10 text-background sm:min-h-[400px] sm:px-12 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-background/75">Little details, big difference</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Make room for the things you love.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-background/85 sm:text-base">Thoughtful pieces for slower mornings, easy afternoons, and all the moments in between.</p>
            <Link href="#new-arrivals" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-md bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground">
              See what&apos;s new <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section id="new-arrivals" aria-labelledby="new-arrivals-heading" className="border-y border-border bg-muted/30">
        <div className="mx-auto min-w-0 max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading id="new-arrivals-heading" eyebrow="Just landed" title="New to the edit" />
          <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
            {newProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Preview collection · Product details and availability are not connected yet.</p>
        </div>
      </section>

      <section aria-labelledby="benefits-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 max-w-xl sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">The Town Market way</p>
          <h2 id="benefits-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">A little more thought in every detail.</h2>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t border-border pt-4">
              <Icon aria-hidden="true" size={21} strokeWidth={1.7} className="text-muted-foreground" />
              <h3 className="mt-4 text-sm font-medium">{title}</h3>
              <p className="mt-1.5 max-w-xs text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="newsletter-heading" className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">A note from us</p>
            <h2 id="newsletter-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">Good finds, now and then.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Occasional inspiration and new arrivals, delivered thoughtfully.</p>
          </div>
          <div className="w-full max-w-md">
            <label htmlFor="newsletter-email" className="mb-2 block text-sm font-medium">Your email address</label>
            <div className="flex gap-2">
              <input id="newsletter-email" type="email" autoComplete="email" disabled placeholder="you@example.com" aria-describedby="newsletter-status" className="h-12 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70" />
              <button type="button" disabled aria-describedby="newsletter-status" className="min-h-12 shrink-0 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">Coming soon</button>
            </div>
            <p id="newsletter-status" className="mt-2 text-xs text-muted-foreground">Email sign-up isn&apos;t available yet.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
