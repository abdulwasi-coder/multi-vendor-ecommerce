"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getProductById, type ProductDetailsResponse } from "@/services/product-details";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Notice, Surface } from "@/components/app-ui";

export function ProductDetails({ id }: { id: string }) {
  const query = useQuery({ queryKey: ["product-details", id], queryFn: () => getProductById(id) });
  const addItem = useCartStore((state) => state.addItem);
  const cartQuantity = useCartStore((state) => state.items.find((item) => item.id === id)?.quantity ?? 0);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isSaved = useWishlistStore((state) => state.items.some((item) => item.id === id));
  const [quantity, setQuantity] = useState(1);

  if (query.isLoading) return <ProductDetailsSkeleton />;
  if (query.isError) return <Notice kind="error" title="Product details are unavailable">{query.error instanceof Error ? query.error.message : "The product details could not be loaded."}<span className="mt-1 block">The listing endpoint works, but the detail response is incomplete in the current backend.</span></Notice>;
  if (!query.data) return null;

  const product = query.data;
  const image = product.images?.[0]?.cloudinaryId;
  const stock = typeof product.stock === "number" ? product.stock : 0;
  const remainingStock = Math.max(0, stock - cartQuantity);
  const name = product.name ?? "Product";
  const price = product.price ?? 0;

  return <div className="grid items-start gap-7 md:grid-cols-2 lg:gap-12">
    <ProductGallery name={name} images={product.images ?? []} />
    <section className="min-w-0">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted-foreground"><Link href="/products" className="rounded-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Products</Link><span aria-hidden="true"> / </span><span>{product.category?.name ?? "Item"}</span></nav>
      {product.category?.name && <p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">{product.category.name}</p>}
      <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">{name}</h1>
      <p className="mt-4 text-2xl font-semibold tracking-tight">{money(price)}</p>
      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{product.description || "Description unavailable."}</p>
      <p className="mt-4 text-sm text-muted-foreground">{remainingStock > 0 ? `${remainingStock} available` : stock > 0 ? "Maximum available quantity is in your cart" : "Stock information unavailable"}</p>

      <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
        <label className="sr-only" htmlFor="quantity">Quantity</label>
        <input id="quantity" type="number" min="1" max={Math.max(1, remainingStock)} value={quantity} onChange={(event) => setQuantity(Math.min(Math.max(1, remainingStock), Math.max(1, Number(event.target.value))))} className="h-11 w-20 rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <button type="button" disabled={remainingStock < quantity} onClick={() => { addItem({ id, name, price, image, quantity }); toast.success("Added to cart"); }} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-5"><ShoppingBag size={17} aria-hidden="true" />{remainingStock < 1 ? "Unavailable" : "Add to cart"}</button>
        <button type="button" onClick={() => { toggleWishlist({ id, name, price, image }); toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist"); }} aria-pressed={isSaved} aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"} className="grid size-11 shrink-0 place-items-center rounded-md border border-border transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Heart size={18} aria-hidden="true" className={isSaved ? "fill-primary text-primary" : ""} /></button>
      </div>

      {product.store && <Surface className="mt-8"><h2 className="font-semibold">Sold by {product.store.name ?? "Marketplace seller"}</h2>{product.store.storeDescription && <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.store.storeDescription}</p>}</Surface>}
    </section>
  </div>;
}

function ProductGallery({ name, images }: { name: string; images: NonNullable<ProductDetailsResponse["images"]> }) {
  const [active, setActive] = useState(0);
  const imageSources = images.filter((image) => Boolean(image.cloudinaryId));
  const current = imageSources[active];

  return <div className="min-w-0">
    <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
      {current ? <Image src={current.cloudinaryId ?? ""} alt={name} fill unoptimized sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /> : <div className="grid h-full place-items-center text-sm text-muted-foreground">Image unavailable</div>}
    </div>
    {imageSources.length > 1 && <div role="group" aria-label="Product images" className="mt-3 flex gap-2 overflow-x-auto pb-1">{imageSources.map((image, index) => <button key={image.publicId || image.cloudinaryId} type="button" aria-label={`View product image ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} className={`relative size-16 shrink-0 overflow-hidden rounded-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active === index ? "border-primary" : "border-border hover:border-muted-foreground"}`}><Image src={image.cloudinaryId ?? ""} alt="" fill unoptimized sizes="64px" className="object-cover" /></button>)}</div>}
  </div>;
}

function ProductDetailsSkeleton() {
  return <div aria-live="polite" className="grid gap-7 md:grid-cols-2 lg:gap-12"><div className="aspect-[4/5] animate-pulse rounded-md bg-muted motion-reduce:animate-none" /><div className="space-y-4"><div className="h-3 w-24 animate-pulse rounded bg-muted motion-reduce:animate-none" /><div className="h-8 w-3/4 animate-pulse rounded bg-muted motion-reduce:animate-none" /><div className="h-6 w-28 animate-pulse rounded bg-muted motion-reduce:animate-none" /><div className="h-24 animate-pulse rounded bg-muted motion-reduce:animate-none" /></div><span className="sr-only">Loading product details</span></div>;
}

function money(value: number) {
  return Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
