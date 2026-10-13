"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, LockKeyhole, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/vendor-products";
import { useCustomerCart } from "@/lib/customer-cart-store";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function CartPageClient() {
  const items = useCustomerCart((state) => state.items);
  const hydrated = useCustomerCart((state) => state.hydrated);
  const removeItem = useCustomerCart((state) => state.removeItem);
  const changeQuantity = useCustomerCart((state) => state.changeQuantity);
  const cartLines = items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });
  const itemCount = cartLines.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartLines.reduce((total, item) => total + item.product.price * (1 - item.product.discount / 100) * item.quantity, 0);

  if (!hydrated) {
    return <main className="min-h-[60vh] bg-[#eaeded] px-4 pb-12 pt-36 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1500px]"><div className="h-10 w-64 animate-pulse rounded bg-white" /><div className="mt-5 h-64 animate-pulse rounded bg-white" /></div></main>;
  }

  if (cartLines.length === 0) {
    return (
      <main className="min-h-[60vh] bg-[#eaeded] px-4 pb-12 pt-36 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] items-start gap-5 max-lg:flex-col">
          <section className="w-full bg-white p-6 sm:p-9">
            <h1 className="text-3xl font-normal tracking-tight text-[#0f1111] sm:text-4xl">Your Amazon-style cart</h1>
            <div className="mt-7 flex flex-col items-center border-t border-[#ddd] py-12 text-center">
              <span className="grid size-20 place-items-center rounded-full bg-[#fff4d6] text-[#c45500]"><ShoppingCart className="size-9" /></span>
              <h2 className="mt-5 text-2xl font-semibold text-[#0f1111]">Your cart is empty</h2>
              <p className="mt-2 max-w-md text-[#565959]">Ready to find something you love? Your picks will be waiting here.</p>
              <Button render={<Link href="/customer/products" />} className="mt-6 h-11 rounded-full bg-[#ffd814] px-7 text-[#0f1111] shadow-sm hover:bg-[#f7ca00]">Explore products</Button>
            </div>
          </section>
          <SecureNote />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-[#eaeded] px-4 pb-12 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <section className="min-w-0 bg-white px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#ddd] pb-4">
              <div>
                <h1 className="text-3xl font-normal tracking-tight text-[#0f1111] sm:text-4xl">Shopping Cart</h1>
                <Link href="/customer/products" className="mt-2 inline-flex text-sm text-[#007185] hover:text-[#c45500] hover:underline">Continue shopping</Link>
              </div>
              <p className="pb-1 text-sm text-[#565959]">Price</p>
            </div>

            <div className="divide-y divide-[#ddd]">
              {cartLines.map(({ product, quantity }) => {
                const unitPrice = product.price * (1 - product.discount / 100);
                return (
                  <article key={product.id} className="grid gap-5 py-6 sm:grid-cols-[180px_minmax(0,1fr)_150px] sm:gap-6">
                    <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-sm bg-[#f7f7f7] sm:mx-0">
                      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 90vw, 180px" className="object-contain p-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-medium leading-6 text-[#0f1111]">{product.name}</p>
                      <p className="mt-1 text-sm text-[#565959]">Sold by <span className="text-[#007185]">{product.vendorCompanyName}</span></p>
                      {product.color && <p className="mt-1 text-sm text-[#565959]">Color: {product.color}</p>}
                      <p className="mt-2 flex items-center gap-1 text-sm font-medium text-[#007600]"><Check className="size-4" /> In Stock</p>
                      {product.discount > 0 && <span className="mt-2 inline-block rounded-sm bg-[#cc0c39] px-2 py-1 text-xs font-semibold text-white">-{Math.round(product.discount)}% deal</span>}
                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                        <div className="inline-flex h-9 items-center rounded-full border border-[#d5d9d9] bg-[#f0f2f2] shadow-sm">
                          <Button variant="ghost" size="icon" aria-label={`Decrease ${product.name} quantity`} className="size-8 rounded-full hover:bg-[#e3e6e6]" onClick={() => changeQuantity(product.id, quantity - 1)}><Minus className="size-3.5" /></Button>
                          <span className="min-w-7 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                          <Button variant="ghost" size="icon" aria-label={`Increase ${product.name} quantity`} className="size-8 rounded-full hover:bg-[#e3e6e6]" disabled={quantity >= product.stock} onClick={() => changeQuantity(product.id, Math.min(quantity + 1, product.stock))}><Plus className="size-3.5" /></Button>
                        </div>
                        <span className="h-5 border-l border-[#ddd]" />
                        <Button variant="ghost" size="sm" className="h-8 px-1 text-sm font-normal text-[#007185] hover:bg-transparent hover:text-[#c45500] hover:underline" onClick={() => removeItem(product.id)}><Trash2 className="mr-1 size-3.5" />Delete</Button>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xl font-bold text-[#0f1111]">{currency.format(unitPrice * quantity)}</p>
                      {product.discount > 0 && <p className="mt-1 text-xs text-[#565959]">List: <span className="line-through">{currency.format(product.price * quantity)}</span></p>}
                      {quantity > 1 && <p className="mt-1 text-xs text-[#565959]">{currency.format(unitPrice)} each</p>}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="border-t border-[#ddd] pt-4 text-right text-lg text-[#0f1111]">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}): <strong className="font-bold">{currency.format(subtotal)}</strong></div>
          </section>

          <div className="space-y-4">
            <aside className="bg-white p-5 sm:p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-[#007600]"><Check className="size-4" /> Shipping calculated at checkout</p>
              <p className="mt-3 text-xl text-[#0f1111]">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}): <strong className="font-bold">{currency.format(subtotal)}</strong></p>
              <Button className="mt-5 h-11 w-full rounded-full bg-[#ffd814] text-sm font-medium text-[#0f1111] shadow-sm hover:bg-[#f7ca00]" onClick={() => toast("Checkout is coming soon", { description: "Your cart is saved. Checkout will be available here soon.", duration: 4000 })}>Proceed to checkout</Button>
              <p className="mt-3 text-center text-xs text-[#565959]">Secure transaction</p>
            </aside>
            <SecureNote />
          </div>
        </div>
      </div>
    </main>
  );
}

function SecureNote() {
  return <div className="flex items-start gap-3 border border-[#d5d9d9] bg-white p-4 text-sm text-[#565959]"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-[#007185]" /><p><span className="font-semibold text-[#0f1111]">Your cart is saved.</span> You can keep browsing and come back to these items later.</p></div>;
}
