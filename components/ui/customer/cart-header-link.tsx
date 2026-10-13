"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCustomerCart } from "@/lib/customer-cart-store";

export function CartHeaderLink() {
  const itemCount = useCustomerCart((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <Link
      href="/customer/cart"
      aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className="flex shrink-0 items-center gap-1 rounded-sm border border-transparent px-2 py-1.5 hover:border-white"
    >
      <span className="relative">
        <ShoppingBag className="size-7" aria-hidden="true" />
        <span className="absolute -right-1.5 -top-2 min-w-4 text-center text-xs font-extrabold text-[#f3a847]">
          {itemCount}
        </span>
      </span>
      <span className="text-xs font-bold sm:text-sm">Cart</span>
    </Link>
  );
}
