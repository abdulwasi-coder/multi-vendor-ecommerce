"use client";

import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  keepPreviousData,
  useQuery,
  type QueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Category } from "@/components/ui/admin/columns";

export const CATEGORY_PAGE_SIZE = 10;
const CATEGORY_PAGE_STALE_TIME = 60_000;
const CATEGORY_PAGE_GC_TIME = 10 * 60_000;
const emptyCategories: Category[] = [];

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
  page: (page: number) => ["admin-categories", "page", page] as const,
  nameSearch: ["admin-categories", "name-search"] as const,
  name: (name: string) => ["admin-categories", "name-search", name] as const,
};

async function fetchCategoryPage(
  page: number,
  signal?: AbortSignal,
): Promise<CategoryPageData> {
  const response = await api.get<CategoryPageData>("/admin/getAllCategories", {
    params: { page, limit: CATEGORY_PAGE_SIZE },
    signal,
  });
  return response.data;
}

export function useAdminCategoryPage(page: number, enabled = true) {
  return useQuery({
    queryKey: adminCategoryQueryKeys.page(page),
    queryFn: ({ signal }) => fetchCategoryPage(page, signal),
    enabled,
    staleTime: CATEGORY_PAGE_STALE_TIME,
    gcTime: CATEGORY_PAGE_GC_TIME,
    placeholderData: keepPreviousData,
  });
}

export function prefetchAdminCategoryPage(
  queryClient: QueryClient,
  page: number,
) {
  return queryClient.prefetchQuery({
    queryKey: adminCategoryQueryKeys.page(page),
    queryFn: ({ signal }) => fetchCategoryPage(page, signal),
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

export function useCategoryNameSearch(
  search: string,
  enabled = true,
  minLength = 2,
) {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const normalizedSearch = search.trim();

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(normalizedSearch),
      300,
    );
    return () => window.clearTimeout(timeoutId);
  }, [normalizedSearch]);

  const query = useQuery({
    queryKey: adminCategoryQueryKeys.name(debouncedSearch),
    queryFn: async ({ signal }) => {
      const response = await api.get<{ categories: Category[] }>(
        "/admin/specificCategoryName",
        { params: { name: debouncedSearch }, signal },
      );
      return response.data.categories ?? [];
    },
    enabled: enabled && debouncedSearch.length >= minLength,
    staleTime: 60_000,
  });

  const isActive = normalizedSearch.length >= minLength;
  const isCurrentSearch = normalizedSearch === debouncedSearch;
  const isDebouncing = isActive && !isCurrentSearch;

  return {
    categories: isCurrentSearch ? query.data ?? emptyCategories : emptyCategories,
    debouncedSearch,
    errorMessage:
      isActive && isCurrentSearch && query.error
        ? isAxiosError(query.error)
          ? query.error.response?.data?.message ?? "Could not search categories."
          : "Could not search categories."
        : "",
    isActive,
    isDebouncing,
    isSearching: isDebouncing || (isActive && query.isFetching),
  };
}

async function getUserData() {
  const res = await api.get("/user/userProfile", {
    withCredentials: true,
  });
  console.log(res.data);
  return res.data;
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
