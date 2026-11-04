import api from "@/lib/axios";
import {
  keepPreviousData,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";

export interface VendorLogisticsProduct {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  status: string;
  thumbnailImage?: {
    publicId?: string;
  };
  Category: string;
  discount: number;
  rating: number;
}

interface VendorLogisticsResponse {
  success: boolean;
  message?: string;
  products?: VendorLogisticsProduct[];
  statuses?: {
    urgentCount: number;
    mediumCount: number;
    healthyCount: number;
  };
  totalProducts?: number;
  totalMatches?: number;
  currentPage?: number;
  totalPages?: number;
  skipped?: number;
  limit?: number;
}

export const vendorLogisticsQueryKey = (
  page: number,
  limit: number,
  search: string,
) => ["vendor-logistics", page, limit, search] as const;

function vendorLogisticsQueryOptions(
  page: number,
  limit: number,
  search: string,
) {
  return {
    queryKey: vendorLogisticsQueryKey(page, limit, search),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const response = await api.get<VendorLogisticsResponse>(
        "/vendor/LogisticData",
        {
          params: { page, limit, skip: (page - 1) * limit, search },
          signal,
        },
      );

      if (
        !response.data.success ||
        !Array.isArray(response.data.products) ||
        !response.data.statuses ||
        typeof response.data.statuses.urgentCount !== "number" ||
        typeof response.data.statuses.mediumCount !== "number" ||
        typeof response.data.statuses.healthyCount !== "number" ||
        typeof response.data.totalProducts !== "number" ||
        typeof response.data.totalMatches !== "number" ||
        typeof response.data.currentPage !== "number" ||
        typeof response.data.totalPages !== "number" ||
        typeof response.data.skipped !== "number" ||
        typeof response.data.limit !== "number"
      ) {
        throw new Error(
          response.data.message ?? "Vendor logistics data was not returned.",
        );
      }

      return {
        products: response.data.products,
        statuses: response.data.statuses,
        totalProducts: response.data.totalProducts,
        totalMatches: response.data.totalMatches,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        skipped: response.data.skipped,
        limit: response.data.limit,
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  };
}

export function useVendorLogistics(
  page: number,
  limit: number,
  search: string,
) {
  return useQuery(vendorLogisticsQueryOptions(page, limit, search));
}

export async function prefetchVendorLogisticsPage(
  queryClient: QueryClient,
  page: number,
  limit: number,
  search: string,
) {
  await queryClient.prefetchQuery(
    vendorLogisticsQueryOptions(page, limit, search),
  );
}
