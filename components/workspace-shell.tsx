"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Menu, Store, X } from "lucide-react";
import { authApi } from "@/services/platform";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

const adminLinks = [
  ["Overview", "/admin", LayoutDashboard], ["Categories", "/admin/categories", Store], ["Vendors", "/admin/vendors", Store], ["Orders", "/admin/orders", Store], ["Balances", "/admin/balances", Store], ["Products", "/admin/products", Store],
] as const;
const vendorLinks = [
  ["Overview", "/vendor", LayoutDashboard], ["Store profile", "/vendor/profile", Store], ["Products", "/vendor/products", Store], ["Inventory", "/vendor/inventory", Store], ["Orders", "/vendor/orders", Store], ["Finance", "/vendor/finance", Store],
] as const;

export function WorkspaceShell({ kind, children }: { kind: "admin" | "vendor"; children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false);
  const links = kind === "admin" ? adminLinks : vendorLinks;
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", closeOnEscape); };
  }, [open]);
  async function logout() { try { await authApi.logout(); toast.success("Signed out"); router.push("/login"); router.refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "Could not sign out"); } }
  return <div className="min-h-[calc(100vh-1px)] bg-muted/35"><header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 shadow-soft supports-[backdrop-filter]:backdrop-blur-xl"><div className="flex h-16 items-center justify-between px-3 sm:px-6"><div className="flex items-center gap-2 sm:gap-3"><button type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls={`${kind}-navigation`} onClick={() => setOpen(!open)} className="grid size-11 place-items-center rounded-md transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden">{open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button><Link href={kind === "admin" ? "/admin" : "/vendor"} className="text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">town<span className="text-muted-foreground">market</span><span className="ml-2 hidden text-xs font-medium uppercase tracking-widest text-muted-foreground sm:inline">{kind} workspace</span></Link></div><div className="flex items-center gap-1 sm:gap-2"><ThemeToggle /><Link href="/" className="hidden min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex">View store</Link><button onClick={() => void logout()} className="min-h-11 rounded-md border border-border px-2.5 text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 sm:text-sm">Sign out</button></div></div></header><div className="mx-auto flex max-w-[1600px]">{open && <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-10 bg-foreground/20 lg:hidden" />}<aside id={`${kind}-navigation`} className={`${open ? "block" : "hidden"} fixed inset-x-0 top-16 z-20 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background p-3 shadow-floating lg:sticky lg:top-16 lg:block lg:min-h-[calc(100vh-4rem)] lg:max-h-[calc(100vh-4rem)] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r lg:bg-sidebar/70 lg:p-4 lg:shadow-none`}><nav aria-label={`${kind} navigation`} className="space-y-1">{links.map(([label, href, Icon]) => { const active = href === `/${kind}` ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? "bg-secondary font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon aria-hidden="true" size={17} />{label}</Link>; })}</nav></aside><main className="min-w-0 flex-1 px-4 py-7 sm:px-6 lg:px-8">{children}</main></div></div>;
}
