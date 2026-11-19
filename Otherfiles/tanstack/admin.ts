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
  _id: { year: number; month: number };
  monthlyEarning: number;
}

export interface AdminDashboardData {
  success: boolean;
  summary: AdminDashboardSummary;
  PendingVendors: unknown[];
  chartData?: AdminDashboardChartPoint[];
  pendingPayout?: { PendingPayoutMoney: number }[];
}

export const adminDashboardQueryKey = () => ["admin-dashboard"] as const;

const ADMIN_DASHBOARD_STALE_TIME = 60_000;

function adminDashboardQueryOptions(cookieHeader?: string) {
  return {
    queryKey: adminDashboardQueryKey(),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<ReturnType<typeof adminDashboardQueryKey>>) => {
      const response = await api.get<AdminDashboardData>(
        "/admin/getAdminDashboard",
        {
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
      return response.data;
    },
    staleTime: ADMIN_DASHBOARD_STALE_TIME,
  };
}

export function useAdminDashboard(enabled = true) {
  return useQuery({ ...adminDashboardQueryOptions(), enabled });
}

export async function prefetchAdminDashboard(
  queryClient: QueryClient,
  cookieHeader?: string,
) {
  await queryClient.prefetchQuery(adminDashboardQueryOptions(cookieHeader));
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
}

export interface VendorBalanceLedgerData {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalVendors: number;
  vendorsData: VendorLedgerEntry[];
}

export const adminVendorLedgerQueryKey = (limit: number) =>
  ["admin-vendor-balance-ledger", limit] as const;

const ADMIN_VENDOR_LEDGER_STALE_TIME = 30_000;

function vendorBalanceLedgerQueryOptions(
  limit: number,
  cookieHeader?: string,
) {
  return {
    queryKey: adminVendorLedgerQueryKey(limit),
    queryFn: async ({
      signal,
    }: QueryFunctionContext<ReturnType<typeof adminVendorLedgerQueryKey>>) => {
      const response = await api.get<VendorBalanceLedgerData>(
        "/admin/getVendorBalanceLedger",
        {
          params: { limit },
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );
      return response.data;
    },
    staleTime: ADMIN_VENDOR_LEDGER_STALE_TIME,
  };
}

export function useVendorBalanceLedger(limit = 5, enabled = true) {
  return useQuery({
    ...vendorBalanceLedgerQueryOptions(limit),
    enabled,
  });
}

export async function prefetchAdminVendorBalanceLedger(
  queryClient: QueryClient,
  limit: number,
  cookieHeader?: string,
) {
  await queryClient.prefetchQuery(
    vendorBalanceLedgerQueryOptions(limit, cookieHeader),
  );
}

export interface AdminRevenueSeriesPoint {
  date: string;
  current: number;
  previous: number;
}

export function buildAdminRevenueSeries(
  chartData: AdminDashboardChartPoint[] | undefined,
): AdminRevenueSeriesPoint[] {
  const earningByMonth = new Map<string, number>();
  let latestMonth: Date | null = null;

  for (const point of chartData ?? []) {
    const year = point?._id?.year;
    const month = point?._id?.month;
    if (!year || !month) continue;
    const key = `${year}-${month}`;
    earningByMonth.set(
      key,
      (earningByMonth.get(key) ?? 0) + (point.monthlyEarning ?? 0),
    );
    const monthDate = new Date(Date.UTC(year, month - 1, 1));
    if (!latestMonth || monthDate > latestMonth) latestMonth = monthDate;
  }

  const reference =
    latestMonth ??
    new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1));

  const points: AdminRevenueSeriesPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const current = new Date(
      Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - i, 1),
    );
    const previous = new Date(
      Date.UTC(current.getUTCFullYear() - 1, current.getUTCMonth(), 1),
    );
    points.push({
      date: current.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      current:
        earningByMonth.get(
          `${current.getUTCFullYear()}-${current.getUTCMonth() + 1}`,
        ) ?? 0,
      previous:
        earningByMonth.get(
          `${previous.getUTCFullYear()}-${previous.getUTCMonth() + 1}`,
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
