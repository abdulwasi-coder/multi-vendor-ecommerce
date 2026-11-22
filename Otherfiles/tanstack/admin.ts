import api from "@/lib/axios";
import {
  keepPreviousData,
  useQuery,
  type QueryClient,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import type { Category } from "@/components/ui/admin/columns";

export const CATEGORY_PAGE_SIZE = 10;
const CATEGORY_PAGE_STALE_TIME = 60_000;
const CATEGORY_PAGE_GC_TIME = 10 * 60_000;

export interface CategoryPageData {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
  skipped: number;
  limit: number;
}

export const adminCategoryQueryKeys = {
  pages: ["admin-categories", "page"] as const,
  page: (page: number, limit: number) =>
    ["admin-categories", "page", page, limit] as const,
  nameSearch: ["admin-categories", "name-search"] as const,
  name: (name: string) => ["admin-categories", "name-search", name] as const,
  leafName: (name: string) =>
    ["admin-categories", "name-search", "leaf", name] as const,
};

async function fetchCategoryPage(
  page: number,
  limit: number,
  signal?: AbortSignal,
): Promise<CategoryPageData> {
  const response = await api.get<CategoryPageData>("/admin/getAllCategories", {
    params: { page, limit },
    signal,
  });
  return response.data;
}

export function useAdminCategoryPage(
  page: number,
  limit: number,
  enabled = true,
) {
  return useQuery({
    queryKey: adminCategoryQueryKeys.page(page, limit),
    queryFn: ({ signal }) => fetchCategoryPage(page, limit, signal),
    enabled,
    staleTime: CATEGORY_PAGE_STALE_TIME,
    gcTime: CATEGORY_PAGE_GC_TIME,
    placeholderData: keepPreviousData,
  });
}

export function prefetchAdminCategoryPage(
  queryClient: QueryClient,
  page: number,
  limit: number,
) {
  return queryClient.prefetchQuery({
    queryKey: adminCategoryQueryKeys.page(page, limit),
    queryFn: ({ signal }) => fetchCategoryPage(page, limit, signal),
    staleTime: CATEGORY_PAGE_STALE_TIME,
    gcTime: CATEGORY_PAGE_GC_TIME,
  });
}

export async function invalidateAdminCategoryQueries(
  queryClient: QueryClient,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: adminCategoryQueryKeys.nameSearch }),
    queryClient.invalidateQueries({ queryKey: adminCategoryQueryKeys.pages }),
  ]);
}

async function getUserData() {
  const res = await api.get("/user/userProfile", {
    withCredentials: true,
  });
  console.log(res.data);
  return res.data;
}

export interface AdminDashboardSummary {
  grossMerchandizeValue: number;
  activeVendorCount: number;
  PlatformRevenue: number;
  registeredCustomerCount: number;
}

export interface AdminDashboardChartPoint {
  _id: { year: number; month: number; day?: number };
  monthlyEarning: number;
}

export type AdminDashboardRange = "3Months" | "6Months" | "12Months" | "1Month";

export const ADMIN_DASHBOARD_RANGES: {
  value: AdminDashboardRange;
  label: string;
  months: number;
}[] = [
  { value: "1Month", label: "1 Month", months: 1 },
  { value: "3Months", label: "3 Months", months: 3 },
  { value: "6Months", label: "6 Months", months: 6 },
  { value: "12Months", label: "1 Year", months: 12 },
];

export const DEFAULT_ADMIN_DASHBOARD_RANGE: AdminDashboardRange = "12Months";

export function adminDashboardMonths(range: AdminDashboardRange): number {
  return (
    ADMIN_DASHBOARD_RANGES.find((item) => item.value === range)?.months ?? 12
  );
}

export interface AdminDashboardData {
  success: boolean;
  range?: AdminDashboardRange;
  summary: AdminDashboardSummary;
  PendingVendors: unknown[];
  chartData?: AdminDashboardChartPoint[];
  previousChartData?: AdminDashboardChartPoint[];
  pendingPayout?: { PendingPayoutMoney: number }[];
}

export const adminDashboardQueryKey = (range: AdminDashboardRange) =>
  ["admin-dashboard", range] as const;

const ADMIN_DASHBOARD_STALE_TIME = 60_000;

function adminDashboardQueryOptions(
  range: AdminDashboardRange,
  cookieHeader?: string,
) {
  return {
    queryKey: adminDashboardQueryKey(range),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<ReturnType<typeof adminDashboardQueryKey>>) => {
      const response = await api.get<AdminDashboardData>(
        "/admin/getAdminDashboard",
        {
          params: { range },
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
      return response.data;
    },
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  };
}

export function useAdminDashboard(
  range: AdminDashboardRange,
  enabled = true,
) {
  return useQuery({ ...adminDashboardQueryOptions(range), enabled });
}

export async function prefetchAdminDashboard(
  queryClient: QueryClient,
  range: AdminDashboardRange,
  cookieHeader?: string,
) {
  await queryClient.prefetchQuery(
    adminDashboardQueryOptions(range, cookieHeader),
  );
}

export interface AdminPendingVendorUser {
  _id: string;
  email?: string;
}

export interface AdminPendingVendor {
  _id: string;
  name: string;
  lastName?: string;
  companyName: string;
  country?: string;
  createdAt?: string;
  userid: string | AdminPendingVendorUser | null;
}

export interface AdminPendingVendorsPage {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalVendors: number;
  vendors: AdminPendingVendor[];
}

export const adminPendingVendorsQueryKey = (page: number) =>
  ["admin-pending-vendors", page] as const;

const ADMIN_PENDING_VENDORS_STALE_TIME = 30_000;

function adminPendingVendorsQueryOptions(
  page: number,
  limit: number,
  cookieHeader?: string,
) {
  return {
    queryKey: adminPendingVendorsQueryKey(page),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<ReturnType<typeof adminPendingVendorsQueryKey>>) => {
      const response = await api.get<AdminPendingVendorsPage>(
        "/admin/getVendors",
        {
          params: { status: "pending", page, limit },
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
      if (response.data.success === false) {
        throw new Error("Could not load pending vendors.");
      }
      return response.data;
    },
    staleTime: ADMIN_PENDING_VENDORS_STALE_TIME,
  };
}

export function useAdminPendingVendors(page: number, limit: number) {
  return useQuery(adminPendingVendorsQueryOptions(page, limit));
}

export async function prefetchAdminPendingVendors(
  queryClient: QueryClient,
  page: number,
  limit: number,
  cookieHeader?: string,
) {
  await queryClient.prefetchQuery(
    adminPendingVendorsQueryOptions(page, limit, cookieHeader),
  );
}

export interface VendorLedgerEntry {
  vendorID: string;
  BusinessName: string;
  grossSales: number;
  vendorPayoutBalance: number;
  platfromRevenue: number;
  orderCount?: number;
}

export interface VendorBalanceLedgerSummary {
  totalVendors: number;
  avgNetEarning: number;
  TotalGrossEarnedFromVendors: number;
  TotalOrdersProcessed: number;
}

export interface VendorBalanceLedgerData {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalVendors: number;
  vendorsData: VendorLedgerEntry[];
  summaryStats?: VendorBalanceLedgerSummary[];
}

export const adminVendorLedgerQueryKey = (limit: number, page: number) =>
  ["admin-vendor-balance-ledger", limit, page] as const;

const ADMIN_VENDOR_LEDGER_STALE_TIME = 30_000;

function vendorBalanceLedgerQueryOptions(
  limit: number,
  page: number,
  cookieHeader?: string,
) {
  return {
    queryKey: adminVendorLedgerQueryKey(limit, page),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<
      ReturnType<typeof adminVendorLedgerQueryKey>
    >) => {
      const response = await api.get<VendorBalanceLedgerData>(
        "/admin/getVendorBalanceLedger",
        {
          params: { limit, page },
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
      return response.data;
    },
    staleTime: ADMIN_VENDOR_LEDGER_STALE_TIME,
  };
}

export function useVendorBalanceLedger(
  limit = 5,
  enabled = true,
  page = 1,
) {
  return useQuery({
    ...vendorBalanceLedgerQueryOptions(limit, page),
    enabled,
  });
}

export async function prefetchAdminVendorBalanceLedger(
  queryClient: QueryClient,
  limit: number,
  cookieHeader?: string,
  page = 1,
) {
  await queryClient.prefetchQuery(
    vendorBalanceLedgerQueryOptions(limit, page, cookieHeader),
  );
}

export interface AdminOrderFeedCustomer {
  _id?: string;
  name?: string;
  email?: string;
}

export interface AdminOrderFeedItem {
  _id: string;
  customerID?: AdminOrderFeedCustomer | string | null;
  totalPrice: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentIntentId?: string | null;
  shippingAddress?: {
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  createdAt?: string;
}

export interface AdminOrderFeedPage {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  orders: AdminOrderFeedItem[];
}

export const adminOrderFeedQueryKey = (page: number, limit: number) =>
  ["admin-order-feed", page, limit] as const;

const ADMIN_ORDER_FEED_STALE_TIME = 30_000;

function adminOrderFeedQueryOptions(
  page: number,
  limit: number,
  cookieHeader?: string,
) {
  return {
    queryKey: adminOrderFeedQueryKey(page, limit),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<ReturnType<typeof adminOrderFeedQueryKey>>) => {
      const response = await api.get<AdminOrderFeedPage>(
        "/admin/getAdminOrderFeed",
        {
          params: { page, limit },
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
      return response.data;
    },
    staleTime: ADMIN_ORDER_FEED_STALE_TIME,
  };
}

export function useAdminOrderFeed(page: number, limit: number) {
  return useQuery(adminOrderFeedQueryOptions(page, limit));
}

export async function prefetchAdminOrderFeed(
  queryClient: QueryClient,
  page: number,
  limit: number,
  cookieHeader?: string,
) {
  await queryClient.prefetchQuery(
    adminOrderFeedQueryOptions(page, limit, cookieHeader),
  );
}

export interface AdminRevenueSeriesPoint {
  date: string;
  current: number;
  previous: number;
}

function monthKey(year: number, month: number) {
  return `${year}-${month}`;
}

export function buildAdminRevenueSeries(
  chartData: AdminDashboardChartPoint[] | undefined,
  previousChartData: AdminDashboardChartPoint[] | undefined,
  months: number,
): AdminRevenueSeriesPoint[] {
  const isDaily = [...(chartData ?? []), ...(previousChartData ?? [])].some(
    (point) => point?._id?.day != null,
  );

  const toEarningMap = (points: AdminDashboardChartPoint[] | undefined) => {
    const map = new Map<string, number>();
    for (const point of points ?? []) {
      const year = point?._id?.year;
      const month = point?._id?.month;
      const day = point?._id?.day;
      if (!year || !month) continue;
      const key = day ? `${year}-${month}-${day}` : `${year}-${month}`;
      map.set(key, (map.get(key) ?? 0) + (point.monthlyEarning ?? 0));
    }
    return map;
  };

  const currentMap = toEarningMap(chartData);
  const previousMap = toEarningMap(previousChartData);

  let latest: Date | null = null;
  for (const point of chartData ?? []) {
    const year = point?._id?.year;
    const month = point?._id?.month;
    const day = point?._id?.day;
    if (!year || !month) continue;
    const pointDate = new Date(Date.UTC(year, month - 1, day ?? 1));
    if (!latest || pointDate > latest) latest = pointDate;
  }

  const DAY_MS = 24 * 60 * 60 * 1000;
  const points: AdminRevenueSeriesPoint[] = [];

  if (isDaily) {
    const days = months * 30;
    const reference =
      latest ??
      new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
        ),
      );
    const referenceDay = Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
    );
    for (let i = days - 1; i >= 0; i--) {
      const current = new Date(referenceDay - i * DAY_MS);
      const previous = new Date(referenceDay - (i + days) * DAY_MS);
      points.push({
        date: current.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        current:
          currentMap.get(
            `${current.getUTCFullYear()}-${current.getUTCMonth() + 1}-${current.getUTCDate()}`,
          ) ?? 0,
        previous:
          previousMap.get(
            `${previous.getUTCFullYear()}-${previous.getUTCMonth() + 1}-${previous.getUTCDate()}`,
          ) ?? 0,
      });
    }
    return points;
  }

  const reference =
    latest ??
    new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1));

  for (let i = months - 1; i >= 0; i--) {
    const current = new Date(
      Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - i, 1),
    );
    const previous = new Date(
      Date.UTC(
        reference.getUTCFullYear(),
        reference.getUTCMonth() - i - months,
        1,
      ),
    );
    points.push({
      date: current.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      current:
        currentMap.get(
          monthKey(current.getUTCFullYear(), current.getUTCMonth() + 1),
        ) ?? 0,
      previous:
        previousMap.get(
          monthKey(previous.getUTCFullYear(), previous.getUTCMonth() + 1),
        ) ?? 0,
    });
  }
  return points;
}

export function useUser() {
  const query = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUserData,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return query;
}
