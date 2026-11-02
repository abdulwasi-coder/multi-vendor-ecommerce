import api from "@/lib/axios";
import {
  useQuery,
  type QueryClient,
  type QueryFunctionContext,
} from "@tanstack/react-query";

export interface VendorProduct {
  _id: string;
  name: string;
  description: string;
  brand: string;
  categoryID: string | { _id: string; name: string };
  stock: number;
  price: number;
  discount: number;
  sku: string;
  status: "archieved" | "banned" | "active" | "inactive";
}

export interface VendorProductSummary {
  totalProducts: number;
  totalStock: number;
  archivedProducts: number;
  lowStockProducts: number;
}

interface VendorProductsResponse {
  success: boolean;
  message?: string;
  products?: VendorProduct[];
  summary?: VendorProductSummary;
}

export const vendorProductsQueryKey = ["vendor-products"] as const;
const VENDOR_PRODUCTS_STALE_TIME = 5 * 60_000;

function vendorProductsQueryOptions(cookieHeader?: string) {
  return {
    queryKey: vendorProductsQueryKey,
    queryFn: async ({
      signal,
    }: QueryFunctionContext<typeof vendorProductsQueryKey>) => {
      const response = await api.get<VendorProductsResponse>(
        "/vendor/getProducts",
        {
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );

      if (!response.data.success || !Array.isArray(response.data.products)) {
        throw new Error(
          response.data.message ?? "Vendor products were not returned.",
        );
      }

      if (!response.data.summary) {
        throw new Error("Vendor product summary was not returned.");
      }

      return {
        products: response.data.products,
        summary: response.data.summary,
      };
    },
    staleTime: VENDOR_PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
  };
}

export function useVendorProducts() {
  return useQuery(vendorProductsQueryOptions());
}

export async function prefetchVendorProducts(
  queryClient: QueryClient,
  cookieHeader: string,
) {
  await queryClient.prefetchQuery(vendorProductsQueryOptions(cookieHeader));
}
