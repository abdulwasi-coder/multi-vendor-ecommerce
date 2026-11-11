import Link from "next/link";
import { LayoutGrid, Store } from "lucide-react";
import type { ReactNode } from "react";
import { MobileCustomerNav } from "@/components/ui/customer/mobile-customer-nav";
import { CartHeaderLink } from "@/components/ui/customer/cart-header-link";
import { CartHydration } from "@/components/ui/customer/cart-hydration";
import { CustomerAccountActions } from "@/components/ui/customer/customer-account-actions";
import { SearchBar } from "@/components/ui/customer/search-bar";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Sell", href: "/sell" },
  { label: "Today's Deals", href: "/top-discounts" },
  { label: "Top Rated", href: "/top-rated" },
  { label: "Orders", href: "/orders" },
];

const footerGroups = [
  {
    title: "Discover",
    links: [
      ["All products", "/products"],
      ["Today's deals", "/top-discounts"],
      ["Top rated", "/top-rated"],
    ],
  },
  {
    title: "Your account",
    links: [
      ["My orders", "/orders"],
      ["Wishlist", "/product/wishlist"],
      ["Profile", "/profile"],
    ],
  },
  {
    title: "For sellers",
    links: [
      ["Start selling", "/sell"],
      ["Seller dashboard", "/vendor/dashboard"],
      ["Seller information", "/sell"],
    ],
  },
];

function CustomerHeader() {
  return (
    <header className="absolute top-0 right-0 left-0 z-40 text-white shadow-sm">
      <div className="bg-[#131921]">
        <div className="mx-auto flex min-h-17 max-w-400 flex-wrap items-center gap-2 px-3 py-2 sm:flex-nowrap sm:gap-3 sm:px-5 lg:px-7">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-sm border border-transparent px-2 py-1.5 hover:border-white"
            aria-label="Marketly home"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-[#f3a847] text-[#131921]">
              <Store className="size-4.5" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight sm:text-xl">
              marketly<span className="text-[#f3a847]">.</span>
            </span>
          </Link>

          <Link
            href="/"
            className="hidden shrink-0 items-center gap-2 rounded-sm border border-transparent px-2 py-1 hover:border-white md:flex"
          >
            <LayoutGrid className="size-4 text-white/80" aria-hidden="true" />
            <span className="leading-tight">
              <span className="block text-[11px] text-white/70">Shop by</span>
              <span className="block text-sm font-bold">Categories</span>
            </span>
          </Link>

          <SearchBar />

          <CustomerAccountActions />
          <Link
            href="/orders"
            className="hidden shrink-0 rounded-sm border border-transparent px-2 py-1 hover:border-white md:block"
          >
            <span className="block text-[11px] text-white/70">Your</span>
            <span className="block text-sm font-bold">Orders</span>
          </Link>
          <CartHeaderLink />
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="hidden bg-[#232f3e] lg:block"
      >
        <div className="mx-auto flex max-w-400 items-center gap-1 overflow-x-auto px-3 py-1.5 sm:px-5 lg:px-7">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="shrink-0 rounded-sm border border-transparent px-3 py-1.5 text-sm font-medium text-white/95 hover:border-white sm:px-4"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="bg-[#232f3e] lg:hidden">
        <MobileCustomerNav />
      </div>
    </header>
  );
}

function CustomerFooter() {
  return (
    <footer className="mt-auto text-white">
      <a
        href="#top"
        className="flex min-h-12 items-center justify-center bg-[#37475a] px-4 text-sm font-medium text-white/90 transition hover:bg-[#48596c]"
      >
        Back to top ↑
      </a>
      <div className="bg-[#232f3e]">
        <div className="mx-auto grid max-w-6xl gap-9 px-6 py-11 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4 lg:gap-16">
          <div>
            <h2 className="text-base font-bold">Get to know Marketly</h2>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              A marketplace for curious shoppers and independent sellers. Find
              something different, support a small shop.
            </p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-base font-bold">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#131921]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-7 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm px-2 py-1"
            aria-label="Marketly home"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-[#f3a847] text-[#131921]">
              <Store className="size-4.5" aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              marketly<span className="text-[#f3a847]">.</span>
            </span>
          </Link>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/60">
            <Link href="/profile" className="hover:text-white">
              Your account
            </Link>
            <Link href="/orders" className="hover:text-white">
              Help &amp; orders
            </Link>
            <Link href="/sell" className="hover:text-white">
              Sell on Marketly
            </Link>
          </div>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Marketly
          </p>
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
