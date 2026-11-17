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
  lineId: string;
  quantity: number;
  product: CartProductSnapshot;
};

const lineIdFor = (product: CartProductSnapshot) =>
  `${product.id}::${product.color ?? ""}`;

type CustomerCartState = {
  items: CartItem[];
  hydrated: boolean;
  addItem: (product: CartProductSnapshot) => boolean;
  removeItem: (productId: string) => void;
  changeQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  markHydrated: () => void;
};

export const useCustomerCart = create<CustomerCartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      addItem: (product) => {
        if (product.stock < 1) return false;

        const lineId = lineIdFor(product);
        const sameProductQuantity = get().items
          .filter((item) => item.productId === product.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        if (sameProductQuantity >= product.stock) return false;

        set((state) => {
          const item = state.items.find((entry) => entry.lineId === lineId);

          if (item) {
            return {
              items: state.items.map((entry) =>
                entry.lineId === lineId
                  ? {
                      ...entry,
                      quantity: Math.min(
                        entry.quantity + 1,
                        product.stock -
                          (sameProductQuantity - entry.quantity),
                      ),
                      product,
                    }
                  : entry,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { productId: product.id, lineId, quantity: 1, product },
            ],
          };
        });

        return true;
      },
      removeItem: (lineId) =>
        set((state) => ({
          items: state.items.filter((item) => item.lineId !== lineId),
        })),
      changeQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.lineId !== lineId)
              : state.items.map((item) =>
                  item.lineId === lineId ? { ...item, quantity } : item,
                ),
        })),
      clearCart: () => set({ items: [] }),
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
            const lineId =
              item.lineId ?? lineIdFor(item.product ?? ({ id: item.productId } as CartProductSnapshot));
            const existing = merged.get(lineId);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              merged.set(lineId, { ...item, lineId });
            }
          }
          state.items = [...merged.values()];
        }
        state?.markHydrated();
      },
    },
  ),
);
