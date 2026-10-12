"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/vendor-products";
import { useCustomerCart } from "@/lib/customer-cart-store";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function CartPageClient() {
  const items = useCustomerCart((state) => state.items);
  const hydrated = useCustomerCart((state) => state.hydrated);
  const removeItem = useCustomerCart((state) => state.removeItem);
  const changeQuantity = useCustomerCart((state) => state.changeQuantity);

  const cartLines = items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });
  const subtotal = cartLines.reduce(
    (total, item) => total + item.product.price * (1 - item.product.discount / 100) * item.quantity,
    0,
  );

  if (!hydrated) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-zinc-100" />
      </main>
    );
  }

  if (cartLines.length === 0) {
    return (
      <main className="mx-auto flex min-h-[55vh] max-w-6xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#f4f1ea] text-[#31594c]">
            <ShoppingBag className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Your cart is waiting</h1>
          <p className="mt-2 text-base leading-7 text-zinc-600">Find something you love and add it here.</p>
          <Button
            render={<Link href="/customer/products" />}
            className="mt-6 h-11 rounded-full bg-[#f4c967] px-6 text-base font-semibold text-[#24211a] hover:bg-[#f7d982]"
          >
            Explore products
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[55vh] bg-[#f7f7f4]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-500">Your picks, all together</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Shopping cart</h1>
          </div>
          <Link href="/customer/products" className="text-sm font-semibold text-[#176b5b] hover:underline sm:text-base">
            Continue shopping
          </Link>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-label="Cart items" className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white px-4 sm:px-6">
            {cartLines.map(({ product, quantity }) => {
              const unitPrice = product.price * (1 - product.discount / 100);

              return (
                <article key={product.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:gap-5">
                  <Link href={`/customer/product/${product.id}`} className="relative block size-24 shrink-0 overflow-hidden rounded-xl bg-[#f1f0eb] sm:size-28">
                    <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 639px) 90vw, 112px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-500">{product.vendorCompanyName}</p>
                    <Link href={`/customer/product/${product.id}`} className="mt-1 block text-lg font-semibold text-zinc-900 hover:text-[#176b5b]">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-500">{product.color}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex h-10 items-center rounded-full border border-zinc-200">
                        <Button variant="ghost" size="icon" aria-label={`Decrease ${product.name} quantity`} className="size-9 rounded-full" onClick={() => changeQuantity(product.id, quantity - 1)}>
                          <Minus className="size-4" aria-hidden="true" />
                        </Button>
                        <span className="min-w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
                        <Button variant="ghost" size="icon" aria-label={`Increase ${product.name} quantity`} className="size-9 rounded-full" disabled={quantity >= product.stock} onClick={() => changeQuantity(product.id, Math.min(quantity + 1, product.stock))}>
                          <Plus className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-9 text-sm text-zinc-500 hover:text-red-700" onClick={() => removeItem(product.id)}>
                        <Trash2 className="size-4" aria-hidden="true" /> Remove
                      </Button>
                    </div>
                  </div>
                  <p className="shrink-0 text-lg font-semibold text-zinc-900 sm:self-start">{currency.format(unitPrice * quantity)}</p>
                </article>
              );
            })}
          </section>

          <aside className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-zinc-900">Order summary</h2>
            <div className="mt-5 flex items-center justify-between text-base text-zinc-600">
              <span>Subtotal ({cartLines.reduce((count, item) => count + item.quantity, 0)} items)</span>
              <span className="font-semibold text-zinc-900">{currency.format(subtotal)}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">Shipping and any applicable taxes are calculated at checkout.</p>
            <div className="my-5 border-t border-zinc-200" />
            <div className="flex items-center justify-between text-lg font-semibold text-zinc-900">
              <span>Subtotal</span>
              <span>{currency.format(subtotal)}</span>
            </div>
            <Button render={<Link href="/customer/products" />} className="mt-5 h-12 w-full rounded-full bg-[#f4c967] text-base font-semibold text-[#24211a] hover:bg-[#f7d982]">
              Continue shopping
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
}
