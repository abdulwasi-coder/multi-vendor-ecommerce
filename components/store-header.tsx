"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X, Store } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Account", href: "/profile" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function StoreHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const cartCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
    if (!menuOpen && !searchOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, searchOpen]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = search.trim();
    router.push(value ? `/products?search=${encodeURIComponent(value)}` : "/products");
    setMenuOpen(false);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 shadow-soft supports-[backdrop-filter]:backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:h-[72px] lg:px-8">
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setMenuOpen((open) => !open);
            setSearchOpen(false);
          }}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>

        <Link href="/" aria-label="Town Market home" className="shrink-0 rounded-sm text-[17px] font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-xl">
          town<span className="text-muted-foreground">market</span>
        </Link>

        <nav aria-label="Main navigation" className="ml-7 hidden h-full items-center gap-6 lg:flex">
          {navigation.slice(0, 2).map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`inline-flex h-full items-center border-b-2 pt-0.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${active ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={submitSearch} role="search" className="control-inset ml-auto hidden h-11 w-full max-w-sm items-center gap-2 rounded-lg border border-input/70 px-3 text-muted-foreground transition-shadow focus-within:ring-2 focus-within:ring-ring/70 md:flex">
          <Search aria-hidden="true" size={16} />
          <label htmlFor="desktop-search" className="sr-only">Search products</label>
          <input id="desktop-search" type="search" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-3">
          <button type="button" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} aria-controls="mobile-search-panel" onClick={() => { setSearchOpen((open) => !open); setMenuOpen(false); }} className="inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden">
            {searchOpen ? <X aria-hidden="true" size={19} /> : <Search aria-hidden="true" size={19} />}
          </button>
          <Link href="/profile" aria-label="Account" aria-current={isActive(pathname, "/profile") ? "page" : undefined} className="hidden size-11 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex">
            <UserRound aria-hidden="true" size={19} />
          </Link>
          <Link href="/wishlist" aria-label={`Wishlist, ${wishlistCount} items`} aria-current={isActive(pathname, "/wishlist") ? "page" : undefined} className="hidden size-11 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex">
            <span className="relative"><Heart aria-hidden="true" size={19} />{wishlistCount > 0 && <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] leading-4 text-primary-foreground">{wishlistCount}</span>}</span>
          </Link>
          <ThemeToggle />
          <Link href="/cart" aria-label={`Cart, ${cartCount} items`} aria-current={isActive(pathname, "/cart") ? "page" : undefined} className="relative inline-flex size-11 items-center justify-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ShoppingBag aria-hidden="true" size={19} />{cartCount > 0 && <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full bg-primary px-1 text-center text-[10px] leading-4 text-primary-foreground">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <div id="mobile-search-panel" hidden={!searchOpen} className="border-t border-border/70 px-4 py-3 md:hidden">
        <form onSubmit={submitSearch} role="search" className="control-inset mx-auto flex h-11 max-w-7xl items-center gap-2 rounded-lg border border-input/70 px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/70">
          <Search aria-hidden="true" size={17} />
          <label htmlFor="mobile-search" className="sr-only">Search products</label>
          <input ref={searchInputRef} id="mobile-search" type="search" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
        </form>
      </div>

      <div id="mobile-navigation" hidden={!menuOpen} className="border-t border-border/70 bg-background px-4 py-3 lg:hidden">
        <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.href === "/wishlist" ? Heart : item.href === "/profile" ? UserRound : item.href === "/products" ? Store : null;
            return <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "font-medium text-foreground" : "text-muted-foreground"}`}>{Icon ? <Icon aria-hidden="true" size={18} /> : <span className="size-[18px]" aria-hidden="true" />}{item.label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}
