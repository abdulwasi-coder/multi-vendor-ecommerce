"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Wishlist", href: "/product/wishlist" },
  { label: "Account", href: "/profile" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function StoreHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[76px] lg:px-8">
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
        </button>

        <Link href="/" aria-label="Town Market home" className="shrink-0 rounded-sm text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-xl">
          town<span className="text-muted-foreground">market</span>
        </Link>

        <nav aria-label="Main navigation" className="ml-8 hidden h-full items-center gap-7 lg:flex">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-full items-center border-b-2 pt-0.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${active ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <label className="ml-auto hidden h-10 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring md:flex">
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search products</span>
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search products"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] xl:inline">⌘ K</kbd>
        </label>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-3">
          <Link
            href="/profile"
            aria-label="Account"
            aria-current={isActive(pathname, "/profile") ? "page" : undefined}
            className="hidden size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            <UserRound aria-hidden="true" size={20} />
          </Link>
          <Link
            href="/product/wishlist"
            aria-label="Wishlist"
            aria-current={isActive(pathname, "/product/wishlist") ? "page" : undefined}
            className="hidden size-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
          >
            <Heart aria-hidden="true" size={20} />
          </Link>
          <button
            type="button"
            disabled
            aria-label="Cart (not available yet)"
            title="Cart is not available yet"
            className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingBag aria-hidden="true" size={20} />
          </button>
        </div>
      </div>

      <div className="border-t border-border px-4 py-2.5 md:hidden">
        <label className="mx-auto flex h-10 max-w-7xl items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search products</span>
          <input type="search" aria-label="Search products" placeholder="Search products" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </label>
      </div>

      <div id="mobile-navigation" hidden={!menuOpen} className="border-t border-border bg-background px-4 py-3 lg:hidden">
        <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.href === "/product/wishlist" ? Heart : item.href === "/profile" ? UserRound : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {Icon ? <Icon aria-hidden="true" size={18} /> : <span className="size-[18px]" aria-hidden="true" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
