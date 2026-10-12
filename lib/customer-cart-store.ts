"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartItem = {
  productId: string;
  quantity: number;
};

type CustomerCartState = {
  items: CartItem[];
  hydrated: boolean;
  addItem: (productId: string, stock: number) => boolean;
  removeItem: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  markHydrated: () => void;
};

export const useCustomerCart = create<CustomerCartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      addItem: (productId, stock) => {
        if (stock < 1) return false;

        const existingItem = get().items.find((item) => item.productId === productId);
        if (existingItem && existingItem.quantity >= stock) return false;

        set((state) => {
          const item = state.items.find((entry) => entry.productId === productId);

          if (item) {
            return {
              items: state.items.map((entry) =>
                entry.productId === productId
                  ? { ...entry, quantity: Math.min(entry.quantity + 1, stock) }
                  : entry,
              ),
            };
          }

          return { items: [...state.items, { productId, quantity: 1 }] };
        });

        return true;
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      changeQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                ),
        })),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "marketly-customer-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => state?.markHydrated(),
    },
  ),
);
