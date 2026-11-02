import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface VendorProductCategoryOption {
  _id: string;
  name: string;
  children: Array<{
    _id: string;
    name: string;
    children: Array<{
      _id: string;
      name: string;
    }>;
  }>;
}

interface VendorProductCategoriesResponse {
  success: boolean;
  message?: string;
  categories?: VendorProductCategoryOption[];
}

export const vendorProductCategoriesQueryKey = [
  "vendor-product-categories",
] as const;

export function useVendorProductCategories() {
  return useQuery({
    queryKey: vendorProductCategoriesQueryKey,
    queryFn: async ({ signal }) => {
      const response = await api.get<VendorProductCategoriesResponse>(
        "/vendor/productCategories",
        { signal },
      );

      if (!response.data.success || !Array.isArray(response.data.categories)) {
        throw new Error(
          response.data.message ?? "Product categories were not returned.",
        );
      }

      return response.data.categories;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
