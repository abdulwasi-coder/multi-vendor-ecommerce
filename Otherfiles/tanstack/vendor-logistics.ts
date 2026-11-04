import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

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
}

const PAGE_SIZE = 10;

export function useVendorLogistics(page: number, search: string) {
  return useQuery({
    queryKey: ["vendor-logistics", page, search],
    queryFn: async ({ signal }) => {
      const response = await api.get<VendorLogisticsResponse>(
        "/vendor/LogisticData",
        {
          params: { page, limit: PAGE_SIZE, search },
          signal,
        },
      );

      if (
        !response.data.success ||
        !Array.isArray(response.data.products) ||
        !response.data.statuses ||
        typeof response.data.totalProducts !== "number" ||
        typeof response.data.totalMatches !== "number" ||
        typeof response.data.currentPage !== "number" ||
        typeof response.data.totalPages !== "number"
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
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
