"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/ui/customer/add-to-cart-button";
import type { CartProductSnapshot } from "@/lib/customer-cart-store";

export function ProductPurchasePanel({
  product,
  colors,
}: {
  product: Omit<CartProductSnapshot, "color">;
  colors: string[];
}) {
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");

  return (
    <div>
      {colors.length > 0 && (
        <div className="border-b py-2.5">
          <p className="text-xs text-muted-foreground">
            Color:{" "}
            <span className="font-medium text-foreground">
              {selectedColor}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color) => {
              const selected = color === selectedColor;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  aria-pressed={selected}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    selected
                      ? "border-[#e77600] font-semibold text-[#0f1111] ring-1 ring-[#e77600]"
                      : "border-[#d5d9d9] text-[#0f1111] hover:border-[#888c8c]"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <AddToCartButton
        product={{
          ...product,
          color: selectedColor || undefined,
        }}
      />
    </div>
  );
}
