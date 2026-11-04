import api from "@/lib/axios";
import {
  keepPreviousData,
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
  totalProducts?: number;
  totalMatches?: number;
  currentPage?: number;
  totalPages?: number;
  skipped?: number;
  limit?: number;
}

export const vendorProductsQueryKey = (
  page: number,
  limit: number,
  search: string,
) => ["vendor-products", page, limit, search] as const;
export const VENDOR_PRODUCTS_PAGE_SIZE = 10;
const VENDOR_PRODUCTS_STALE_TIME = 60_000;

function vendorProductsQueryOptions(
  page: number,
  limit: number,
  search: string,
  cookieHeader?: string,
) {
  return {
    queryKey: vendorProductsQueryKey(page, limit, search),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<
      ReturnType<typeof vendorProductsQueryKey>
    >) => {
      const response = await api.get<VendorProductsResponse>(
        "/vendor/getProducts",
        {
          params: {
            page,
            limit,
            skip: (page - 1) * limit,
            search,
          },
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );

      if (!response.data.success || !Array.isArray(response.data.products)) {
        throw new Error(
          response.data.message ?? "Vendor products were not returned.",
        );
      }

      if (
        !response.data.summary ||
        typeof response.data.totalProducts !== "number" ||
        typeof response.data.totalMatches !== "number" ||
        typeof response.data.currentPage !== "number" ||
        typeof response.data.totalPages !== "number" ||
        typeof response.data.skipped !== "number" ||
        typeof response.data.limit !== "number"
      ) {
        throw new Error("Vendor product pagination data was not returned.");
      }

      return {
        products: response.data.products,
        summary: response.data.summary,
        totalProducts: response.data.totalProducts,
        totalMatches: response.data.totalMatches,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        skipped: response.data.skipped,
        limit: response.data.limit,
      };
    },
    staleTime: VENDOR_PRODUCTS_STALE_TIME,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  };
}

export function useVendorProducts(
  page: number,
  limit: number,
  search: string,
) {
  return useQuery(vendorProductsQueryOptions(page, limit, search));
}

export async function prefetchVendorProducts(
  queryClient: QueryClient,
  cookieHeader: string,
) {
  await queryClient.prefetchQuery(
    vendorProductsQueryOptions(1, VENDOR_PRODUCTS_PAGE_SIZE, "", cookieHeader),
  );
}

export async function prefetchVendorProductsPage(
  queryClient: QueryClient,
  page: number,
  limit: number,
  search: string,
) {
  await queryClient.prefetchQuery(
    vendorProductsQueryOptions(page, limit, search),
  );
}
