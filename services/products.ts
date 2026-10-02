import api from "@/lib/axios";
import type { ProductFeedParams, ProductFeedResponse } from "@/types/product";

export async function getProducts(params: ProductFeedParams = {}): Promise<ProductFeedResponse> {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );

  const response = await api.get<ProductFeedResponse>("/user/products", { params: query });
  return response.data;
}
