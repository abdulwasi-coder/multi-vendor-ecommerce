"use client";

import { useEffect } from "react";
import { useCustomerCart } from "@/lib/customer-cart-store";

export function CartHydration() {
  useEffect(() => {
    void useCustomerCart.persist.rehydrate();
  }, []);

  return null;
}
