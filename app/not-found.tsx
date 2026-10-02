import Link from "next/link";
import { StoreHeader } from "@/components/store-header";
import { StoreFooter } from "@/components/store-footer";

export default function NotFound() {
  return <><StoreHeader /><main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-16 text-center"><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">404</p><h1 className="mt-3 text-3xl font-semibold">We can’t find that page</h1><p className="mt-3 text-sm text-muted-foreground">The link may be outdated, or the page may have moved.</p><Link href="/" className="mx-auto mt-6 inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Return home</Link></main><StoreFooter /></>;
}
