"use client";

import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Category } from "@/components/ui/admin/columns";
import { adminCategoryQueryKeys } from "@/Otherfiles/tanstack/admin";

const emptyCategories: Category[] = [];

export function useCategoryNameSearch(
  search: string,
  enabled = true,
  minLength = 2,
  leafOnly = false,
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
    queryKey: leafOnly
      ? adminCategoryQueryKeys.leafName(debouncedSearch)
      : adminCategoryQueryKeys.name(debouncedSearch),
    queryFn: async ({ signal }) => {
      const response = await api.get<{ categories: Category[] }>(
        "/admin/specificCategoryName",
        {
          params: {
            name: debouncedSearch,
            ...(leafOnly ? { leafOnly: true } : {}),
          },
          signal,
        },
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
