import api from "@/lib/axios";
import type { CategoryAttributeDefinition } from "@/lib/category-attributes";
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
      brands?: string[];
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

interface VendorCategoryAttributesResponse {
  success: boolean;
  message?: string;
  categoryId?: string;
  attributes?: CategoryAttributeDefinition[];
}

export function useVendorCategoryAttributes(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["vendor-category-attributes", categoryId],
    enabled: Boolean(categoryId),
    queryFn: async ({ signal }) => {
      const response = await api.get<VendorCategoryAttributesResponse>(
        `/vendor/productCategories/${categoryId}/attributes`,
        { signal },
      );

      if (
        !response.data.success ||
        !Array.isArray(response.data.attributes)
      ) {
        throw new Error(
          response.data.message ?? "Category attributes were not returned.",
        );
      }

      return response.data.attributes;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}
