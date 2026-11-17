import api from "@/lib/axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface VendorOrderItem {
  productID?: { name?: string; sku?: string } | null;
  quantity: number;
  price: number;
  subtotal: number;
  color?: string;
}

export interface VendorOrder {
  _id: string;
  status: string;
  subOrderTotal: number;
  vendorNetEarned: number;
  platformComissionCut?: number;
  isPaidOutToVendor?: boolean;
  createdAt: string;
  updatedAt?: string;
  payoutReleaseDate?: string;
  customerID?: { name?: string } | string | null;
  ParentorderID?: {
    shippingAddress?: {
      phone?: string;
      address?: string;
      city?: string;
      country?: string;
      postalCode?: string;
    };
    createdAt?: string;
    customerID?: unknown;
  } | null;
  items: VendorOrderItem[];
}

interface VendorOrdersResponse {
  success: boolean;
  message?: string;
  orders?: VendorOrder[];
  totalOrders?: number;
  currentPage?: number;
  totalPages?: number;
}

export const vendorOrdersQueryKey = (
  page: number,
  limit: number,
  status: string,
  search: string,
) => ["vendor-orders", page, limit, status, search] as const;

function vendorOrdersQueryOptions(
  page: number,
  limit: number,
  status: string,
  search: string,
) {
  return {
    queryKey: vendorOrdersQueryKey(page, limit, status, search),
    queryFn: async ({ signal }: { signal: AbortSignal }) => {
      const response = await api.get<VendorOrdersResponse>(
        "/vendor/vendorOrder",
        {
          params: { page, limit, status, search: search || undefined },
          signal,
        },
      );
      if (!response.data.success || !Array.isArray(response.data.orders)) {
        throw new Error(
          response.data.message ?? "Vendor orders were not returned.",
        );
      }
      return {
        orders: response.data.orders,
        totalOrders: response.data.totalOrders ?? 0,
        currentPage: response.data.currentPage ?? page,
        totalPages: response.data.totalPages ?? 1,
      };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  };
}

export function useVendorOrders(
  page: number,
  limit: number,
  status: string,
  search: string,
) {
  return useQuery(vendorOrdersQueryOptions(page, limit, status, search));
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.put<{ success: boolean; message?: string }>(
        `/vendor/UpdateOrderStatus/${id}`,
        { status },
      );
      if (!response.data.success) {
        throw new Error(response.data.message ?? "Could not update status.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
    },
  });
}
