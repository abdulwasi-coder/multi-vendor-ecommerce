"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type WishlistItem = { id: string; name: string; price: number; image?: string };
type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
};

export const useWishlistStore = create<WishlistState>()(persist((set) => ({
  items: [],
  toggle: (item) => set((state) => ({ items: state.items.some((saved) => saved.id === item.id) ? state.items.filter((saved) => saved.id !== item.id) : [...state.items, item] })),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}), {
  name: "town-market-wishlist",
  storage: createJSONStorage(() => typeof window === "undefined" ? { getItem: () => null, setItem: () => undefined, removeItem: () => undefined } : localStorage),
  skipHydration: true,
}));
