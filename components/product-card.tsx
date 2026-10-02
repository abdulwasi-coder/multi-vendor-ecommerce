"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import type { HomeProduct } from "@/lib/homepage-content";
import type { ProductFeedItem } from "@/types/product";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

type DisplayProduct = { id: string; name: string; price: number; image?: string; imageAlt: string; category?: string; badge?: string; rating?: number; href?: string; stock?: number };
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function ProductCard({ product }: { product: HomeProduct | ProductFeedItem }) {
  if ("name" in product) {
    return <ProductVisual product={{ ...product }} />;
  }
  return <ProductVisual product={{ id: product.id, name: `Product · ${product.id.slice(-6)}`, price: product.price, image: product.thumbNailImage?.cloudinaryId, imageAlt: "", category: product.categoryName, href: `/products/${product.id}`, stock: product.stock }} />;
}

function ProductVisual({ product }: { product: DisplayProduct }) {
  const live = Boolean(product.href);
  const addItem = useCartStore((state) => state.addItem);
  const cartQuantity = useCartStore((state) => state.items.find((item) => item.id === product.id)?.quantity ?? 0);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isSaved = useWishlistStore((state) => state.items.some((item) => item.id === product.id));
  const card = <><div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">{product.image ? <Image src={product.image} alt={product.imageAlt} fill unoptimized sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 23vw" className="object-cover transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:scale-[1.02]" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Image unavailable</div>}{product.badge && <span className="absolute left-3 top-3 rounded-sm bg-background/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">{product.badge}</span>}</div><div className="flex items-start justify-between gap-3 pt-3"><div className="min-w-0"><h3 className="truncate text-sm font-medium text-foreground sm:text-base">{product.name}</h3><p className="mt-1 truncate text-xs text-muted-foreground">{product.category ?? (product.rating ? <span className="inline-flex items-center gap-1" aria-label={`Rated ${product.rating} out of 5`}><Star aria-hidden="true" size={13} className="fill-current" />{product.rating.toFixed(1)}</span> : null)}</p></div><p className="shrink-0 text-sm font-medium text-foreground">{currency.format(product.price)}</p></div></>;
  return <article className="surface-raised group min-w-0 rounded-xl p-2.5 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-raised sm:p-3">{product.href ? <Link href={product.href} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{card}</Link> : card}{live && <div className="mt-3 flex gap-2"><button type="button" disabled={cartQuantity >= (product.stock ?? 0)} onClick={() => { addItem({ id: product.id, name: product.name, price: product.price, image: product.image }); toast.success("Added to cart"); }} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-2 text-xs font-medium text-primary-foreground shadow-soft transition hover:bg-primary/95 active:shadow-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"><ShoppingBag size={15} aria-hidden="true" />{cartQuantity >= (product.stock ?? 0) ? "Stock limit reached" : "Add to cart"}</button><button type="button" onClick={() => { toggleWishlist({ id: product.id, name: product.name, price: product.price, image: product.image }); toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist"); }} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`} className="control-inset grid size-11 shrink-0 place-items-center rounded-lg border border-border/70 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Heart size={16} aria-hidden="true" className={isSaved ? "fill-primary text-primary" : ""} /></button></div>}</article>;
}
