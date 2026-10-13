"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, CheckCircle2, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCustomerCart } from "@/lib/customer-cart-store";

export function AddToCartButton({
  productId,
  productName,
  stock,
}: {
  productId: string;
  productName: string;
  stock: number;
}) {
  const router = useRouter();
  const addItem = useCustomerCart((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    const wasAdded = addItem(productId, stock);

    if (!wasAdded) {
      toast.error(stock > 0 ? "You have reached the available stock." : "This item is out of stock.");
      return;
    }

    setAdded(true);
    toast.custom((id) => (
      <div className="w-[min(500px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-white/15 bg-[#172b27] text-white shadow-[0_18px_60px_-15px_rgba(15,40,32,0.65)] ring-1 ring-black/10">
        <div className="h-1.5 bg-gradient-to-r from-[#f6c453] via-[#71d7a5] to-[#57c4bd]" />
        <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
          <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-500 text-[#102720] shadow-lg shadow-emerald-950/30 sm:size-14"><ShoppingBag className="size-6" /><CheckCircle2 className="absolute -right-1 -top-1 size-5 rounded-full bg-white text-emerald-600" /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200">Nice choice!</p>
            <p className="mt-0.5 font-bold text-white">Added to your cart</p>
            <p className="mt-1 line-clamp-1 text-sm text-white/70">{productName}</p>
            <button
              type="button"
              onClick={() => { toast.dismiss(id); router.push("/customer/cart"); }}
              className="mt-3 inline-flex h-9 items-center gap-2 rounded-full bg-[#ffd814] px-5 text-sm font-bold text-[#172b27] shadow-[0_4px_14px_rgba(255,216,20,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ffe45c]"
            >
              View cart <ArrowRight className="size-4" />
            </button>
          </div>
          <button type="button" aria-label="Dismiss notification" onClick={() => toast.dismiss(id)} className="grid size-8 shrink-0 place-items-center self-start rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"><X className="size-4" /></button>
        </div>
      </div>
    ), { duration: 5500, position: "bottom-center" });
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Button
      type="button"
      onClick={handleAdd}
      disabled={stock < 1}
      variant="outline"
      className="mt-4 h-11 w-full rounded-full border-[#e5b24f] bg-[#f4c967] text-sm font-semibold text-[#24211a] shadow-sm hover:bg-[#f7d982] sm:text-base"
    >
      {added ? <Check className="size-4" aria-hidden="true" /> : <ShoppingBag className="size-4" aria-hidden="true" />}
      {stock < 1 ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
    </Button>
  );
}
