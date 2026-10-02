"use client";

import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/services/products";
import type { ProductFeedParams } from "@/types/product";

export const productQueryKeys = {
  all: ["product-feed"] as const,
  list: (params: ProductFeedParams = {}) => [...productQueryKeys.all, params] as const,
};

/** Fetches the authenticated product feed with the supplied backend filters. */
export function useProducts(params: ProductFeedParams = {}, enabled = true) {
  return useQuery({
    queryKey: productQueryKeys.list(params),
    queryFn: () => getProducts(params),
    enabled,
  });
}
