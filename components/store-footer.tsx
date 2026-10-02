import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const links = [
  { href: "/products", label: "Shop products" },
  { href: "/profile", label: "Your account" },
  { href: "/vendor-application", label: "Sell with us" },
];

export function StoreFooter() {
  return <footer className="border-t border-border/80 bg-muted/45">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:grid-cols-[1fr_auto] sm:items-end sm:px-6 sm:py-11 lg:px-8">
      <div>
        <Link href="/" aria-label="Town Market home" className="rounded-sm text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">town<span className="text-muted-foreground">market</span></Link>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">A thoughtful marketplace for everyday finds and independent stores.</p>
      </div>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map((link) => <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{link.label}<ArrowUpRight aria-hidden="true" size={13} /></Link>)}
      </nav>
      <p className="border-t border-border/70 pt-4 text-xs text-muted-foreground sm:col-span-2">© {new Date().getFullYear()} Town Market</p>
    </div>
  </footer>;
}
