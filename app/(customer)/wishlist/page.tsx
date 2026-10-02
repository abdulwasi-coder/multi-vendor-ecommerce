"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { PageFrame, Surface } from "@/components/app-ui";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const money = (value: number) => Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  return <PageFrame eyebrow="Saved items" title="Wishlist" description="Keep track of products you want to come back to.">
    {items.length === 0 ? <Surface><div className="py-10 text-center"><Heart size={26} aria-hidden="true" className="mx-auto text-primary" /><h2 className="mt-4 font-medium">Your wishlist is empty</h2><p className="mt-2 text-sm text-muted-foreground">Save products from their cards or detail pages to find them here.</p><Link href="/products" className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4">Browse products</Link></div></Surface> : <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <li key={item.id}><article className="overflow-hidden rounded-md border border-border/80 bg-card"><Link href={`/products/${item.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"><div className="relative aspect-[4/3] bg-muted">{item.image ? <Image src={item.image} alt="" fill unoptimized sizes="(max-width:639px) 100vw, (max-width:1023px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Image unavailable</div>}</div><div className="flex items-start justify-between gap-3 p-4"><h2 className="font-medium">{item.name}</h2><p className="shrink-0 text-sm font-semibold">{money(item.price)}</p></div></Link><div className="flex gap-2 px-4 pb-4"><button type="button" onClick={() => { addItem({ ...item }); toast.success("Added to cart"); }} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ShoppingBag size={16} aria-hidden="true" />Add to cart</button><button type="button" onClick={() => remove(item.id)} aria-label={`Remove ${item.name} from wishlist`} className="grid size-11 place-items-center rounded-md border border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X size={16} aria-hidden="true" /></button></div></article></li>)}</ul>}
  </PageFrame>;
}
