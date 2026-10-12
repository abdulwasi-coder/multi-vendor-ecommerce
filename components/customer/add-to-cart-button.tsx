"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
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
    toast.success(`${productName} added to cart`, {
      description: "Your cart is ready whenever you are.",
      duration: 4500,
      action: {
        label: "View cart",
        onClick: () => router.push("/customer/basket"),
      },
    });
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
