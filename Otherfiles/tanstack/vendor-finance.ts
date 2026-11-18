import api from "@/lib/axios";
import {
  keepPreviousData,
  useQuery,
  type QueryClient,
  type QueryFunctionContext,
} from "@tanstack/react-query";

export interface VendorFinanceBucket {
  _id: Record<string, number> | Record<string, never>;
  totalGrossSales: number;
  totalNetEarnings: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface VendorPayoutOrderItem {
  productID?: string | { name?: string };
  quantity?: number;
  price?: number;
  subtotal?: number;
}

export interface VendorPayoutOrder {
  _id: string;
  items?: VendorPayoutOrderItem[];
  vendorNetEarned: number;
  subOrderTotal: number;
  platformComissionCut: number;
  productNames?: string[];
  createdAt?: string;
  updatedAt?: string;
  payoutReleaseDate?: string;
  isPaidOutToVendor?: boolean;
  status?: string;
}

interface VendorFinanceResponse {
  success: boolean;
  message?: string;
  current?: VendorFinanceBucket[];
  previous?: VendorFinanceBucket[];
  lastPaidOrders?: VendorPayoutOrder[];
}

export type VendorFinanceRange =
  | "7Days"
  | "30Days"
  | "90Days"
  | "15Days"
  | "1Month"
  | "6Months"
  | "1Year";

export const DASHBOARD_RANGES: {
  value: VendorFinanceRange;
  label: string;
  days: number;
}[] = [
  { value: "7Days", label: "Last 7 days", days: 7 },
  { value: "30Days", label: "Last 30 days", days: 30 },
  { value: "90Days", label: "Last 90 days", days: 90 },
];

export const DEFAULT_DASHBOARD_RANGE: VendorFinanceRange = "30Days";

export function rangeDays(range: VendorFinanceRange): number {
  return DASHBOARD_RANGES.find((item) => item.value === range)?.days ?? 30;
}

export interface VendorFinanceTotals {
  totalGrossSales: number;
  totalNetEarnings: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

const EMPTY_TOTALS: VendorFinanceTotals = {
  totalGrossSales: 0,
  totalNetEarnings: 0,
  totalOrders: 0,
  pendingOrders: 0,
  processingOrders: 0,
  deliveredOrders: 0,
  cancelledOrders: 0,
};

export function sumFinanceBuckets(
  buckets: VendorFinanceBucket[] | undefined,
): VendorFinanceTotals {
  if (!buckets || buckets.length === 0) return EMPTY_TOTALS;
  return buckets.reduce<VendorFinanceTotals>(
    (acc, bucket) => ({
      totalGrossSales: acc.totalGrossSales + (bucket.totalGrossSales ?? 0),
      totalNetEarnings:
        acc.totalNetEarnings + (bucket.totalNetEarnings ?? 0),
      totalOrders: acc.totalOrders + (bucket.totalOrders ?? 0),
      pendingOrders: acc.pendingOrders + (bucket.pendingOrders ?? 0),
      processingOrders:
        acc.processingOrders + (bucket.processingOrders ?? 0),
      deliveredOrders: acc.deliveredOrders + (bucket.deliveredOrders ?? 0),
      cancelledOrders: acc.cancelledOrders + (bucket.cancelledOrders ?? 0),
    }),
    { ...EMPTY_TOTALS },
  );
}

export const vendorFinanceQueryKey = (range: VendorFinanceRange) =>
  ["vendor-finance", range] as const;

function vendorFinanceQueryOptions(
  range: VendorFinanceRange,
  cookieHeader?: string,
) {
  return {
    queryKey: vendorFinanceQueryKey(range),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<ReturnType<typeof vendorFinanceQueryKey>>) => {
      const response = await api.get<VendorFinanceResponse>(
        "/vendor/financeData",
        {
          params: { range },
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message ?? "Vendor finance data was not returned.",
        );
      }
      return {
        current: response.data.current ?? [],
        previous: response.data.previous ?? [],
        lastPaidOrders: response.data.lastPaidOrders ?? [],
      };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  };
}

export function useVendorFinance(range: VendorFinanceRange) {
  return useQuery(vendorFinanceQueryOptions(range));
}

export async function prefetchVendorFinance(
  queryClient: QueryClient,
  range: VendorFinanceRange,
  cookieHeader: string,
) {
  await queryClient.prefetchQuery(
    vendorFinanceQueryOptions(range, cookieHeader),
  );
}
