"use client";

import { useProducts } from "@/hooks/use-products";
import { newProducts } from "@/lib/homepage-content";
import { ProductCard } from "@/components/product-card";
import { Notice } from "@/components/app-ui";

export function HomeLiveProducts() {
  const query = useProducts({ page: 1, limit: 4 });
  if (query.isLoading) return <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{newProducts.map((item) => <div key={item.id} className="aspect-[4/5] animate-pulse rounded-md bg-muted" />)}</div>;
  if (query.isError) return <><Notice title="Live listings require a signed-in account">The product feed is protected by the backend. These editorial preview items are shown until current listings can be loaded.</Notice><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">{newProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></>;
  if (!query.data) return null;
  if (!query.data.product.length) return <Notice title="No live products are available">The current API returned an empty product feed. This marketplace section will fill when listings are available.</Notice>;
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{query.data.product.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}
