"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartProductSnapshot = {
  id: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
  color?: string;
  image?: string;
  brand?: string;
  vendorCompanyName?: string;
};

type CartItem = {
  productId: string;
  quantity: number;
  product: CartProductSnapshot;
};

type CustomerCartState = {
  items: CartItem[];
  hydrated: boolean;
  addItem: (product: CartProductSnapshot) => boolean;
  removeItem: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  markHydrated: () => void;
};

export const useCustomerCart = create<CustomerCartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      addItem: (product) => {
        if (product.stock < 1) return false;

        const existingItem = get().items.find(
          (item) => item.productId === product.id,
        );
        if (existingItem && existingItem.quantity >= product.stock)
          return false;

        set((state) => {
          const item = state.items.find(
            (entry) => entry.productId === product.id,
          );

          if (item) {
            return {
              items: state.items.map((entry) =>
                entry.productId === product.id
                  ? {
                      ...entry,
                      quantity: Math.min(entry.quantity + 1, product.stock),
                      product,
                    }
                  : entry,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { productId: product.id, quantity: 1, product },
            ],
          };
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          const merged = new Map<string, CartItem>();
          for (const item of state.items) {
            const existing = merged.get(item.productId);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              merged.set(item.productId, { ...item });
            }
          }
          state.items = [...merged.values()];
        }
        state?.markHydrated();
      },
    },
  ),
);
