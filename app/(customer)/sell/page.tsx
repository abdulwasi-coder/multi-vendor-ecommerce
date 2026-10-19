import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, ChartNoAxesCombined, CircleQuestionMark, PackagePlus, ShoppingBag, Store, Truck } from "lucide-react";

const sellerBenefits = [
  {
    title: "Reach marketplace shoppers",
    description: "List your products where customers already come to discover and shop.",
    icon: ShoppingBag,
  },
  {
    title: "Keep your catalog organized",
    description: "Add product photos, descriptions, prices, and stock from your seller tools.",
    icon: Box,
  },
  {
    title: "Manage orders in one place",
    description: "Review incoming orders and follow their status in your seller workspace.",
    icon: Truck,
  },
];

const sellerSteps = [
  { number: "1", title: "Add your products", description: "Create a listing with product photos, details, price, and stock." },
  { number: "2", title: "Set up your catalog", description: "Keep your products easy to browse and your inventory up to date." },
  { number: "3", title: "Manage your orders", description: "Use the seller dashboard to follow purchases and order status." },
];

const sellerWorkspaceTools = [
  { icon: PackagePlus, title: "Product listings", description: "Add products and update listing details." },
  { icon: Store, title: "Store catalog", description: "See products and current stock together." },
  { icon: Truck, title: "Order management", description: "Review orders and fulfillment status." },
  { icon: ChartNoAxesCombined, title: "Store activity", description: "Follow the latest activity in your shop." },
];

export default function SellOnMarketlyPage() {
  return (
    <main className="min-h-screen bg-white pb-16 pt-40 text-[#0f1111] sm:pt-32">
      <nav aria-label="Seller page navigation" className="border-y border-[#d5d9d9] bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center gap-5 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8">
          <span className="shrink-0 font-bold">Sell on Marketly</span>
          <Link href="#why-sell" className="shrink-0 text-[#333] hover:text-[#c45500] hover:underline">Why sell</Link>
          <Link href="#how-it-works" className="shrink-0 text-[#333] hover:text-[#c45500] hover:underline">How it works</Link>
          <Link href="#seller-tools" className="shrink-0 text-[#333] hover:text-[#c45500] hover:underline">Seller tools</Link>
          <Link href="#seller-faq" className="shrink-0 text-[#333] hover:text-[#c45500] hover:underline">FAQ</Link>
          <Link href="/vendor/create" className="ml-auto shrink-0 rounded-full bg-[#f3a847] px-5 py-2 font-bold text-[#131921] hover:bg-[#f7bd68]">Start selling</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <section className="grid gap-8 border-b border-[#ddd] py-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-16">
          <div>
            <p className="text-sm font-semibold text-[#565959]">A marketplace for independent businesses</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Sell more with Marketly</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#333] sm:text-lg">Put your products in front of shoppers and manage your listings, inventory, and orders with seller tools made for your business.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/vendor/create" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f3a847] px-6 text-sm font-bold text-[#131921] shadow-sm transition hover:bg-[#f7bd68]">Start selling <ArrowRight className="size-4" /></Link>
              <Link href="/vendor/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#888c8c] bg-white px-6 text-sm font-semibold text-[#0f1111] transition hover:bg-[#f7fafa]">Seller sign in</Link>
            </div>
            <p className="mt-4 text-xs text-[#565959]">Start by creating a product listing. Already a seller? <Link href="/vendor/dashboard" className="text-[#007185] hover:underline">Go to your dashboard</Link>.</p>
          </div>

          <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-[#f3f5f5] sm:min-h-[380px]">
            <Image
              src="/seller-owner.jpg"
              alt="Two business partners shaking hands after a meeting"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover object-center"
            />
            <a href="https://unsplash.com/photos/two-businessmen-shaking-hands-across-a-table-lZXX-QVdyXY" target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 rounded bg-black/55 px-2 py-1 text-[11px] text-white/90 hover:bg-black/70">
              Photo by Vitaly Gariev / Unsplash
            </a>
          </div>
        </section>

        <section id="why-sell" className="scroll-mt-6 border-b border-[#ddd] py-12 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#565959]">Why sell on Marketly?</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Tools to help you run your business</h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {sellerBenefits.map(({ title, description, icon: Icon }) => (
              <article key={title} className="border-t-2 border-[#f3a847] bg-[#f7f8f8] p-5 sm:p-6">
                <Icon className="size-6 text-[#007185]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#565959]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-6 border-b border-[#ddd] py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#565959]">Getting started</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">How selling works</h2>
            </div>
            <Link href="/vendor/create" className="text-sm font-semibold text-[#007185] hover:underline">Create a listing <ArrowRight className="ml-1 inline size-4" /></Link>
          </div>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {sellerSteps.map((step) => (
              <li key={step.number} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-[#f3a847] text-lg font-bold">{step.number}</span>
                <div><h3 className="font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#565959]">{step.description}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section id="seller-tools" className="scroll-mt-6 border-b border-[#ddd] py-12 sm:py-16">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-sm font-semibold text-[#565959]">Seller Central</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Run your shop from one dashboard</h2>
              <p className="mt-3 text-sm leading-6 text-[#565959]">Manage your product catalog, review orders, and keep an eye on your store activity using the seller workspace.</p>
              <Link href="/vendor/dashboard" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#007185] hover:underline">Explore seller dashboard <ArrowRight className="size-4" /></Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sellerWorkspaceTools.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-3 rounded-xl border border-[#d5d9d9] p-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-[#007185]" aria-hidden="true" />
                  <div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-[#565959]">{description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="seller-faq" className="scroll-mt-6 py-12 sm:py-16">
          <div className="flex items-center gap-3">
            <CircleQuestionMark className="size-6 text-[#007185]" aria-hidden="true" />
            <h2 className="text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          </div>
          <div className="mt-5 divide-y divide-[#ddd] border-y border-[#ddd]">
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">How do I start selling?</summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#565959]">Start by opening the product listing form. Add your product details, price, available stock, and photos to begin building your catalog.</p>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">Where can I manage my products and orders?</summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#565959]">Use the seller dashboard to review store activity, manage catalog items, and check customer orders.</p>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">Can I update a product after listing it?</summary>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#565959]">Yes. Open Products in your seller workspace and choose the product you want to edit.</p>
            </details>
          </div>
        </section>

        <section className="grid overflow-hidden rounded-xl bg-[#232f3e] text-white sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center">
          <div className="relative h-48 sm:h-full sm:min-h-48">
            <Image
              src="/seller-orders.jpg"
              alt="Brown gift boxes tied with red and white twine"
              fill
              sizes="(max-width: 639px) 100vw, 220px"
              className="object-cover object-center"
            />
            <a href="https://unsplash.com/photos/brown-gift-boxes-tied-with-red-and-white-twine-kZdXeTKZFaY" target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 rounded bg-black/55 px-2 py-1 text-[10px] text-white/90 hover:bg-black/70">
              Photo by Raymond Petrik / Unsplash
            </a>
          </div>
          <div className="flex flex-col items-start gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div><h2 className="text-2xl font-bold">Ready to start selling?</h2><p className="mt-2 text-sm text-white/70">Add your first product and start building your Marketly catalog.</p></div>
            <Link href="/vendor/create" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#f3a847] px-6 text-sm font-bold text-[#131921] hover:bg-[#f7bd68]">Start selling <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
