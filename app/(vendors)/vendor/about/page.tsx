import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Package, Store, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const store = {
  id: "VND-1001",
  name: "Bon Ton Studio",
  slug: "bon-ton-studio",
  description:
    "Thoughtfully selected goods made for everyday living. We bring together practical essentials, quality materials, and timeless design to make the small moments at home feel special.",
  story:
    "Bon Ton Studio began with a simple idea: useful things can also be beautiful. We work with independent makers and small workshops to find well-made pieces that feel at home in everyday life. Each item is chosen for its thoughtful details, lasting materials, and easy, timeless style.",
  status: "Active",
  category: "Bags & accessories",
  created: "May 18, 2024",
  updated: "October 12, 2026",
  image: "/category-bags.jpg",
  owner: "Alex Morgan",
  role: "Store owner",
  email: "hello@bontonstudio.example",
  phone: "+1 (415) 555-0184",
  country: "United States",
  products: "24 products",
  inventory: "186 units",
  fulfillment: "1–2 business days",
  returns: "30-day returns",
};

export default function VendorAboutPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f1] px-4 py-6 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e4e1d9] pb-5">
          <div>
            <p className="text-sm text-muted-foreground">My store</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">About the store</h1>
          </div>
          <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 rounded-full border border-[#d8d5cc] bg-white px-4 py-2 text-sm font-medium transition hover:bg-[#fbfaf7]">
            Store dashboard <ArrowUpRight className="size-4" />
          </Link>
        </header>

        <section className="grid overflow-hidden rounded-2xl border border-[#e6e3dc] bg-[#fbfaf7] lg:grid-cols-[0.72fr_1.28fr]">
          <div className="relative min-h-[210px] bg-[#e8e5dd] sm:min-h-[250px] lg:min-h-[290px]">
            <Image src={store.image} alt={`${store.name} storefront`} fill priority sizes="(max-width: 1024px) 100vw, 38vw" className="object-cover" />
            <Badge className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[#263b33] hover:bg-white">Sample store</Badge>
          </div>

          <div className="flex flex-col justify-center px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dedbd2] pb-4">
              <div>
                <p className="flex items-center gap-2 text-xs text-[#748176]"><Store className="size-4" /> Store details</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">{store.name}</h2>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">{store.status}</Badge>
            </div>
            <dl className="mt-1 grid gap-x-8 sm:grid-cols-2">
              <Detail label="Store URL" value={store.slug} />
              <Detail label="Store ID" value={store.id} mono />
              <Detail label="Category" value={store.category} />
              <Detail label="Selling since" value={store.created} />
            </dl>
          </div>
        </section>

        <section aria-label="Store summary" className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[#dedbd2] py-6 sm:grid-cols-4 sm:gap-8">
          <Summary icon={<Package className="size-4" />} label="Catalog" value={store.products} />
          <Summary icon={<Package className="size-4" />} label="Available inventory" value={store.inventory} />
          <Summary icon={<Store className="size-4" />} label="Main category" value={store.category} />
          <Summary icon={<CalendarDays className="size-4" />} label="Selling since" value={store.created} />
        </section>

        <section className="grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b7650]">Our story</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Useful things, made thoughtfully.</h2>
            <p className="mt-4 text-sm leading-7 text-[#5f665f]">{store.story}</p>
            <div className="mt-7 flex items-start gap-3 border-t border-[#dedbd2] pt-5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#718174]" />
              <div><p className="text-sm font-medium">Based in {store.country}</p><p className="mt-1 text-sm text-muted-foreground">Serving customers through our online storefront.</p></div>
            </div>
          </div>

          <div>
            <SectionHeading icon={<Store className="size-4" />} eyebrow="Store information" title="Store details" />
            <dl className="mt-4 divide-y divide-[#dedbd2] border-y border-[#dedbd2]">
              <Detail label="Store name" value={store.name} />
              <Detail label="Store URL" value={store.slug} />
              <Detail label="Store ID" value={store.id} mono />
              <Detail label="Status" value={store.status} />
              <Detail label="Category" value={store.category} />
              <Detail label="Fulfillment time" value={store.fulfillment} />
              <Detail label="Return policy" value={store.returns} />
              <Detail label="Last updated" value={store.updated} />
            </dl>
          </div>
        </section>

        <section className="grid gap-9 border-t border-[#dedbd2] pt-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <SectionHeading icon={<UserRound className="size-4" />} eyebrow="The person behind the shop" title="Vendor profile" />
            <p className="mt-4 text-sm leading-7 text-muted-foreground">Meet the owner and find the store's contact details for questions about products, orders, or delivery.</p>
          </div>
          <dl className="grid gap-x-8 divide-y divide-[#dedbd2] border-y border-[#dedbd2] sm:grid-cols-2 sm:divide-y-0">
            <Detail label="Store owner" value={store.owner} />
            <Detail label="Role" value={store.role} />
            <Detail label="Email" value={store.email} />
            <Detail label="Phone" value={store.phone} />
            <Detail label="Country" value={store.country} />
            <Detail label="Member since" value={store.created} />
          </dl>
        </section>
      </div>
    </main>
  );
}

function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div>
    <p className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</p>
    <p className="mt-2 text-base font-semibold">{value}</p>
  </div>;
}

function SectionHeading({ icon, eyebrow, title }: { icon: React.ReactNode; eyebrow: string; title: string }) {
  return <div>
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7650]">{icon}{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
  </div>;
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="flex min-w-0 items-start justify-between gap-5 py-3.5">
    <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
    <dd className={`break-all text-right text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</dd>
  </div>;
}
