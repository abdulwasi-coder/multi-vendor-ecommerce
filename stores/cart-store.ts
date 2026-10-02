"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartLine = { id: string; name: string; price: number; quantity: number; image?: string };
type CartState = {
  items: CartLine[];
  addItem: (item: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(persist((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const found = state.items.find((line) => line.id === item.id);
    const quantity = item.quantity ?? 1;
    return { items: found ? state.items.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + quantity } : line) : [...state.items, { ...item, quantity }] };
  }),
  setQuantity: (id, quantity) => set((state) => ({ items: quantity < 1 ? state.items.filter((line) => line.id !== id) : state.items.map((line) => line.id === id ? { ...line, quantity } : line) })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((line) => line.id !== id) })),
  clear: () => set({ items: [] }),
}), { name: "town-market-cart", storage: createJSONStorage(() => typeof window === "undefined" ? { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } : localStorage), skipHydration: true }));
