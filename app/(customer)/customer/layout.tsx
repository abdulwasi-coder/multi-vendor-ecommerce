import Link from "next/link";
import { LayoutGrid, Search, Store } from "lucide-react";
import type { ReactNode } from "react";
import { MobileCustomerNav } from "@/components/ui/customer/mobile-customer-nav";
import { CartHeaderLink } from "@/components/ui/customer/cart-header-link";
import { CartHydration } from "@/components/ui/customer/cart-hydration";

const navigation = [
  { label: "Home", href: "/customer" },
  { label: "Products", href: "/customer/products" },
  { label: "Sell", href: "/customer/sell" },
  { label: "Today's Deals", href: "/customer/top-discounts" },
  { label: "Top Rated", href: "/customer/top-rated" },
  { label: "Orders", href: "/customer/orders" },
];

const footerGroups = [
  {
    title: "Discover",
    links: [
      ["All products", "/customer/products"],
      ["Today’s deals", "/customer/top-discounts"],
      ["Top rated", "/customer/top-rated"],
    ],
  },
  {
    title: "Your account",
    links: [
      ["My orders", "/customer/orders"],
      ["Wishlist", "/customer/product/wishlist"],
      ["Profile", "/customer/profile"],
    ],
  },
  {
    title: "For sellers",
    links: [
      ["Start selling", "/customer/sell"],
      ["Seller dashboard", "/vendor/dashboard"],
      ["Seller information", "/customer/sell"],
    ],
  },
];

function CustomerHeader() {
  return (
    <header className="absolute top-0 right-0 left-0 z-40 text-white shadow-sm">
      <div className="bg-[#131921]">
        <div className="mx-auto flex min-h-[68px] max-w-[1600px] flex-wrap items-center gap-2 px-3 py-2 sm:flex-nowrap sm:gap-3 sm:px-5 lg:px-7">
          <Link href="/customer" className="flex shrink-0 items-center gap-2 rounded-sm border border-transparent px-2 py-1.5 hover:border-white" aria-label="Marketly home">
            <span className="grid size-8 place-items-center rounded-lg bg-[#f3a847] text-[#131921]">
              <Store className="size-[18px]" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight sm:text-xl">marketly<span className="text-[#f3a847]">.</span></span>
          </Link>

          <Link href="/customer#shop-categories" className="hidden shrink-0 items-center gap-2 rounded-sm border border-transparent px-2 py-1 hover:border-white md:flex">
            <LayoutGrid className="size-4 text-white/80" aria-hidden="true" />
            <span className="leading-tight"><span className="block text-[11px] text-white/70">Shop by</span><span className="block text-sm font-bold">Categories</span></span>
          </Link>

          <form action="/customer/products" className="order-3 flex h-10 min-w-0 flex-[1_1_100%] overflow-hidden rounded-md bg-white focus-within:ring-2 focus-within:ring-[#f3a847] sm:order-none sm:h-11 sm:flex-1">
            <label htmlFor="marketplace-search" className="sr-only">Search products</label>
            <input id="marketplace-search" name="q" type="search" placeholder="Search Marketly" className="min-w-0 flex-1 border-0 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 sm:px-4" />
            <button type="submit" aria-label="Search" className="grid w-11 shrink-0 place-items-center bg-[#f3a847] text-[#131921] transition hover:bg-[#f7bd68] sm:w-14">
              <Search className="size-5" aria-hidden="true" />
            </button>
          </form>

          <Link href="/customer/profile" className="hidden shrink-0 rounded-sm border border-transparent px-2 py-1 hover:border-white sm:block">
            <span className="block text-[11px] text-white/70">Hello, sign in</span>
            <span className="block text-sm font-bold">Account</span>
          </Link>
          <Link href="/customer/orders" className="hidden shrink-0 rounded-sm border border-transparent px-2 py-1 hover:border-white md:block">
            <span className="block text-[11px] text-white/70">Your</span>
            <span className="block text-sm font-bold">Orders</span>
          </Link>
          <CartHeaderLink />
        </div>
      </div>

      <nav aria-label="Main navigation" className="hidden bg-[#232f3e] lg:block">
        <div className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-3 py-1.5 sm:px-5 lg:px-7">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} className="shrink-0 rounded-sm border border-transparent px-3 py-1.5 text-sm font-medium text-white/95 hover:border-white sm:px-4">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="bg-[#232f3e] lg:hidden"><MobileCustomerNav /></div>
    </header>
  );
}

function CustomerFooter() {
  return (
    <footer className="mt-auto text-white">
      <a href="#top" className="flex min-h-12 items-center justify-center bg-[#37475a] px-4 text-sm font-medium text-white/90 transition hover:bg-[#48596c]">
        Back to top ↑
      </a>
      <div className="bg-[#232f3e]">
        <div className="mx-auto grid max-w-6xl gap-9 px-6 py-11 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4 lg:gap-16">
          <div>
            <h2 className="text-base font-bold">Get to know Marketly</h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              A marketplace for curious shoppers and independent sellers. Find something different, support a small shop.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-base font-bold">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-white/65 transition-colors hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#131921]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-7 sm:flex-row sm:justify-between">
          <Link href="/customer" className="flex items-center gap-2 rounded-sm px-2 py-1" aria-label="Marketly home">
            <span className="grid size-8 place-items-center rounded-lg bg-[#f3a847] text-[#131921]"><Store className="size-[18px]" aria-hidden="true" /></span>
            <span className="text-lg font-extrabold tracking-tight">marketly<span className="text-[#f3a847]">.</span></span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/60">
            <Link href="/customer/profile" className="hover:text-white">Your account</Link>
            <Link href="/customer/orders" className="hover:text-white">Help &amp; orders</Link>
            <Link href="/customer/sell" className="hover:text-white">Sell on Marketly</Link>
          </div>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Marketly</p>
        </div>
      </div>
    </footer>
  );
}

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-white">
      <CartHydration />
      <CustomerHeader />
      <main className="w-full flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
}
